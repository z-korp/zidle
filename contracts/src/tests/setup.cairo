mod setup {
    // Core imports
    use core::debug::PrintTrait;

    // Starknet imports
    use starknet::ContractAddress;
    use starknet::testing::{set_contract_address, set_account_contract_address};
    use starknet::info::{get_contract_address};

    // Dojo imports
    use dojo::world::{WorldStorage, WorldStorageTrait};
    use dojo_cairo_test::{
        spawn_test_world, NamespaceDef, TestResource, ContractDefTrait, ContractDef,
        WorldStorageTestTrait
    };

    // Internal imports
    use zidle::models::player::Player;
    use zidle::models::admin::Admin;
    use zidle::models::settings::Settings;
    use zidle::models::token_config::TokenConfig;
    use zidle::models::miner::Miner;
    use zidle::systems::character::{character, ICharacterDispatcher, ICharacterDispatcherTrait};
    use zidle::systems::resources::{resources, IResourcesDispatcher, IResourcesDispatcherTrait};
    use zidle::systems::settings::{settings, ISettingsDispatcher, ISettingsDispatcherTrait};
    use zidle::systems::character_minter::{
        character_minter, ICharacterMinterDispatcher, ICharacterMinterDispatcherTrait
    };
    use zidle::systems::gold_minter::{
        gold_minter, IGoldMinterDispatcher, IGoldMinterDispatcherTrait
    };

    use zidle::tests::mocks::erc20::{
        ERC20, IERC20Dispatcher, IERC20DispatcherTrait, IERC20MinterRoleDispatcher,
        IERC20MinterRoleDispatcherTrait
    };
    use zidle::tests::mocks::erc721::{
        ERC721, IERC721Dispatcher, IERC721DispatcherTrait, IERC721MinterRoleDispatcher,
        IERC721MinterRoleDispatcherTrait
    };

    // Constants
    fn PLAYER() -> ContractAddress {
        starknet::contract_address_const::<'PLAYER'>()
    }
    const PLAYER_NAME: felt252 = 'PLAYER';

    fn ADMIN() -> ContractAddress {
        starknet::contract_address_const::<'ADMIN'>()
    }
    const ADMIN_NAME: felt252 = 'ADMIN';

    #[derive(Drop)]
    struct Systems {
        character: ICharacterDispatcher,
        resources: IResourcesDispatcher,
        settings: ISettingsDispatcher,
        character_minter: ICharacterMinterDispatcher,
        gold_minter: IGoldMinterDispatcher,
    }

    #[derive(Drop)]
    struct Context {
        player_address: ContractAddress,
        player_id: felt252,
        player_name: felt252,
        owner: ContractAddress,
    }

    fn deploy_erc20(
        default_admin: felt252, minter: felt252, upgrader: felt252
    ) -> IERC20Dispatcher {
        let (address, _) = starknet::deploy_syscall(
            ERC20::TEST_CLASS_HASH.try_into().expect('Class hash conversion failed'),
            0,
            array![default_admin, minter, upgrader].span(),
            false
        )
            .expect('ERC20 deploy failed');
        IERC20Dispatcher { contract_address: address }
    }

    fn deploy_erc721(
        default_admin: felt252, pauser: felt252, minter: felt252, upgrader: felt252
    ) -> IERC721Dispatcher {
        let (address, _) = starknet::deploy_syscall(
            ERC721::TEST_CLASS_HASH.try_into().expect('Class hash conversion failed'),
            0,
            array![default_admin, pauser, minter, upgrader].span(),
            false
        )
            .expect('ERC721 deploy failed');
        IERC721Dispatcher { contract_address: address }
    }

    fn namespace_def() -> NamespaceDef {
        NamespaceDef {
            namespace: "zidle", resources: [
                TestResource::Model(zidle::models::admin::m_Admin::TEST_CLASS_HASH),
                TestResource::Model(zidle::models::miner::m_Miner::TEST_CLASS_HASH),
                TestResource::Model(zidle::models::player::m_Player::TEST_CLASS_HASH),
                TestResource::Model(zidle::models::settings::m_Settings::TEST_CLASS_HASH),
                TestResource::Model(zidle::models::token_config::m_TokenConfig::TEST_CLASS_HASH),
                TestResource::Contract(settings::TEST_CLASS_HASH),
                TestResource::Contract(character::TEST_CLASS_HASH),
                TestResource::Contract(resources::TEST_CLASS_HASH),
                TestResource::Contract(character_minter::TEST_CLASS_HASH),
                TestResource::Contract(gold_minter::TEST_CLASS_HASH),
                TestResource::Event(zidle::events::index::e_Mine::TEST_CLASS_HASH),
                TestResource::Event(zidle::events::index::e_Harvest::TEST_CLASS_HASH),
            ].span(),
        }
    }

    fn contract_defs(
        admin_address: felt252, character_erc721_address: felt252, gold_erc20_address: felt252
    ) -> Span<ContractDef> {
        [
            ContractDefTrait::new(@"zidle", @"character")
                .with_writer_of([dojo::utils::bytearray_hash(@"zidle")].span()),
            ContractDefTrait::new(@"zidle", @"resources")
                .with_writer_of([dojo::utils::bytearray_hash(@"zidle")].span()),
            ContractDefTrait::new(@"zidle", @"settings")
                .with_writer_of([dojo::utils::bytearray_hash(@"zidle")].span())
                .with_init_calldata(
                    [admin_address, character_erc721_address, gold_erc20_address].span()
                ),
            ContractDefTrait::new(@"zidle", @"character_minter")
                .with_writer_of([dojo::utils::bytearray_hash(@"zidle")].span())
                .with_init_calldata([character_erc721_address, 1000000, 0, 50, 0, 1].span()),
            ContractDefTrait::new(@"zidle", @"gold_minter")
                .with_writer_of([dojo::utils::bytearray_hash(@"zidle")].span())
                .with_init_calldata([gold_erc20_address, 1000000000, 0, 50000, 0, 1].span()),
        ].span()
    }

    fn create_character() -> (WorldStorage, Systems, Context) {
        let admin_felt: felt252 = ADMIN().into();
        let erc20 = deploy_erc20(admin_felt, admin_felt, admin_felt);
        let erc721 = deploy_erc721(admin_felt, admin_felt, admin_felt, admin_felt);

        let owner = get_contract_address();
        let ndef = namespace_def();
        let cdef = contract_defs(
            admin_felt, erc721.contract_address.into(), erc20.contract_address.into()
        );
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(cdef);

        let (character_address, _) = world.dns(@"character").unwrap();
        let (resources_address, _) = world.dns(@"resources").unwrap();
        let (settings_address, _) = world.dns(@"settings").unwrap();
        let (character_minter_address, _) = world.dns(@"character_minter").unwrap();
        let (gold_minter_address, _) = world.dns(@"gold_minter").unwrap();

        let systems = Systems {
            character: ICharacterDispatcher { contract_address: character_address },
            resources: IResourcesDispatcher { contract_address: resources_address },
            settings: ISettingsDispatcher { contract_address: settings_address },
            character_minter: ICharacterMinterDispatcher {
                contract_address: character_minter_address
            },
            gold_minter: IGoldMinterDispatcher { contract_address: gold_minter_address },
        };

        impersonate(ADMIN());

        IERC721MinterRoleDispatcher { contract_address: erc721.contract_address }
            .update_minter_role(character_minter_address);
        IERC20MinterRoleDispatcher { contract_address: erc20.contract_address }
            .update_minter_role(gold_minter_address);

        impersonate(PLAYER());
        systems.character.create(PLAYER_NAME);

        let context = Context {
            player_address: PLAYER(),
            player_id: PLAYER().into(),
            player_name: PLAYER_NAME,
            owner: owner,
        };

        impersonate(owner);

        (world, systems, context)
    }

    fn impersonate(address: ContractAddress) {
        set_contract_address(address);
        set_account_contract_address(address);
    }
}
