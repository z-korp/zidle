#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum GoalType {
    None,
    Gold,
    Wood,
    Food,
    Mineral,
}

trait GoalTrait {
    fn points_first(self: GoalType) -> u64;
    fn points_second(self: GoalType) -> u64;
    fn from(value: u8) -> GoalType;
}

impl GoalImpl of GoalTrait {
    fn points_first(self: GoalType) -> u64 {
        match self {
            GoalType::None => 0,
            GoalType::Gold => 100,
            GoalType::Wood => 50,
            GoalType::Food => 25,
            GoalType::Mineral => 75,
        }
    }

    fn points_second(self: GoalType) -> u64 {
        match self {
            GoalType::None => 0,
            GoalType::Gold => 50,
            GoalType::Wood => 25,
            GoalType::Food => 12,
            GoalType::Mineral => 37,
        }
    }

    fn from(value: u8) -> GoalType {
        match value {
            0 => GoalType::None,
            1 => GoalType::Gold,
            2 => GoalType::Wood,
            3 => GoalType::Food,
            4 => GoalType::Mineral,
            _ => GoalType::None,
        }
    }
}
