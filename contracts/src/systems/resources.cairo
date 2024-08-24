// Starknet imports

use starknet::ContractAddress;

// Dojo imports

use dojo::world::IWorldDispatcher;

#[dojo::interface]
trait IResources<TContractState> {
    fn mine(ref world: IWorldDispatcher, rcs_type: u8, rcs_sub_type: u8);
    fn harvest(ref world: IWorldDispatcher, rcs_type: u8);
}

#[dojo::contract]
mod resources {
    // Starknet imports

    use starknet::ContractAddress;
    use starknet::info::{
        get_block_timestamp, get_block_number, get_caller_address, get_contract_address
    };

    // Component imports

    use zidle::components::emitter::EmitterComponent;
    use zidle::components::manageable::ManageableComponent;

    // Local imports

    use super::IResources;
    use zidle::store::{Store, StoreImpl, StoreTrait};
    use zidle::models::miner::{MinerImpl, MinerAssert, ZeroableMinerImpl};
    use zidle::models::player::{PlayerAssert};
    use zidle::helpers::level::{XpLevel};
    use zidle::types::resource::{ResourceType, ResourceTypeAssert, ResourceImpl};

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
    impl ResourcesImpl of IResources<ContractState> {
        fn mine(ref world: IWorldDispatcher, rcs_type: u8, rcs_sub_type: u8) {
            // [Setup] Datastore
            let store: Store = StoreImpl::new(world);

            // [Check] Player exists
            let caller = get_caller_address();
            let mut player = store.player(caller.into());
            player.assert_exists();

            // [Check] Resource exists
            let mut miner = store.miner(caller.into(), rcs_type);
            if (miner.is_zero()) {
                miner = MinerImpl::new(caller.into(), rcs_type);
            }

            // [Check] Player level
            let level = XpLevel::get_level_from_xp(miner.xp);
            let rcs = ResourceImpl::from(rcs_type, rcs_sub_type);
            rcs.assert_level(level);

            // [Effect] Start mining
            miner.mine(rcs_sub_type, get_block_timestamp());

            // [Effect] Update miner
            store.set_miner(miner);
        }

        fn harvest(ref world: IWorldDispatcher, rcs_type: u8) {
            // [Setup] Datastore
            let store: Store = StoreImpl::new(world);

            // [Check] Player exists
            let caller = get_caller_address();
            let mut player = store.player(caller.into());
            player.assert_exists();

            // [Check] Resource exists
            let mut miner = store.miner(caller.into(), rcs_type);
            miner.assert_exists();

            // [Effect] Harvest
            miner.harvest(get_block_timestamp(), XpLevel::get_level_from_xp(miner.xp));

            // [Effect] Update miner
            store.set_miner(miner);
        }
    }
}
