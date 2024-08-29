use starknet::{ContractAddress, ClassHash};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait, Resource};

use zidle::systems::{
    character_minter::{ICharacterMinterDispatcher, ICharacterMinterDispatcherTrait},
    character_token::{ICharacterTokenDispatcher, ICharacterTokenDispatcherTrait},
    gold_minter::{IGoldMinterDispatcher, IGoldMinterDispatcherTrait},
    gold_token::{IGoldTokenDispatcher, IGoldTokenDispatcherTrait},
    resources::{IResourcesDispatcher, IResourcesDispatcherTrait},
};
use core::Zeroable;

mod SELECTORS {
    const CHARACTER_MINTER: felt252 = selector_from_tag!("zidle-character_minter");
    const CHARACTER_TOKEN: felt252 = selector_from_tag!("zidle-character_token");
    const GOLD_MINTER: felt252 = selector_from_tag!("zidle-gold_minter");
    const GOLD_TOKEN: felt252 = selector_from_tag!("zidle-gold_token");
    const RESOURCES: felt252 = selector_from_tag!("zidle-resources");
}

#[generate_trait]
impl WorldSystemsTraitImpl of WorldSystemsTrait {
    fn contract_address(self: IWorldDispatcher, selector: felt252) -> ContractAddress {
        if let Resource::Contract((_, contract_address)) = self.resource(selector) {
            (contract_address)
        } else {
            (Zeroable::zero())
        }
    }

    // system addresses
    fn character_token_address(self: IWorldDispatcher) -> ContractAddress {
        (self.contract_address(SELECTORS::CHARACTER_TOKEN))
    }

    fn gold_token_address(self: IWorldDispatcher) -> ContractAddress {
        (self.contract_address(SELECTORS::GOLD_TOKEN))
    }

    // dispatchers
    fn character_minter_dispatcher(self: IWorldDispatcher) -> ICharacterMinterDispatcher {
        (ICharacterMinterDispatcher {
            contract_address: self.contract_address(SELECTORS::CHARACTER_MINTER)
        })
    }
    fn character_token_dispatcher(self: IWorldDispatcher) -> ICharacterTokenDispatcher {
        (ICharacterTokenDispatcher {
            contract_address: self.contract_address(SELECTORS::CHARACTER_TOKEN)
        })
    }
    fn gold_minter_dispatcher(self: IWorldDispatcher) -> IGoldMinterDispatcher {
        (IGoldMinterDispatcher { contract_address: self.contract_address(SELECTORS::GOLD_MINTER) })
    }
    fn gold_token_dispatcher(self: IWorldDispatcher) -> IGoldTokenDispatcher {
        (IGoldTokenDispatcher { contract_address: self.contract_address(SELECTORS::GOLD_TOKEN) })
    }
    fn resources_dispatcher(self: IWorldDispatcher) -> IResourcesDispatcher {
        (IResourcesDispatcher { contract_address: self.contract_address(SELECTORS::RESOURCES) })
    }

    // validators
    fn is_character_minter_contract(self: IWorldDispatcher, address: ContractAddress) -> bool {
        (address == self.contract_address(SELECTORS::CHARACTER_MINTER))
    }
    fn is_gold_minter_contract(self: IWorldDispatcher, address: ContractAddress) -> bool {
        (address == self.contract_address(SELECTORS::GOLD_MINTER))
    }
}
