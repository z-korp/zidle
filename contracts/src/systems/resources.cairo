// Starknet imports

use starknet::ContractAddress;

// Dojo imports

use dojo::world::IWorldDispatcher;

#[dojo::interface]
trait IResources<TContractState> {
    fn mine(ref world: IWorldDispatcher, token_id: u128, rcs_type: u8, rcs_sub_type: u8);
    fn harvest(ref world: IWorldDispatcher, token_id: u128, rcs_type: u8);
    fn sell(
        ref world: IWorldDispatcher, token_id: u128, rcs_type: u8, rcs_sub_type: u8, amount: u64
    );
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
    use zidle::models::char::{CharAssert};
    use zidle::helpers::level::{XpLevel};
    use zidle::types::resource::{ResourceType, ResourceTypeAssert, ResourceImpl};
    use zidle::interfaces::systems::{
        WorldSystemsTrait, IGoldTokenDispatcher, IGoldTokenDispatcherTrait,
        ICharacterTokenDispatcher, ICharacterTokenDispatcherTrait, IGoldMinterDispatcher,
        IGoldMinterDispatcherTrait
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
    impl ResourcesImpl of IResources<ContractState> {
        fn mine(ref world: IWorldDispatcher, token_id: u128, rcs_type: u8, rcs_sub_type: u8) {
            // [Setup] Datastore
            let store: Store = StoreImpl::new(world);

            // [Check] Ownership
            let character_token_dispatcher: ICharacterTokenDispatcher = world
                .character_token_dispatcher();
            let owner_address = character_token_dispatcher.owner_of(token_id.into());
            assert(owner_address == get_caller_address(), 'Not the owner of this nft');

            // [Check] Resource exists
            let mut miner = store.miner(token_id, rcs_type);
            // [Check] Player level
            let level = XpLevel::get_level_from_xp(miner.xp);
            let rcs = ResourceImpl::from(rcs_type, rcs_sub_type);
            rcs.assert_level(level);

            // [Effect] Start mining
            miner.mine(rcs_sub_type, get_block_timestamp());

            // [Effect] Update miner
            store.set_miner(miner);
        }

        fn harvest(ref world: IWorldDispatcher, token_id: u128, rcs_type: u8) {
            // [Setup] Datastore
            let store: Store = StoreImpl::new(world);

            // [Check] Ownership
            let character_token_dispatcher: ICharacterTokenDispatcher = world
                .character_token_dispatcher();
            let owner_address = character_token_dispatcher.owner_of(token_id.into());
            assert(owner_address == get_caller_address(), 'Not the owner of this nft');

            // [Check] Resource exists
            let mut miner = store.miner(token_id, rcs_type);
            miner.assert_exists();

            // [Effect] Harvest
            miner.harvest(get_block_timestamp(), XpLevel::get_level_from_xp(miner.xp));

            // [Effect] Update miner
            store.set_miner(miner);
        }

        fn sell(
            ref world: IWorldDispatcher, token_id: u128, rcs_type: u8, rcs_sub_type: u8, amount: u64
        ) {
            // [Setup] Datastore
            let store: Store = StoreImpl::new(world);

            // [Check] Character exists
            let character_token_dispatcher: ICharacterTokenDispatcher = world
                .character_token_dispatcher();
            let owner_address = character_token_dispatcher.owner_of(token_id.into());
            assert(owner_address == get_caller_address(), 'Not the owner of this nft');

            // [Check] Miner exists
            let mut miner = store.miner(token_id, rcs_type);
            miner.assert_exists();

            // [Check] Resource type
            let rcs_available = miner.get_available_rcs(rcs_sub_type);
            assert(rcs_available >= amount, 'Resources: not enough resources');

            // [Effect] Sell resources
            miner.sell(rcs_sub_type, amount);
            let rcs = ResourceImpl::from(rcs_type, rcs_sub_type);
            let tokens = rcs.unit_price() * amount;

            //---------------------------------------
            // Mint ERC20 Gold tokens
            // Get NFT wallet
            let character_token_dispatcher: ICharacterTokenDispatcher = world
                .character_token_dispatcher();
            let nft_wallet_address = character_token_dispatcher.wallet_of(token_id.into());

            // Mint gold on NFT wallet
            let gold_minter_dispatcher: IGoldMinterDispatcher = world.gold_minter_dispatcher();
            gold_minter_dispatcher
                .mint(nft_wallet_address, tokens.into(), world.gold_token_address());

            store.set_miner(miner);
        }
    }
}
