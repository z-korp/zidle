// Starknet imports

use starknet::ContractAddress;

#[dojo::interface]
trait IGoldMinter {
    fn mint(
        ref world: IWorldDispatcher,
        to: ContractAddress,
        amount: u256,
        token_contract_address: ContractAddress
    );
    fn can_mint(
        world: @IWorldDispatcher, to: ContractAddress, token_contract_address: ContractAddress
    ) -> bool;
    fn set_open(
        ref world: IWorldDispatcher, token_contract_address: ContractAddress, is_open: bool
    );
}

#[dojo::contract]
mod gold_minter {
    use super::{IGoldMinter};
    use starknet::{ContractAddress, get_contract_address, get_caller_address};

    use zidle::interfaces::systems::{
        WorldSystemsTrait, IGoldTokenDispatcher, IGoldTokenDispatcherTrait,
    };
    use zidle::models::token_config::{TokenConfig};
    use zidle::store::{Store, StoreImpl};

    mod Errors {
        // admin
        const INVALID_TOKEN_ADDRESS: felt252 = 'MINTER: invalid token address';
        const INVALID_SUPPLY: felt252 = 'MINTER: invalid supply';
        const NOT_ADMIN: felt252 = 'MINTER: not admin';
        const NOT_OWNER: felt252 = 'MINER: not owner';
        // mint
        const MINTED_OUT: felt252 = 'MINTER: minted out';
        const MINTING_IS_CLOSED: felt252 = 'MINTER: minting closed';
        const MAXED_WALLET: felt252 = 'MINTER: wallet maxed out';
    }

    fn dojo_init(
        ref world: IWorldDispatcher,
        token_address: ContractAddress,
        max_supply: u256,
        max_per_wallet: u256,
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
    // IGoldMinter
    //
    #[abi(embed_v0)]
    impl GoldMinterImpl of IGoldMinter<ContractState> {
        fn mint(
            ref world: IWorldDispatcher,
            to: ContractAddress,
            amount: u256,
            token_contract_address: ContractAddress,
        ) {
            assert(token_contract_address != core::Zeroable::zero(), Errors::INVALID_TOKEN_ADDRESS);
            let token = (IGoldTokenDispatcher { contract_address: token_contract_address });

            // [Setup] Datastore
            let store: Store = StoreImpl::new(world);

            // [Check] Availability
            let mut config = store.token_config(token_contract_address);
            assert(config.minted_count + amount <= config.max_supply, Errors::MINTED_OUT);
            assert(config.is_open, Errors::MINTING_IS_CLOSED);

            // [Check] Wallet
            let balance: u256 = token.balance_of(to);
            assert(balance + amount <= config.max_per_wallet, Errors::MAXED_WALLET);

            // [Effect] Mint next token_id
            config.minted_count += amount;
            token.mint(to, amount);

            println!("config.minted_count: {}", config.minted_count);
            println!("config.max_supply: {}", config.max_supply);

            store.set_token_config(config);
        }

        fn can_mint(
            world: @IWorldDispatcher, to: ContractAddress, token_contract_address: ContractAddress
        ) -> bool {
            assert(token_contract_address != core::Zeroable::zero(), Errors::INVALID_TOKEN_ADDRESS);
            let token = (IGoldTokenDispatcher { contract_address: token_contract_address });
            let mut config: TokenConfig = get!(world, (token_contract_address), TokenConfig);
            let balance: u256 = token.balance_of(to);
            println!("balance: {}", balance);
            println!("config.minted_count: {}", config.minted_count);
            ((config.minted_count < config.max_supply)
                && (config.is_open)
                && (balance < config.max_per_wallet))
        }

        fn set_open(
            ref world: IWorldDispatcher, token_contract_address: ContractAddress, is_open: bool
        ) {
            assert(world.is_owner(self.selector().into(), get_caller_address()), Errors::NOT_OWNER);

            // [Setup] Datastore
            let store: Store = StoreImpl::new(world);

            let mut config: TokenConfig = get!(world, (token_contract_address), TokenConfig);
            config.is_open = is_open;
            store.set_token_config(config);
        }
    }
}
