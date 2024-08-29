#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum WoodType {
    None,
    Pine,
    Oak,
    Maple,
    Walnut,
    Mahogany,
    Ebony,
    Eldertree,
}

trait WoodTrait {
    fn unit_price(self: WoodType) -> u64;
    fn min_level(self: WoodType) -> u8;
    fn max_level(self: WoodType) -> u8;
    fn base_time(self: WoodType) -> u16;
    fn base_xp(self: WoodType) -> u8;
    fn calculate_xp(self: WoodType, player_level: u8) -> u16;
    fn calculate_gathering_duration(self: WoodType, player_level: u8) -> u32;
    fn from(value: u8) -> WoodType;
}

impl WoodImpl of WoodTrait {
    fn unit_price(self: WoodType) -> u64 {
        match self {
            WoodType::None => 0,
            WoodType::Pine => 1,
            WoodType::Oak => 2,
            WoodType::Maple => 3,
            WoodType::Walnut => 4,
            WoodType::Mahogany => 5,
            WoodType::Ebony => 6,
            WoodType::Eldertree => 10,
        }
    }

    fn min_level(self: WoodType) -> u8 {
        match self {
            WoodType::None => 0,
            WoodType::Pine => 0,
            WoodType::Oak => 15,
            WoodType::Maple => 30,
            WoodType::Walnut => 45,
            WoodType::Mahogany => 60,
            WoodType::Ebony => 75,
            WoodType::Eldertree => 90,
        }
    }

    fn max_level(self: WoodType) -> u8 {
        match self {
            WoodType::None => 0,
            WoodType::Pine => 14,
            WoodType::Oak => 29,
            WoodType::Maple => 44,
            WoodType::Walnut => 59,
            WoodType::Mahogany => 74,
            WoodType::Ebony => 89,
            WoodType::Eldertree => 99,
        }
    }

    fn base_xp(self: WoodType) -> u8 {
        match self {
            WoodType::None => 0,
            WoodType::Pine => 5,
            WoodType::Oak => 10,
            WoodType::Maple => 15,
            WoodType::Walnut => 20,
            WoodType::Mahogany => 25,
            WoodType::Ebony => 30,
            WoodType::Eldertree => 50,
        }
    }

    fn calculate_xp(self: WoodType, player_level: u8) -> u16 {
        Self::base_xp(self).into()
    }

    fn base_time(self: WoodType) -> u16 {
        match self {
            WoodType::None => 2000,
            WoodType::Pine => 2000, // 2000ms (2 seconds)
            WoodType::Oak => 3000,
            WoodType::Maple => 4000,
            WoodType::Walnut => 5000,
            WoodType::Mahogany => 6000,
            WoodType::Ebony => 10000,
            WoodType::Eldertree => 15000,
        }
    }

    fn calculate_gathering_duration(self: WoodType, player_level: u8) -> u32 {
        // Calculate level bonus (0.5% reduction per level, max 49.5% at level 99)
        let level_bonus = player_level * 5; // 0.5% per level, multiplied by 10 for precision
        let time_reduction: u32 = (Self::base_time(self).into() * level_bonus.into())
            / 1000; // Divide by 1000 to apply percentage

        let final_time = Self::base_time(self).into() - time_reduction;

        final_time
    }

    fn from(value: u8) -> WoodType {
        match value {
            0 => WoodType::None,
            1 => WoodType::Pine,
            2 => WoodType::Oak,
            3 => WoodType::Maple,
            4 => WoodType::Walnut,
            5 => WoodType::Mahogany,
            6 => WoodType::Ebony,
            7 => WoodType::Eldertree,
            _ => WoodType::None, // Default to None for invalid values
        }
    }
}
