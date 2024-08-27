use zidle::resources::wood::WoodType;
use zidle::resources::food::FoodType;
use zidle::resources::mineral::MineralType;

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum ResourceType {
    None,
    Wood: WoodType,
    Food: FoodType,
    Mineral: MineralType,
}

trait ResourceTrait {
    fn unit_price(self: ResourceType) -> u64;
    fn min_level(self: ResourceType) -> u8;
    fn max_level(self: ResourceType) -> u8;
    fn hardness(self: ResourceType) -> u8;
    fn base_xp(self: ResourceType) -> u8;
    fn calculate_xp(self: ResourceType, player_level: u8) -> u16;
    fn calculate_gathering_speed(self: ResourceType, player_level: u8) -> u16;
    fn from(resource_type: u8, subresource_type: u8) -> ResourceType;
}
