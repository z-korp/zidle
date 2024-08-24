#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum MineralType {
    Pine,
    Oak,
    Maple,
    Walnut,
    Mahogany,
    Ebony,
    Eldertree,
}

trait MineralTrait {
    fn min_level(self: MineralType) -> u8;
    fn max_level(self: MineralType) -> u8;
    fn hardness(self: MineralType) -> u8;
    fn base_xp(self: MineralType) -> u8;
    fn calculate_xp(self: MineralType, player_level: u8) -> u16;
    fn calculate_gathering_speed(self: MineralType, player_level: u8) -> u16;
    fn from(value: u8) -> MineralType;
}

impl MineralImpl of MineralTrait {
    fn min_level(self: MineralType) -> u8 {
        match self {
            MineralType::Pine => 0,
            MineralType::Oak => 15,
            MineralType::Maple => 30,
            MineralType::Walnut => 45,
            MineralType::Mahogany => 60,
            MineralType::Ebony => 75,
            MineralType::Eldertree => 90,
        }
    }

    fn max_level(self: MineralType) -> u8 {
        match self {
            MineralType::Pine => 14,
            MineralType::Oak => 29,
            MineralType::Maple => 44,
            MineralType::Walnut => 59,
            MineralType::Mahogany => 74,
            MineralType::Ebony => 89,
            MineralType::Eldertree => 99,
        }
    }

    fn hardness(self: MineralType) -> u8 {
        match self {
            MineralType::Pine => 10,
            MineralType::Oak => 15,
            MineralType::Maple => 20,
            MineralType::Walnut => 25,
            MineralType::Mahogany => 30,
            MineralType::Ebony => 35,
            MineralType::Eldertree => 40,
        }
    }

    fn base_xp(self: MineralType) -> u8 {
        match self {
            MineralType::Pine => 5,
            MineralType::Oak => 10,
            MineralType::Maple => 15,
            MineralType::Walnut => 20,
            MineralType::Mahogany => 25,
            MineralType::Ebony => 30,
            MineralType::Eldertree => 50,
        }
    }

    fn calculate_xp(self: MineralType, player_level: u8) -> u16 {
        let base: u16 = Self::base_xp(self).into();
        let level_bonus: u16 = (player_level.into() - self.min_level().into()) * 2;
        base + level_bonus
    }

    fn calculate_gathering_speed(self: MineralType, player_level: u8) -> u16 {
        let base_speed: u16 = 100; // Base speed of 1 unit per minute, scaled by 100 for precision
        let level_bonus: u16 = player_level.into() * 2; // 2% increase per level
        let hardness_factor: u16 = Self::hardness(self).into();

        (base_speed + level_bonus) / hardness_factor
    }

    fn from(value: u8) -> MineralType {
        match value {
            0 => MineralType::Pine,
            1 => MineralType::Oak,
            2 => MineralType::Maple,
            3 => MineralType::Walnut,
            4 => MineralType::Mahogany,
            5 => MineralType::Ebony,
            6 => MineralType::Eldertree,
            _ => MineralType::Pine, // Default to Pine for invalid values
        }
    }
}
