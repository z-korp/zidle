#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum MineralType {
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
    fn hardness(self: MineralType) -> u8;
    fn base_xp(self: MineralType) -> u8;
    fn calculate_xp(self: MineralType, player_level: u8) -> u16;
    fn calculate_gathering_speed(self: MineralType, player_level: u8) -> u16;
    fn from(value: u8) -> MineralType;
}

impl MineralImpl of MineralTrait {
    fn unit_price(self: MineralType) -> u64 {
        match self {
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
            MineralType::Coal => 14,
            MineralType::Copper => 29,
            MineralType::Iron => 44,
            MineralType::Silver => 59,
            MineralType::Gold => 74,
            MineralType::Mithril => 89,
            MineralType::Adamantium => 99,
        }
    }

    fn hardness(self: MineralType) -> u8 {
        match self {
            MineralType::Coal => 10,
            MineralType::Copper => 15,
            MineralType::Iron => 20,
            MineralType::Silver => 25,
            MineralType::Gold => 30,
            MineralType::Mithril => 35,
            MineralType::Adamantium => 40,
        }
    }

    fn base_xp(self: MineralType) -> u8 {
        match self {
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
            0 => MineralType::Coal,
            1 => MineralType::Copper,
            2 => MineralType::Iron,
            3 => MineralType::Silver,
            4 => MineralType::Gold,
            5 => MineralType::Mithril,
            6 => MineralType::Adamantium,
            _ => MineralType::Coal, // Default to Pine for invalid values
        }
    }
}
