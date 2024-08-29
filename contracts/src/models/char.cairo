// Starknet imports

use starknet::ContractAddress;
use core::Zeroable;

// Dojo imports

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

// Internal imports

use zidle::interfaces::ierc721::{ierc721, IERC721Dispatcher, IERC721DispatcherTrait};
use zidle::interfaces::systems::{WorldSystemsTrait};

mod errors {
    const CHAR_NOT_EXIST: felt252 = 'Char: does not exist';
    const CHAR_ALREADY_EXIST: felt252 = 'Char: already exist';
    const CHAR_INVALID_NAME: felt252 = 'Char: invalid name';
}

#[derive(Copy, Drop, Serde, IntrospectPacked)]
#[dojo::model]
pub struct Char {
    #[key]
    id: felt252,
    #[key]
    token_id: u128,
    name: felt252,
}

#[generate_trait]
impl CharAssert of AssertTrait {
    #[inline(always)]
    fn assert_exists(self: Char) {
        assert(self.is_non_zero(), errors::CHAR_NOT_EXIST);
    }

    #[inline(always)]
    fn assert_not_exists(self: Char) {
        assert(self.is_zero(), errors::CHAR_ALREADY_EXIST);
    }
}

impl ZeroableCharImpl of core::Zeroable<Char> {
    #[inline(always)]
    fn zero() -> Char {
        Char { id: core::Zeroable::zero(), token_id: 0, name: 0 }
    }

    #[inline(always)]
    fn is_zero(self: Char) -> bool {
        0 == self.name
    }

    #[inline(always)]
    fn is_non_zero(self: Char) -> bool {
        !self.is_zero()
    }
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
