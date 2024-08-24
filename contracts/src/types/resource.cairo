use zidle::resources::interface::{ResourceType, ResourceTrait};
use zidle::resources::wood::{WoodType, WoodTrait};
use zidle::resources::food::{FoodType, FoodTrait};
use zidle::resources::mineral::{MineralType, MineralTrait};

mod errors {
    const LVL_NOT_VALID: felt252 = 'ResourceType: level not valid';
}

impl ResourceImpl of ResourceTrait {
    fn min_level(self: ResourceType) -> u8 {
        match self {
            ResourceType::Wood(wood_type) => wood_type.min_level(),
            ResourceType::Food(food_type) => food_type.min_level(),
            ResourceType::Mineral(mineral_type) => mineral_type.min_level(),
            ResourceType::None => 0,
        }
    }

    fn max_level(self: ResourceType) -> u8 {
        match self {
            ResourceType::Wood(wood_type) => wood_type.max_level(),
            ResourceType::Food(food_type) => food_type.max_level(),
            ResourceType::Mineral(mineral_type) => mineral_type.max_level(),
            ResourceType::None => 0,
        }
    }

    fn hardness(self: ResourceType) -> u8 {
        match self {
            ResourceType::Wood(wood_type) => wood_type.hardness(),
            ResourceType::Food(food_type) => food_type.hardness(),
            ResourceType::Mineral(mineral_type) => mineral_type.hardness(),
            ResourceType::None => 0,
        }
    }

    fn base_xp(self: ResourceType) -> u8 {
        match self {
            ResourceType::Wood(wood_type) => wood_type.base_xp(),
            ResourceType::Food(food_type) => food_type.base_xp(),
            ResourceType::Mineral(mineral_type) => mineral_type.base_xp(),
            ResourceType::None => 0,
        }
    }

    fn calculate_xp(self: ResourceType, player_level: u8) -> u16 {
        match self {
            ResourceType::Wood(wood_type) => wood_type.calculate_xp(player_level),
            ResourceType::Food(food_type) => food_type.calculate_xp(player_level),
            ResourceType::Mineral(mineral_type) => mineral_type.calculate_xp(player_level),
            ResourceType::None => 0,
        }
    }

    fn calculate_gathering_speed(self: ResourceType, player_level: u8) -> u16 {
        match self {
            ResourceType::Wood(wood_type) => wood_type.calculate_gathering_speed(player_level),
            ResourceType::Food(food_type) => food_type.calculate_gathering_speed(player_level),
            ResourceType::Mineral(mineral_type) => mineral_type
                .calculate_gathering_speed(player_level),
            ResourceType::None => 0,
        }
    }

    fn from(resource_type: u8, subresource_type: u8) -> ResourceType {
        match resource_type {
            0 => ResourceType::None,
            1 => ResourceType::Wood(WoodType::Pine),
            2 => ResourceType::Food(FoodType::Berries),
            3 => ResourceType::Mineral(MineralType::Coal),
            _ => ResourceType::None,
        }
    }
}
// You might also want to implement conversion traits similar to those in your example:

// impl ResourceTypeIntoFelt252 of core::Into<ResourceType, felt252> {
//     fn into(self: ResourceType) -> felt252 {
//         match self {
//             ResourceType::Wood(wood_type) => wood_type.into(),
//             ResourceType::Food(food_type) => food_type.into(),
//             ResourceType::Mineral(mineral_type) => mineral_type.into(),
//         }
//     }
// }

// impl Felt252IntoResourceType of core::Into<felt252, ResourceType> {
//     fn into(self: felt252) -> ResourceType {
//         // This implementation would depend on how you've defined your felt252 constants
//         // for each resource type. Here's a conceptual example:
//         if self == WOOD_FELT {
//             ResourceType::Wood(self.into())
//         } else if self == FOOD_FELT {
//             ResourceType::Food(self.into())
//         } else if self == MINERAL_FELT {
//             ResourceType::Mineral(self.into())
//         } else { // Handle error or default case
//         }
//     }
// }

// impl ResourceTypePrint of PrintTrait<ResourceType> {
//     fn print(self: ResourceType) {
//         let felt: felt252 = self.into();
//         felt.print();
//     }
// }

impl ResourceTypeIntoU8 of core::Into<ResourceType, u8> {
    fn into(self: ResourceType) -> u8 {
        match self {
            ResourceType::None => 0,
            ResourceType::Wood => 1,
            ResourceType::Food => 2,
            ResourceType::Mineral => 3,
        }
    }
}

#[generate_trait]
impl ResourceTypeAssert of AssertTrait {
    #[inline(always)]
    fn assert_level(self: ResourceType, player_level: u8) {
        assert(self.min_level() <= player_level, errors::LVL_NOT_VALID);
    }
}
