// Starknet imports

use starknet::ContractAddress;

// Dojo imports

use dojo::world::IWorldDispatcher;

#[dojo::interface]
trait ICharacter<TContractState> {
    fn create(ref world: IWorldDispatcher, name: felt252);
}

#[dojo::contract]
mod character {
    // Starknet imports

    use starknet::ContractAddress;
    use starknet::info::{
        get_block_timestamp, get_block_number, get_caller_address, get_contract_address
    };

    // Component imports

    use zidle::components::emitter::EmitterComponent;

    // Local imports

    use super::ICharacter;
    use zidle::store::{Store, StoreImpl, StoreTrait};
    use zidle::constants::{RESSOURCE_NUMBER};
    use zidle::models::miner::{MinerTrait};
    use zidle::models::player::{PlayerTrait};
    use zidle::interfaces::systems::{
        WorldSystemsTrait, ICharacterMinterDispatcher, ICharacterMinterDispatcherTrait
    };

    // Components

    component!(path: EmitterComponent, storage: emitter, event: EmitterEvent);
    impl EmitterImpl = EmitterComponent::EmitterImpl<ContractState>;

    // Storage

    #[storage]
    struct Storage {
        #[substorage(v0)]
        emitter: EmitterComponent::Storage,
    }

    // Events

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        EmitterEvent: EmitterComponent::Event,
    }

    // Constructor

    fn dojo_init(ref world: IWorldDispatcher) {}

    // Implementations

    #[abi(embed_v0)]
    impl CharacterImpl of ICharacter<ContractState> {
        fn create(ref world: IWorldDispatcher, name: felt252) {
            // [Setup] Datastore
            let store: Store = StoreImpl::new(world);

            // [Effect] Create a NFT
            let caller: ContractAddress = starknet::get_caller_address();
            let minter_dispatcher: ICharacterMinterDispatcher = world.character_minter_dispatcher();
            let token_id: u128 = minter_dispatcher.mint(caller, world.character_token_address());

            // [Effect] Create miners for the NFT
            let caller = get_caller_address();
            let mut index = 1; // 0 is None, start at 1
            while (index < RESSOURCE_NUMBER) {
                let miner = MinerTrait::new(token_id.into(), index);
                index += 1;
                store.set_miner(miner);
            };

            // [Effect] Create a player
            let player = PlayerTrait::new(token_id.into(), name);
            store.set_player(player);
        }
    }
}
