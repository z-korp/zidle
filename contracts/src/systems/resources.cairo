// Starknet imports
use starknet::ContractAddress;

// Dojo imports
use dojo::world::WorldStorage;
use dojo::event::EventStorage;

#[starknet::interface]
trait IResources<T> {
    fn mine(ref self: T, token_id: u128, rcs_type: u8, rcs_sub_type: u8);
    fn harvest(ref self: T, token_id: u128, rcs_type: u8);
    fn sell(ref self: T, token_id: u128, rcs_type: u8, rcs_sub_type: u8, amount: u64);
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

    use super::{IResources, WorldStorage, EventStorage};
    use zidle::events::index::{Mine, Harvest};
    use zidle::store::{Store, StoreTrait};
    use zidle::models::miner::{MinerImpl, MinerAssert, ZeroableMinerImpl};
    use zidle::models::char::{CharAssert};
    use zidle::helpers::level::{XpLevel};
    use zidle::types::resource::{ResourceType, ResourceTypeAssert, ResourceImpl};
    use zidle::interfaces::systems::{
        SystemsTrait, IGoldMinterDispatcher, IGoldMinterDispatcherTrait
    };
    use zidle::interfaces::ierc721::{ierc721, IERC721Dispatcher, IERC721DispatcherTrait};

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
    impl ResourcesImpl of IResources<ContractState> {
        fn mine(ref self: ContractState, token_id: u128, rcs_type: u8, rcs_sub_type: u8) {
            // [Setup] Datastore
            let mut world = self.world_default();
            let store: Store = StoreTrait::new(world);
            let settings = store.settings();

            // [Check] Ownership
            let character_token_dispatcher = ierc721(settings.character_erc721_address);
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

            world.emit_event(@Mine { token_id, rcs_type, rcs_sub_type });
        }

        fn harvest(ref self: ContractState, token_id: u128, rcs_type: u8) {
            // [Setup] Datastore
            let mut world = self.world_default();
            let store: Store = StoreTrait::new(world);
            let settings = store.settings();

            // [Check] Ownership
            let character_token_dispatcher = ierc721(settings.character_erc721_address);
            let owner_address = character_token_dispatcher.owner_of(token_id.into());
            assert(owner_address == get_caller_address(), 'Not the owner of this nft');

            // [Check] Resource exists
            let mut miner = store.miner(token_id, rcs_type);
            miner.assert_exists();

            // [Effect] Harvest
            let (rcs_type, rcs_sub_type, amount, xp) = miner
                .harvest(get_block_timestamp(), XpLevel::get_level_from_xp(miner.xp));

            // [Effect] Update miner
            store.set_miner(miner);

            world.emit_event(@Harvest { token_id, rcs_type, rcs_sub_type, amount, xp });
        }

        fn sell(
            ref self: ContractState, token_id: u128, rcs_type: u8, rcs_sub_type: u8, amount: u64
        ) {
            // [Setup] Datastore
            let mut world = self.world_default();
            let store: Store = StoreTrait::new(world);
            let settings = store.settings();

            // [Check] Character exists
            let character_token_dispatcher = ierc721(settings.character_erc721_address);
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
            let character_token_dispatcher = ierc721(settings.character_erc721_address);
            let nft_wallet_address = character_token_dispatcher.wallet_of(token_id.into());

            // Mint gold on NFT wallet
            let gold_minter_dispatcher: IGoldMinterDispatcher = world.gold_minter_dispatcher();
            gold_minter_dispatcher
                .mint(nft_wallet_address, tokens.into(), settings.gold_erc20_address);

            store.set_miner(miner);
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> WorldStorage {
            self.world(crate::default_namespace())
        }
    }
}
