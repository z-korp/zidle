// Starknet and Dojo imports.
use starknet::ContractAddress;
use starknet::info::{get_caller_address, get_block_timestamp};
use dojo::world::WorldStorage;
use dojo::event::EventStorage;

// Internal imports.
use zidle::models::arena::{Arena, ArenaTrait};
use zidle::store::{Store, StoreTrait};
use zidle::models::admin::{AdminTrait, AdminAssert};

/// The PvP interface allows the creation of an Arena.
#[starknet::interface]
trait IPvP<T> {
    /// Create an arena given two token IDs.
    fn create_arena(ref self: T, token_id_1: u128, token_id_2: u128);
    fn validate_goal(ref self: T, token_id: u128, arena_id: u32, goal_number: u8);
    fn is_goal_validated(self: @T, token_id: u128, arena_id: u32, goal_number: u8) -> bool;
    fn get_goals_status(self: @T, token_id: u128, arena_id: u32) -> (bool, bool, bool);
}

/// The PvP contract module.
#[dojo::contract]
mod pvp {
    use super::{
        EventStorage, IPvP, Arena, ArenaTrait, get_caller_address, get_block_timestamp,
        ContractAddress
    };
    use zidle::store::{Store, StoreTrait};
    use zidle::models::arena::{ArenaTrait as ArenaModelTrait};
    use zidle::models::admin::{AdminTrait, AdminAssert};
    use dojo::world::{WorldStorage, IWorldDispatcherTrait};
    use zidle::models::arena::{Team, Goal};
    use zidle::types::goal::GoalType;
    use zidle::events::index::{GoalScored};

    use zidle::interfaces::ierc721::{ierc721, IERC721Dispatcher, IERC721DispatcherTrait};
    use zidle::interfaces::ierc20::{ierc20, IERC20Dispatcher, IERC20DispatcherTrait};

    fn dojo_init(ref self: ContractState) {}

    #[abi(embed_v0)]
    impl PvPImpl of IPvP<ContractState> {
        fn create_arena(ref self: ContractState, token_id_1: u128, token_id_2: u128) {
            // Obtain the world storage.
            let mut world = self.world_default();
            // Initialize our store (assumed to be a centralized storage for our models).
            let store: Store = StoreTrait::new(world);

            // Enforce that only an admin can create an arena.
            let caller = get_caller_address();
            let admin = store.admin(caller.into());
            admin.assert_is_admin();

            // Create a new Arena using the ArenaTrait's constructor.
            let id: u32 = world.dispatcher.uuid() + 1;
            let arena: Arena = ArenaTrait::new(id, token_id_1, token_id_2);
            // Store the arena. (Assumes your store exposes a set_arena function.)
            store.set_arena(arena);
        }

        fn validate_goal(ref self: ContractState, token_id: u128, arena_id: u32, goal_number: u8) {
            // Obtain world storage.
            let mut world = self.world_default();
            // Create our store.
            let store: Store = StoreTrait::new(world);
            let settings = store.settings();

            // [Check] Ownership
            let character_token_dispatcher = ierc721(settings.character_erc721_address);
            let owner_address = character_token_dispatcher.owner_of(token_id.into());
            assert(owner_address == get_caller_address(), 'Not the owner of this nft');

            // Retrieve the arena by id.
            // (Assuming store.arena(id) returns a mutable Arena instance.)
            let mut arena = store.arena(arena_id);

            let mut team = Team::None;
            if (arena.token_id_1 == token_id) {
                team = Team::Team1;
            } else if (arena.token_id_2 == token_id) {
                team = Team::Team2;
            }
            assert(team != Team::None, 'Token ID not in the arena');

            // --- CRITERIA CHECK ---
            // Determine the goal to be validated.
            if (goal_number > 3 || goal_number < 1) {
                assert(false, 'Invalid goal number');
            }
            let goal: Goal = if (goal_number == 1) {
                arena.goal1
            } else if (goal_number == 2) {
                arena.goal2
            } else {
                arena.goal3
            };

            if goal.goal_type == GoalType::Gold {
                // Get wallet address of the character.
                let wallet_address = character_token_dispatcher.wallet_of(token_id.into());

                // Call the ERC20 gold contract.
                let gold_dispatcher = ierc20(settings.gold_erc20_address);
                let balance: u256 = gold_dispatcher.balance_of(wallet_address);
                println!("Balance: {}", balance);

                assert(balance >= 50, 'Not enough gold');
            } else if (goal.goal_type == GoalType::Wood) {
                let miner = store.miner(token_id, 1);
                assert(miner.rcs_1 >= 50, 'Not enough wood');
            } else if (goal.goal_type == GoalType::Food) {
                let miner = store.miner(token_id, 2);
                assert(miner.rcs_1 >= 50, 'Not enough food');
            }

            // Call the arena's validate_goal method.
            let (is_validated, is_first_validation, points) = arena
                .validate_goal(goal_number, team);
            assert(is_validated, 'Goal validation failed.');

            world
                .emit_event(
                    @GoalScored {
                        token_id,
                        arena_id,
                        goal_number,
                        is_first_validation,
                        points,
                        timestamp: get_block_timestamp(),
                    }
                );

            // Update the store with the new arena state.
            store.set_arena(arena);
        }

        fn get_goals_status(
            self: @ContractState, token_id: u128, arena_id: u32
        ) -> (bool, bool, bool) {
            // Obtain world storage.
            let mut world = self.world_default();
            // Create our store.
            let store: Store = StoreTrait::new(world);

            // Retrieve the arena by id.
            let arena = store.arena(arena_id);

            let mut team = Team::None;
            if (arena.token_id_1 == token_id) {
                team = Team::Team1;
            } else if (arena.token_id_2 == token_id) {
                team = Team::Team2;
            }
            assert(team != Team::None, 'Token ID not in the arena');

            (
                arena.is_goal_validated(1, team),
                arena.is_goal_validated(2, team),
                arena.is_goal_validated(3, team)
            )
        }

        fn is_goal_validated(
            self: @ContractState, token_id: u128, arena_id: u32, goal_number: u8
        ) -> bool {
            // Obtain world storage.
            let mut world = self.world_default();
            // Create our store.
            let store: Store = StoreTrait::new(world);

            // Retrieve the arena by id.
            let arena = store.arena(arena_id);

            let mut team = Team::None;
            if (arena.token_id_1 == token_id) {
                team = Team::Team1;
            } else if (arena.token_id_2 == token_id) {
                team = Team::Team2;
            }
            assert(team != Team::None, 'Token ID not in the arena');

            arena.is_goal_validated(goal_number, team)
        }
    }

    /// Internal helper implementations.
    #[generate_trait]
    impl InternalPvPImpl of InternalPvPTrait {
        /// Return a default world storage from the contract state.
        fn world_default(self: @ContractState) -> WorldStorage {
            self.world(crate::default_namespace())
        }
    }
}
