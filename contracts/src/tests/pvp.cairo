// tests/pvp_tests.cairo

// Core imports.
use core::debug::PrintTrait;

// Starknet testing imports.
use starknet::testing::{set_contract_address, set_block_timestamp};

// Dojo world dispatcher.
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

// Internal imports.
use zidle::store::{Store, StoreTrait};
use zidle::models::arena::{Arena, ArenaTrait, Team};
use zidle::systems::pvp::IPvP;
use zidle::tests::setup::{setup, setup::{Systems, Context, impersonate, ADMIN}};
use zidle::systems::pvp::IPvPDispatcherTrait;

#[test]
fn test_pvp_create_and_validate_goal() {
    // [Setup] Create the test environment.
    let (world, systems, context) = setup::create_characters();

    // Set the contract address to the admin address (from context).
    set_contract_address(context.owner);

    // Create a new Store from the world.
    let store: Store = StoreTrait::new(world);

    // --- Create an arena ---
    // Call the PvP endpoint to create a new arena.
    impersonate(ADMIN());
    systems.pvp.create_arena(context.player_tokenid1, context.player_tokenid2);

    // Assume that the arena id is generated as follows:
    let arena_id: u32 = world.dispatcher.uuid();
    // Retrieve the newly created arena from the store.
    let mut arena: Arena = store.arena(arena_id);
    // [Assert] Check that the arena is set.
    assert(arena.is_set, 'Arena shld be set');
}
