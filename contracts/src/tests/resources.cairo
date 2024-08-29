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

    set_block_timestamp(1724541505);

    // [Assert] Player
    let player = store.player(context.player_id);
    assert(player.id == context.player_id, 'Create: wrong player id');
    assert(player.name == context.player_name, 'Create: wrong player name');

    // Change contract address to user address
    set_contract_address(context.player_address);

    // [Assert] Miner xp
    let rcs = 2; // Food
    let miner = store.miner(context.player_id, rcs);
    assert(miner.xp == 0, 'Miner: wrong miner xp 1');

    // [Assert] Miner
    systems.resources.mine(rcs, 1); // Food, Berries, lvl 0 -> gathering speed 2000ms

    let miner = store.miner(context.player_id, rcs);
    assert(miner.id == context.player_id, 'Create: wrong miner id');
    assert(miner.timestamp != 0, 'Create: wrong miner timestamp');

    set_block_timestamp(1724541505 + 10); // 10 secondes later

    // [Assert] Harvest
    systems.resources.harvest(rcs);
    let miner = store.miner(context.player_id, rcs);
    assert(miner.timestamp == 0, 'Harvest: wrong miner timestamp');

    // xp should be 5*base_berries_wp = 5*5 = 25
    assert(miner.xp == 25, 'Harvest: wrong miner xp');
    assert(miner.rcs_1 == 5, 'Harvest: wrong miner rcs');
}
