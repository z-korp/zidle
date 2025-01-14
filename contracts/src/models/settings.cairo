// External imports
use starknet::ContractAddress;

// Core imports
use core::zeroable::Zeroable;

mod errors {}

#[derive(Copy, Drop, Serde, IntrospectPacked, Debug)]
#[dojo::model]
struct Settings {
    #[key]
    pub id: u8,
    pub gold_erc20_address: ContractAddress,
    pub character_erc721_address: ContractAddress,
    pub is_set: bool,
}

#[generate_trait]
impl SettingsImpl of SettingsTrait {
    #[inline(always)]
    fn new() -> Settings {
        Settings {
            id: 1,
            gold_erc20_address: Zeroable::zero(),
            character_erc721_address: Zeroable::zero(),
            is_set: true,
        }
    }

    #[inline(always)]
    fn set_gold_erc20_address(ref self: Settings, value: ContractAddress) {
        self.gold_erc20_address = value;
    }

    #[inline(always)]
    fn set_character_erc721_address(ref self: Settings, value: ContractAddress) {
        self.character_erc721_address = value;
    }
}

#[generate_trait]
impl SettingsAssert of AssertTrait {
    #[inline(always)]
    fn assert_exists(self: Settings) {
        assert(self.is_non_zero(), 'Settings: Does not exist');
    }

    #[inline(always)]
    fn assert_not_exists(self: Settings) {
        assert(self.is_zero(), 'Settings: Already exists');
    }
}

impl ZeroableSettingsImpl of core::Zeroable<Settings> {
    #[inline(always)]
    fn zero() -> Settings {
        Settings {
            id: 0,
            gold_erc20_address: Zeroable::zero(),
            character_erc721_address: Zeroable::zero(),
            is_set: false,
        }
    }

    #[inline(always)]
    fn is_zero(self: Settings) -> bool {
        !self.is_set
    }

    #[inline(always)]
    fn is_non_zero(self: Settings) -> bool {
        !self.is_zero()
    }
}
