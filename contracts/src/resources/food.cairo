#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum FoodType {
    None,
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
    fn base_time(self: FoodType) -> u16;
    fn base_xp(self: FoodType) -> u8;
    fn calculate_xp(self: FoodType, player_level: u8) -> u16;
    fn calculate_gathering_duration(self: FoodType, player_level: u8) -> u32;
    fn from(value: u8) -> FoodType;
}

impl FoodImpl of FoodTrait {
    fn unit_price(self: FoodType) -> u64 {
        match self {
            FoodType::None => 0,
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
            FoodType::None => 0,
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
            FoodType::None => 0,
            FoodType::Berries => 14,
            FoodType::Wheat => 29,
            FoodType::Vegetables => 44,
            FoodType::Fruits => 59,
            FoodType::Herbs => 74,
            FoodType::Mushrooms => 89,
            FoodType::Ambrosia => 99,
        }
    }

    fn base_xp(self: FoodType) -> u8 {
        match self {
            FoodType::None => 0,
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
        Self::base_xp(self).into()
    }

    fn base_time(self: FoodType) -> u16 {
        match self {
            FoodType::None => 2000,
            FoodType::Berries => 2000, // 2000ms (2 seconds)
            FoodType::Wheat => 3000,
            FoodType::Vegetables => 4000,
            FoodType::Fruits => 5000,
            FoodType::Herbs => 6000,
            FoodType::Mushrooms => 10000,
            FoodType::Ambrosia => 15000,
        }
    }

    fn calculate_gathering_duration(self: FoodType, player_level: u8) -> u32 {
        // Calculate level bonus (0.5% reduction per level, max 49.5% at level 99)
        let level_bonus = player_level * 5; // 0.5% per level, multiplied by 10 for precision
        let time_reduction: u32 = (Self::base_time(self).into() * level_bonus.into())
            / 1000; // Divide by 1000 to apply percentage

        let final_time = Self::base_time(self).into() - time_reduction;

        final_time
    }

    fn from(value: u8) -> FoodType {
        match value {
            0 => FoodType::None,
            1 => FoodType::Berries,
            2 => FoodType::Wheat,
            3 => FoodType::Vegetables,
            4 => FoodType::Fruits,
            5 => FoodType::Herbs,
            6 => FoodType::Mushrooms,
            7 => FoodType::Ambrosia,
            _ => FoodType::None, // Default to None for invalid values
        }
    }
}
