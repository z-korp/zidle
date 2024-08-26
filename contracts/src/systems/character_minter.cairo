// Starknet imports

use starknet::ContractAddress;

#[dojo::interface]
trait ICharacterMinter {
    fn mint(
        ref world: IWorldDispatcher, to: ContractAddress, token_contract_address: ContractAddress
    ) -> u128;
    fn can_mint(
        world: @IWorldDispatcher, to: ContractAddress, token_contract_address: ContractAddress
    ) -> bool;
    fn set_open(
        ref world: IWorldDispatcher, token_contract_address: ContractAddress, is_open: bool
    );
}

#[dojo::contract]
mod character_minter {
    use super::{ICharacterMinter};
    use starknet::{ContractAddress, get_contract_address, get_caller_address};

    use zidle::interfaces::systems::{
        WorldSystemsTrait, ICharacterTokenDispatcher, ICharacterTokenDispatcherTrait,
    };
    use zidle::models::token_config::{TokenConfig};
    use zidle::store::{Store, StoreImpl};

    mod Errors {
        // admin
        const INVALID_TOKEN_ADDRESS: felt252 = 'MINTER: invalid token address';
        const INVALID_SUPPLY: felt252 = 'MINTER: invalid supply';
        const NOT_ADMIN: felt252 = 'MINTER: not admin';
        // mint
        const MINTED_OUT: felt252 = 'MINTER: minted out';
        const MINTING_IS_CLOSED: felt252 = 'MINTER: minting closed';
        const MAXED_WALLET: felt252 = 'MINTER: wallet maxed out';
    }

    //---------------------------------------
    // params passed from overlays files
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    // 
    // https://github.com/dojoengine/dojo/blob/328004d65bbbf7692c26f030b75fa95b7947841d/examples/spawn-and-move/manifests/dev/overlays/contracts/dojo_examples_others_others.toml
    // https://github.com/dojoengine/dojo/blob/328004d65bbbf7692c26f030b75fa95b7947841d/examples/spawn-and-move/src/others.cairo#L18
    // overlays generated with: sozo migrate --generate-overlays
    //
    fn dojo_init(
        ref world: IWorldDispatcher,
        token_address: ContractAddress,
        max_supply: u64,
        max_per_wallet: u64,
        is_open: u8,
    ) {
        assert(max_supply > 0, Errors::INVALID_SUPPLY);

        // [Setup] Datastore
        let store: Store = StoreImpl::new(world);

        let token_config = TokenConfig {
            token_address,
            max_supply: max_supply,
            max_per_wallet: max_per_wallet,
            minted_count: 0,
            is_open: (is_open != 0),
        };
        store.set_token_config(token_config);
    }

    //---------------------------------------
    // ICharacterMinter
    //
    #[abi(embed_v0)]
    impl CharacterMinterImpl of ICharacterMinter<ContractState> {
        fn mint(
            ref world: IWorldDispatcher,
            to: ContractAddress,
            token_contract_address: ContractAddress
        ) -> u128 {
            assert(token_contract_address != core::Zeroable::zero(), Errors::INVALID_TOKEN_ADDRESS);
            let token = (ICharacterTokenDispatcher { contract_address: token_contract_address });

            // [Setup] Datastore
            let store: Store = StoreImpl::new(world);

            // [Check] Availability
            let mut config = store.token_config(token_contract_address);
            assert(config.minted_count < config.max_supply, Errors::MINTED_OUT);
            assert(config.is_open, Errors::MINTING_IS_CLOSED);

            // [Check] Wallet
            let balance: u256 = token.balance_of(to);
            assert(balance.low < config.max_per_wallet.into(), Errors::MAXED_WALLET);

            // [Effect] Mint next token_id
            config.minted_count += 1;
            let token_id: u256 = config.minted_count.into();
            token.mint(to, token_id);

            store.set_token_config(config);

            // [Return] minted token id
            (token_id.low)
        }

        fn can_mint(
            world: @IWorldDispatcher, to: ContractAddress, token_contract_address: ContractAddress
        ) -> bool {
            assert(token_contract_address != core::Zeroable::zero(), Errors::INVALID_TOKEN_ADDRESS);
            let token = (ICharacterTokenDispatcher { contract_address: token_contract_address });
            let mut config: TokenConfig = get!(world, (token_contract_address), TokenConfig);
            let balance: u256 = token.balance_of(to);
            ((config.minted_count < config.max_supply)
                && (config.is_open)
                && (balance.low < config.max_per_wallet.into()))
        }

        fn set_open(
            ref world: IWorldDispatcher, token_contract_address: ContractAddress, is_open: bool
        ) {
            // assert(
            //     world.admin_dispatcher().am_i_admin(get_caller_address()) == true,
            //     Errors::NOT_ADMIN
            // );
            assert(world.is_owner(self.selector().into(), get_caller_address()), Errors::NOT_ADMIN);

            // [Setup] Datastore
            let store: Store = StoreImpl::new(world);

            let mut config: TokenConfig = get!(world, (token_contract_address), TokenConfig);
            config.is_open = is_open;
            store.set_token_config(config);
        }
    }
}
