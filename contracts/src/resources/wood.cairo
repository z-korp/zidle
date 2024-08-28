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
    fn hardness(self: WoodType) -> u8;
    fn base_xp(self: WoodType) -> u8;
    fn calculate_xp(self: WoodType, player_level: u8) -> u16;
    fn calculate_gathering_speed(self: WoodType, player_level: u8) -> u16;
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

    fn hardness(self: WoodType) -> u8 {
        match self {
            WoodType::None => 0,
            WoodType::Pine => 10,
            WoodType::Oak => 15,
            WoodType::Maple => 20,
            WoodType::Walnut => 25,
            WoodType::Mahogany => 30,
            WoodType::Ebony => 35,
            WoodType::Eldertree => 40,
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
        let base: u16 = Self::base_xp(self).into();
        let level_bonus: u16 = (player_level.into() - self.min_level().into()) * 2;
        base + level_bonus
    }

    fn calculate_gathering_speed(self: WoodType, player_level: u8) -> u16 {
        let base_speed: u16 = 100; // Base speed of 1 unit per minute, scaled by 100 for precision
        let level_bonus: u16 = player_level.into() * 2; // 2% increase per level
        let hardness_factor: u16 = Self::hardness(self).into();

        (base_speed + level_bonus) / hardness_factor
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
