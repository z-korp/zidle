mod setup {
    // Core imports

    use core::debug::PrintTrait;

    // Starknet imports

    use starknet::ContractAddress;
    use starknet::testing::{set_contract_address};
    use starknet::info::{get_contract_address};

    // Dojo imports

    use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
    use dojo::utils::test::{spawn_test_world, deploy_contract};

    // Internal imports

    use zidle::models::player::Player;
    use zidle::systems::account::{account, IAccountDispatcher, IAccountDispatcherTrait};
    use zidle::systems::resources::{resources, IResourcesDispatcher, IResourcesDispatcherTrait};

    // Constants

    fn PLAYER() -> ContractAddress {
        starknet::contract_address_const::<'PLAYER'>()
    }

    const PLAYER_NAME: felt252 = 'PLAYER';

    #[derive(Drop)]
    struct Systems {
        account: IAccountDispatcher,
        resources: IResourcesDispatcher,
    }

    #[derive(Drop)]
    struct Context {
        player_address: ContractAddress,
        player_id: felt252,
        player_name: felt252,
        owner: ContractAddress
    }

    #[inline(always)]
    fn create_account() -> (IWorldDispatcher, Systems, Context) {
        // [Setup] Owner
        let owner = get_contract_address();

        // [Setup] World
        let mut models = core::array::ArrayTrait::new();
        models.append(zidle::models::index::player::TEST_CLASS_HASH);
        models.append(zidle::models::index::miner::TEST_CLASS_HASH);
        let world = spawn_test_world("zidle", models);

        // [Setup] Systems
        let account_address = world
            .deploy_contract('account', account::TEST_CLASS_HASH.try_into().unwrap());
        let resources_address = world
            .deploy_contract('resources', resources::TEST_CLASS_HASH.try_into().unwrap());

        world.grant_writer(dojo::utils::bytearray_hash(@"zidle"), account_address);
        world.grant_writer(dojo::utils::bytearray_hash(@"zidle"), resources_address);

        let systems = Systems {
            account: IAccountDispatcher { contract_address: account_address },
            resources: IResourcesDispatcher { contract_address: resources_address },
        };

        // [Setup] Context
        set_contract_address(PLAYER());
        systems.account.create(PLAYER_NAME);
        let context = Context {
            player_address: PLAYER(),
            player_id: PLAYER().into(),
            player_name: PLAYER_NAME,
            owner: owner
        };

        // [Set] Caller back to owner
        set_contract_address(owner);

        // [Return]
        (world, systems, context)
    }
}
