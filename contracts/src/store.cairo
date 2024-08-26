//! Store struct and component management methods.

// Core imports

use core::debug::PrintTrait;

// Straknet imports

use starknet::ContractAddress;

// Dojo imports

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

// Models imports

use zidle::models::player::{Player};
use zidle::models::miner::{Miner};
use zidle::models::char::{Char};
use zidle::models::token_config::{TokenConfig};


/// Store struct.
#[derive(Copy, Drop)]
struct Store {
    world: IWorldDispatcher,
}

/// Implementation of the `StoreTrait` trait for the `Store` struct.
#[generate_trait]
impl StoreImpl of StoreTrait {
    // Getters

    #[inline(always)]
    fn new(world: IWorldDispatcher) -> Store {
        Store { world: world }
    }

    #[inline(always)]
    fn player(self: Store, player_id: felt252) -> Player {
        get!(self.world, player_id, (Player))
    }

    #[inline(always)]
    fn miner(self: Store, player_id: felt252, resource_type: u8) -> Miner {
        get!(self.world, (player_id, resource_type), (Miner))
    }

    #[inline(always)]
    fn character(self: Store, token_id: u128) -> Char {
        get!(self.world, (token_id), Char)
    }

    #[inline(always)]
    fn token_config(self: Store, token_address: ContractAddress) -> TokenConfig {
        get!(self.world, token_address, TokenConfig)
    }

    // Setters

    #[inline(always)]
    fn set_player(self: Store, player: Player) {
        set!(self.world, (player))
    }

    #[inline(always)]
    fn set_miner(self: Store, miner: Miner) {
        set!(self.world, (miner))
    }

    #[inline(always)]
    fn set_character(self: Store, character: Char) {
        set!(self.world, (character))
    }

    #[inline(always)]
    fn set_token_config(self: Store, token_config: TokenConfig) {
        set!(self.world, (token_config))
    }
}
