// Core imports

use core::debug::PrintTrait;

// Starknet imports

use starknet::testing::{set_contract_address, set_block_timestamp};

// Dojo imports

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

// Internal imports

use zidle::store::{Store, StoreTrait};
use zidle::models::player::{Player, PlayerTrait, PlayerAssert};
use zidle::systems::account::IAccountDispatcherTrait;
use zidle::systems::resources::IResourcesDispatcherTrait;
use zidle::tests::setup::{setup, setup::{Systems, PLAYER}};

#[test]
fn test_resources_harvest() {
    // [Setup]
    let (world, systems, context) = setup::create_account();
    let store = StoreTrait::new(world);

    set_block_timestamp(0);

    // [Assert] Player
    let player = store.player(context.player_id);
    assert(player.id == context.player_id, 'Create: wrong player id');
    assert(player.name == context.player_name, 'Create: wrong player name');

    set_contract_address(context.player_address);

    // [Assert] Miner
    systems.resources.mine(1, 1);

    let miner = store.miner(context.player_id, 1);
    assert(miner.id == context.player_id, 'Create: wrong miner id');

    set_block_timestamp(100);

    // [Assert] Harvest
    systems.resources.harvest(1);
    let miner = store.miner(context.player_id, 1);
    println!("miner: {}, {}, {}, {}", miner.xp, miner.timestamp, miner.subresource_type, miner.rcs);
}
