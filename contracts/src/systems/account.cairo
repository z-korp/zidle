// Starknet imports

use starknet::ContractAddress;

// Dojo imports

use dojo::world::IWorldDispatcher;

#[dojo::interface]
trait IAccount<TContractState> {
    fn create(ref world: IWorldDispatcher, name: felt252);
    fn rename(ref world: IWorldDispatcher, name: felt252);
}

#[dojo::contract]
mod account {
    // Starknet imports

    use starknet::ContractAddress;
    use starknet::info::{
        get_block_timestamp, get_block_number, get_caller_address, get_contract_address
    };

    // Component imports

    use zidle::components::emitter::EmitterComponent;
    use zidle::components::manageable::ManageableComponent;

    // Local imports

    use super::IAccount;
    use zidle::store::{Store, StoreImpl, StoreTrait};
    use zidle::constants::{RESSOURCE_NUMBER};
    use zidle::models::miner::{MinerTrait};
    use zidle::interfaces::systems::{
        WorldSystemsTrait, ICharacterMinterDispatcher, ICharacterMinterDispatcherTrait
    };

    // Components

    component!(path: EmitterComponent, storage: emitter, event: EmitterEvent);
    impl EmitterImpl = EmitterComponent::EmitterImpl<ContractState>;
    component!(path: ManageableComponent, storage: manageable, event: ManageableEvent);
    impl ManageableInternalImpl = ManageableComponent::InternalImpl<ContractState>;

    // Storage

    #[storage]
    struct Storage {
        #[substorage(v0)]
        emitter: EmitterComponent::Storage,
        #[substorage(v0)]
        manageable: ManageableComponent::Storage,
    }

    // Events

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        EmitterEvent: EmitterComponent::Event,
        #[flat]
        ManageableEvent: ManageableComponent::Event,
    }

    // Constructor

    fn dojo_init(ref world: IWorldDispatcher) {}

    // Implementations

    #[abi(embed_v0)]
    impl AccountImpl of IAccount<ContractState> {
        fn create(ref world: IWorldDispatcher, name: felt252) {
            // [Setup] Datastore
            let store: Store = StoreImpl::new(world);

            // [Effect] Create a player
            self.manageable._create(world, name);

            // [Effect] Create miners for the player
            let caller = get_caller_address();
            let mut index = 1; // 0 is None, start at 1
            while (index < RESSOURCE_NUMBER) {
                let miner = MinerTrait::new(caller.into(), index);
                index += 1;
                store.set_miner(miner);
            };

            let caller: ContractAddress = starknet::get_caller_address();
            let minter_dispatcher: ICharacterMinterDispatcher = world.character_minter_dispatcher();
            let token_id: u128 = minter_dispatcher.mint(caller, world.character_token_address());
        }

        fn rename(ref world: IWorldDispatcher, name: felt252) {
            self.manageable._rename(world, name);
        }
    }
}
