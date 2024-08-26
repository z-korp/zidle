// Starknet imports

use starknet::ContractAddress;
use core::Zeroable;

// Dojo imports

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

// Internal imports

use zidle::interfaces::ierc721::{ierc721, IERC721Dispatcher, IERC721DispatcherTrait};
use zidle::interfaces::systems::{WorldSystemsTrait};

#[derive(Copy, Drop, Serde, IntrospectPacked)]
#[dojo::model]
pub struct Character {
    #[key]
    token_id: u128,
    name: felt252,
}

//----------------------------------
// Manager
//

#[derive(Copy, Drop)]
struct CharacterManager {
    world: IWorldDispatcher,
    token_dispatcher: IERC721Dispatcher,
}

#[generate_trait]
impl CharacterManagerTraitImpl of CharacterManagerTrait {
    fn new(world: IWorldDispatcher) -> CharacterManager {
        let contract_address: ContractAddress = world.character_token_address();
        assert(contract_address != core::Zeroable::zero(), 'CharManager: null token addr');
        let token_dispatcher = ierc721(contract_address);
        (CharacterManager { world, token_dispatcher })
    }

    fn get_token_dispatcher(self: CharacterManager) -> IERC721Dispatcher {
        (self.token_dispatcher)
    }
    fn owner_of(self: CharacterManager, token_id: u128) -> ContractAddress {
        (self.token_dispatcher.owner_of(token_id.into()))
    }
    fn exists(self: CharacterManager, token_id: u128) -> bool {
        (self.owner_of(token_id).is_non_zero())
    }
    fn is_owner_of(self: CharacterManager, address: ContractAddress, token_id: u128) -> bool {
        (self.owner_of(token_id) == address)
    }
}
