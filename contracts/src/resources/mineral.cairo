#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum MineralType {
    None,
    Coal,
    Copper,
    Iron,
    Silver,
    Gold,
    Mithril,
    Adamantium
}

trait MineralTrait {
    fn unit_price(self: MineralType) -> u64;
    fn min_level(self: MineralType) -> u8;
    fn max_level(self: MineralType) -> u8;
    fn base_time(self: MineralType) -> u16;
    fn base_xp(self: MineralType) -> u8;
    fn calculate_xp(self: MineralType, player_level: u8) -> u16;
    fn calculate_gathering_duration(self: MineralType, player_level: u8) -> u32;
    fn from(value: u8) -> MineralType;
}

impl MineralImpl of MineralTrait {
    fn unit_price(self: MineralType) -> u64 {
        match self {
            MineralType::None => 0,
            MineralType::Coal => 1,
            MineralType::Copper => 2,
            MineralType::Iron => 3,
            MineralType::Silver => 4,
            MineralType::Gold => 5,
            MineralType::Mithril => 6,
            MineralType::Adamantium => 10,
        }
    }

    fn min_level(self: MineralType) -> u8 {
        match self {
            MineralType::None => 0,
            MineralType::Coal => 0,
            MineralType::Copper => 15,
            MineralType::Iron => 30,
            MineralType::Silver => 45,
            MineralType::Gold => 60,
            MineralType::Mithril => 75,
            MineralType::Adamantium => 90,
        }
    }

    fn max_level(self: MineralType) -> u8 {
        match self {
            MineralType::None => 0,
            MineralType::Coal => 14,
            MineralType::Copper => 29,
            MineralType::Iron => 44,
            MineralType::Silver => 59,
            MineralType::Gold => 74,
            MineralType::Mithril => 89,
            MineralType::Adamantium => 99,
        }
    }

    fn base_xp(self: MineralType) -> u8 {
        match self {
            MineralType::None => 0,
            MineralType::Coal => 5,
            MineralType::Copper => 10,
            MineralType::Iron => 15,
            MineralType::Silver => 20,
            MineralType::Gold => 25,
            MineralType::Mithril => 30,
            MineralType::Adamantium => 50,
        }
    }

    fn calculate_xp(self: MineralType, player_level: u8) -> u16 {
        Self::base_xp(self).into()
    }

    fn base_time(self: MineralType) -> u16 {
        match self {
            MineralType::None => 2000,
            MineralType::Coal => 2000, // 2000ms (2 seconds)
            MineralType::Copper => 3000,
            MineralType::Iron => 4000,
            MineralType::Silver => 5000,
            MineralType::Gold => 6000,
            MineralType::Mithril => 10000,
            MineralType::Adamantium => 15000,
        }
    }

    fn calculate_gathering_duration(self: MineralType, player_level: u8) -> u32 {
        // Calculate level bonus (0.5% reduction per level, max 49.5% at level 99)
        let level_bonus = player_level * 5; // 0.5% per level, multiplied by 10 for precision
        let time_reduction: u32 = (Self::base_time(self).into() * level_bonus.into())
            / 1000; // Divide by 1000 to apply percentage

        let final_time = Self::base_time(self).into() - time_reduction;

        final_time
    }

    fn from(value: u8) -> MineralType {
        match value {
            0 => MineralType::None,
            1 => MineralType::Coal,
            2 => MineralType::Copper,
            3 => MineralType::Iron,
            4 => MineralType::Silver,
            5 => MineralType::Gold,
            6 => MineralType::Mithril,
            7 => MineralType::Adamantium,
            _ => MineralType::None, // Default to None for invalid values
        }
    }
}
