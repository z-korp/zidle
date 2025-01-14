use starknet::{ContractAddress, ClassHash};
use dojo::world::{
    WorldStorage, WorldStorageTrait, IWorldDispatcher, IWorldDispatcherTrait, Resource
};

use zidle::systems::{
    character_minter::{ICharacterMinterDispatcher, ICharacterMinterDispatcherTrait},
    gold_minter::{IGoldMinterDispatcher, IGoldMinterDispatcherTrait},
    resources::{IResourcesDispatcher, IResourcesDispatcherTrait},
    settings::{ISettingsDispatcher, ISettingsDispatcherTrait},
};
use core::Zeroable;

mod SELECTORS {
    const CHARACTER_MINTER: felt252 = selector_from_tag!("zidle-character_minter");
    const GOLD_MINTER: felt252 = selector_from_tag!("zidle-gold_minter");
    const RESOURCES: felt252 = selector_from_tag!("zidle-resources");
    const SETTINGS: felt252 = selector_from_tag!("zidle-settings");
}

#[generate_trait]
impl SystemsImpl of SystemsTrait {
    fn contract_address(self: @WorldStorage, contract_name: @ByteArray) -> ContractAddress {
        match self.dns(contract_name) {
            Option::Some((contract_address, _)) => { (contract_address) },
            Option::None => { (Zeroable::zero()) },
        }
    }

    // systems
    #[inline(always)]
    fn character_address(self: @WorldStorage) -> ContractAddress {
        (self.contract_address(@"character"))
    }
    #[inline(always)]
    fn character_minter_address(self: @WorldStorage) -> ContractAddress {
        (self.contract_address(@"character_minter"))
    }
    #[inline(always)]
    fn gold_minter_address(self: @WorldStorage) -> ContractAddress {
        (self.contract_address(@"gold_minter"))
    }
    #[inline(always)]
    fn resources_address(self: @WorldStorage) -> ContractAddress {
        (self.contract_address(@"resources"))
    }
    #[inline(always)]
    fn settings_address(self: @WorldStorage) -> ContractAddress {
        (self.contract_address(@"settings"))
    }

    // dispatchers
    fn character_minter_dispatcher(self: @WorldStorage) -> ICharacterMinterDispatcher {
        (ICharacterMinterDispatcher { contract_address: self.character_minter_address() })
    }
    fn gold_minter_dispatcher(self: @WorldStorage) -> IGoldMinterDispatcher {
        (IGoldMinterDispatcher { contract_address: self.gold_minter_address() })
    }
    fn resources_dispatcher(self: @WorldStorage) -> IResourcesDispatcher {
        (IResourcesDispatcher { contract_address: self.resources_address() })
    }

    // validators
    fn is_character_minter_contract(self: @WorldStorage, address: ContractAddress) -> bool {
        (address == self.character_minter_address())
    }
    fn is_gold_minter_contract(self: @WorldStorage, address: ContractAddress) -> bool {
        (address == self.gold_minter_address())
    }
}
