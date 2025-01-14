// Core imports
use core::debug::PrintTrait;

// Straknet imports
use starknet::ContractAddress;

// Dojo imports
use dojo::world::WorldStorage;
use dojo::model::ModelStorage;

// Models imports
use zidle::models::player::{Player};
use zidle::models::miner::{Miner};
use zidle::models::char::{Char};
use zidle::models::token_config::{TokenConfig};
use zidle::models::settings::{Settings};
use zidle::models::admin::{Admin};

/// Store struct
#[derive(Copy, Drop)]
struct Store {
    world: WorldStorage,
}

/// Implementation of the `StoreTrait` trait for the `Store` struct.
#[generate_trait]
impl StoreImpl of StoreTrait {
    // Getters

    #[inline(always)]
    fn new(world: WorldStorage) -> Store {
        Store { world: world }
    }

    #[inline(always)]
    fn player(self: Store, token_id: felt252) -> Player {
        self.world.read_model(token_id)
    }

    #[inline(always)]
    fn miner(self: Store, token_id: u128, resource_type: u8) -> Miner {
        self.world.read_model((token_id, resource_type))
    }

    #[inline(always)]
    fn character(self: Store, id: felt252, token_id: u128) -> Char {
        self.world.read_model((id, token_id))
    }

    #[inline(always)]
    fn token_config(self: Store, token_address: ContractAddress) -> TokenConfig {
        self.world.read_model(token_address)
    }

    #[inline(always)]
    fn settings(self: Store) -> Settings {
        self.world.read_model(1)
    }

    #[inline(always)]
    fn admin(self: Store, address: ContractAddress) -> Admin {
        let address: felt252 = address.into();
        self.world.read_model(address)
    }

    // Setters

    #[inline(always)]
    fn set_player(mut self: Store, mut player: Player) {
        self.world.write_model(@player)
    }

    #[inline(always)]
    fn set_miner(mut self: Store, mut miner: Miner) {
        self.world.write_model(@miner)
    }

    #[inline(always)]
    fn set_character(mut self: Store, mut character: Char) {
        self.world.write_model(@character)
    }

    #[inline(always)]
    fn set_token_config(mut self: Store, mut token_config: TokenConfig) {
        self.world.write_model(@token_config)
    }

    #[inline(always)]
    fn set_settings(mut self: Store, settings: Settings) {
        self.world.write_model(@settings)
    }

    #[inline(always)]
    fn set_admin(mut self: Store, admin: Admin) {
        self.world.write_model(@admin)
    }
}
