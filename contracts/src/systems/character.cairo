// Starknet imports
use starknet::ContractAddress;

// Dojo imports
use dojo::world::WorldStorage;

#[starknet::interface]
trait ICharacter<T> {
    fn create(ref self: T, name: felt252);
}

#[dojo::contract]
mod character {
    // Starknet imports
    use starknet::ContractAddress;
    use starknet::info::{
        get_block_timestamp, get_block_number, get_caller_address, get_contract_address
    };

    // Dojo imports
    use dojo::world::WorldStorage;

    // Component imports
    use zidle::components::emitter::EmitterComponent;

    // Local imports
    use super::ICharacter;
    use zidle::store::{Store, StoreTrait};
    use zidle::constants::{RESSOURCE_NUMBER};
    use zidle::models::miner::{MinerTrait};
    use zidle::models::player::{PlayerTrait};
    use zidle::interfaces::systems::{
        SystemsTrait, ICharacterMinterDispatcher, ICharacterMinterDispatcherTrait
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
    fn dojo_init(ref self: ContractState) {}

    // Implementations
    #[abi(embed_v0)]
    impl CharacterImpl of ICharacter<ContractState> {
        fn create(ref self: ContractState, name: felt252) {
            // [Setup] Datastore
            let mut world = self.world_default();
            let store: Store = StoreTrait::new(world);
            let settings = store.settings();

            // [Effect] Create a NFT
            let caller: ContractAddress = starknet::get_caller_address();
            let minter_dispatcher: ICharacterMinterDispatcher = world.character_minter_dispatcher();
            let token_id: u128 = minter_dispatcher.mint(caller, settings.character_erc721_address);
            println!("New [Character] id: {}, name: {}", token_id, name);

            // [Effect] Create miners for the NFT
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

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> WorldStorage {
            self.world(crate::default_namespace())
        }
    }
}
