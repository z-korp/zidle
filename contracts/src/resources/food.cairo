#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum FoodType {
    Berries,
    Wheat,
    Vegetables,
    Fruits,
    Herbs,
    Mushrooms,
    Ambrosia,
}

trait FoodTrait {
    fn unit_price(self: FoodType) -> u64;
    fn min_level(self: FoodType) -> u8;
    fn max_level(self: FoodType) -> u8;
    fn hardness(self: FoodType) -> u8;
    fn base_xp(self: FoodType) -> u8;
    fn calculate_xp(self: FoodType, player_level: u8) -> u16;
    fn calculate_gathering_speed(self: FoodType, player_level: u8) -> u16;
    fn from(value: u8) -> FoodType;
}

impl FoodImpl of FoodTrait {
    fn unit_price(self: FoodType) -> u64 {
        match self {
            FoodType::Berries => 1,
            FoodType::Wheat => 2,
            FoodType::Vegetables => 3,
            FoodType::Fruits => 4,
            FoodType::Herbs => 5,
            FoodType::Mushrooms => 6,
            FoodType::Ambrosia => 10,
        }
    }

    fn min_level(self: FoodType) -> u8 {
        match self {
            FoodType::Berries => 0,
            FoodType::Wheat => 15,
            FoodType::Vegetables => 30,
            FoodType::Fruits => 45,
            FoodType::Herbs => 60,
            FoodType::Mushrooms => 75,
            FoodType::Ambrosia => 90,
        }
    }

    fn max_level(self: FoodType) -> u8 {
        match self {
            FoodType::Berries => 14,
            FoodType::Wheat => 29,
            FoodType::Vegetables => 44,
            FoodType::Fruits => 59,
            FoodType::Herbs => 74,
            FoodType::Mushrooms => 89,
            FoodType::Ambrosia => 99,
        }
    }

    fn hardness(self: FoodType) -> u8 {
        match self {
            FoodType::Berries => 10,
            FoodType::Wheat => 15,
            FoodType::Vegetables => 20,
            FoodType::Fruits => 25,
            FoodType::Herbs => 30,
            FoodType::Mushrooms => 35,
            FoodType::Ambrosia => 40,
        }
    }

    fn base_xp(self: FoodType) -> u8 {
        match self {
            FoodType::Berries => 5,
            FoodType::Wheat => 10,
            FoodType::Vegetables => 15,
            FoodType::Fruits => 20,
            FoodType::Herbs => 25,
            FoodType::Mushrooms => 30,
            FoodType::Ambrosia => 50,
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
            0 => FoodType::Berries,
            1 => FoodType::Wheat,
            2 => FoodType::Vegetables,
            3 => FoodType::Fruits,
            4 => FoodType::Herbs,
            5 => FoodType::Mushrooms,
            6 => FoodType::Ambrosia,
            _ => FoodType::Berries,
        }
    }
}
