// Starknet imports

use starknet::ContractAddress;

mod errors {
    const PLAYER_NOT_EXIST: felt252 = 'Player: does not exist';
    const PLAYER_ALREADY_EXIST: felt252 = 'Player: already exist';
    const PLAYER_INVALID_NAME: felt252 = 'Player: invalid name';
}

#[derive(Copy, Drop, Serde, IntrospectPacked)]
#[dojo::model]
pub struct Player {
    #[key]
    token_id: felt252,
    name: felt252,
    gold: u64,
}

#[generate_trait]
impl PlayerImpl of PlayerTrait {
    #[inline(always)]
    fn new(token_id: felt252, name: felt252) -> Player {
        // [Check] Name is valid
        assert(name != 0, errors::PLAYER_INVALID_NAME);

        // [Return] Player
        Player { token_id, name, gold: 0 }
    }

    #[inline(always)]
    fn rename(ref self: Player, name: felt252) {
        // [Check] Name is valid
        assert(name != 0, errors::PLAYER_INVALID_NAME);
        // [Effect] Change the name
        self.name = name;
    }

    #[inline(always)]
    fn add_tokens(ref self: Player, amount: u64) {
        // [Effect] Add tokens
        self.gold += amount;
    }
}

#[generate_trait]
impl PlayerAssert of AssertTrait {
    #[inline(always)]
    fn assert_exists(self: Player) {
        assert(self.is_non_zero(), errors::PLAYER_NOT_EXIST);
    }

    #[inline(always)]
    fn assert_not_exists(self: Player) {
        assert(self.is_zero(), errors::PLAYER_ALREADY_EXIST);
    }
}

impl ZeroablePlayerImpl of core::Zeroable<Player> {
    #[inline(always)]
    fn zero() -> Player {
        Player { token_id: core::Zeroable::zero(), name: 0, gold: 0 }
    }

    #[inline(always)]
    fn is_zero(self: Player) -> bool {
        0 == self.name
    }

    #[inline(always)]
    fn is_non_zero(self: Player) -> bool {
        !self.is_zero()
    }
}
