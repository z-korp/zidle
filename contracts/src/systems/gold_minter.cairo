// Starknet imports
use starknet::ContractAddress;

// Dojo imports
use dojo::world::WorldStorage;

#[starknet::interface]
trait IGoldMinter<T> {
    fn mint(
        ref self: T, to: ContractAddress, amount: u256, token_contract_address: ContractAddress
    );
    fn can_mint(ref self: T, to: ContractAddress, token_contract_address: ContractAddress) -> bool;
    fn set_open(ref self: T, token_contract_address: ContractAddress, is_open: bool);
}

#[dojo::contract]
mod gold_minter {
    use dojo::world::{IWorldDispatcherTrait, WorldStorage};

    use super::{IGoldMinter};
    use starknet::{ContractAddress, get_contract_address, get_caller_address};

    use zidle::interfaces::systems::{SystemsTrait,};
    use zidle::models::token_config::{TokenConfig};
    use zidle::store::{Store, StoreTrait};
    use zidle::models::admin::{AdminTrait, AdminAssert};
    use zidle::interfaces::ierc20::{ierc20, IERC20Dispatcher, IERC20DispatcherTrait};

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
        ref self: ContractState,
        token_address: ContractAddress,
        max_supply: u256,
        max_per_wallet: u256,
        is_open: u8,
    ) {
        assert(max_supply > 0, Errors::INVALID_SUPPLY);

        // [Setup] Datastore
        let mut world = self.world_default();
        let store: Store = StoreTrait::new(world);

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
            ref self: ContractState,
            to: ContractAddress,
            amount: u256,
            token_contract_address: ContractAddress,
        ) {
            assert(token_contract_address != core::Zeroable::zero(), Errors::INVALID_TOKEN_ADDRESS);
            // [Setup] Datastore
            let mut world = self.world_default();
            let store: Store = StoreTrait::new(world);
            let settings = store.settings();

            let token = ierc20(settings.gold_erc20_address);

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

            store.set_token_config(config);
        }

        fn can_mint(
            ref self: ContractState, to: ContractAddress, token_contract_address: ContractAddress
        ) -> bool {
            assert(token_contract_address != core::Zeroable::zero(), Errors::INVALID_TOKEN_ADDRESS);
            // [Setup] Datastore
            let mut world = self.world_default();
            let store: Store = StoreTrait::new(world);
            let settings = store.settings();

            let token = ierc20(settings.gold_erc20_address);
            let mut config = store.token_config(token_contract_address);
            let balance: u256 = token.balance_of(to);
            ((config.minted_count < config.max_supply)
                && (config.is_open)
                && (balance < config.max_per_wallet))
        }

        fn set_open(
            ref self: ContractState, token_contract_address: ContractAddress, is_open: bool
        ) {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let store = StoreTrait::new(world);
            let mut admin = store.admin(caller.into());
            admin.assert_is_admin();

            // [Setup] Datastore
            let store: Store = StoreTrait::new(world);

            let mut config = store.token_config(token_contract_address);
            config.is_open = is_open;
            store.set_token_config(config);
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> WorldStorage {
            self.world(crate::default_namespace())
        }
    }
}
