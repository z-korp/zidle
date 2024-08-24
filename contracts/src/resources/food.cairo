#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum FoodType {
    Pine,
    Oak,
    Maple,
    Walnut,
    Mahogany,
    Ebony,
    Eldertree,
}

trait FoodTrait {
    fn min_level(self: FoodType) -> u8;
    fn max_level(self: FoodType) -> u8;
    fn hardness(self: FoodType) -> u8;
    fn base_xp(self: FoodType) -> u8;
    fn calculate_xp(self: FoodType, player_level: u8) -> u16;
    fn calculate_gathering_speed(self: FoodType, player_level: u8) -> u16;
    fn from(value: u8) -> FoodType;
}

impl FoodImpl of FoodTrait {
    fn min_level(self: FoodType) -> u8 {
        match self {
            FoodType::Pine => 0,
            FoodType::Oak => 15,
            FoodType::Maple => 30,
            FoodType::Walnut => 45,
            FoodType::Mahogany => 60,
            FoodType::Ebony => 75,
            FoodType::Eldertree => 90,
        }
    }

    fn max_level(self: FoodType) -> u8 {
        match self {
            FoodType::Pine => 14,
            FoodType::Oak => 29,
            FoodType::Maple => 44,
            FoodType::Walnut => 59,
            FoodType::Mahogany => 74,
            FoodType::Ebony => 89,
            FoodType::Eldertree => 99,
        }
    }

    fn hardness(self: FoodType) -> u8 {
        match self {
            FoodType::Pine => 10,
            FoodType::Oak => 15,
            FoodType::Maple => 20,
            FoodType::Walnut => 25,
            FoodType::Mahogany => 30,
            FoodType::Ebony => 35,
            FoodType::Eldertree => 40,
        }
    }

    fn base_xp(self: FoodType) -> u8 {
        match self {
            FoodType::Pine => 5,
            FoodType::Oak => 10,
            FoodType::Maple => 15,
            FoodType::Walnut => 20,
            FoodType::Mahogany => 25,
            FoodType::Ebony => 30,
            FoodType::Eldertree => 50,
        }
    }

    fn calculate_xp(self: FoodType, player_level: u8) -> u16 {
        let base: u16 = Self::base_xp(self).into();
        let level_bonus: u16 = (player_level.into() - self.min_level().into()) * 2;
        base + level_bonus
    }

    fn calculate_gathering_speed(self: FoodType, player_level: u8) -> u16 {
        let base_speed: u16 = 100; // Base speed of 1 unit per minute, scaled by 100 for precision
        let level_bonus: u16 = player_level.into() * 2; // 2% increase per level
        let hardness_factor: u16 = Self::hardness(self).into();

        (base_speed + level_bonus) / hardness_factor
    }

    fn from(value: u8) -> FoodType {
        match value {
            0 => FoodType::Pine,
            1 => FoodType::Oak,
            2 => FoodType::Maple,
            3 => FoodType::Walnut,
            4 => FoodType::Mahogany,
            5 => FoodType::Ebony,
            6 => FoodType::Eldertree,
            _ => FoodType::Pine,
        }
    }
}
