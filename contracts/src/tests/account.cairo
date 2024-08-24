// Core imports

use core::debug::PrintTrait;

// Starknet imports

use starknet::testing::set_contract_address;

// Dojo imports

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

// Internal imports

use zidle::store::{Store, StoreTrait};
use zidle::models::player::{Player, PlayerTrait, PlayerAssert};
use zidle::systems::account::IAccountDispatcherTrait;
use zidle::tests::setup::{setup, setup::{Systems, PLAYER}};

#[test]
fn test_account_create() {
    // [Setup]
    let (world, systems, context) = setup::create_account();
    let store = StoreTrait::new(world);

    // [Assert] Player
    let player = store.player(context.player_id);
    assert(player.id == context.player_id, 'Create: wrong player id');
    assert(player.name == context.player_name, 'Create: wrong player name');

    // [Spawn]
    systems.account.create('PLAYER1');

    // [Assert] Player
    let player = store.player(context.player_id);
    player.assert_exists();
}
