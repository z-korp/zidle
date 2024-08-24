#[derive(Copy, Drop, Serde, IntrospectPacked)]
#[dojo::model]
pub struct Player {
    #[key]
    id: felt252,
    name: felt252,
}

#[derive(Copy, Drop, Serde, IntrospectPacked)]
#[dojo::model]
pub struct Miner {
    #[key]
    id: felt252,
    #[key]
    resource_type: u8, // RessourceType: WoodType, FoodType, MineralType...
    xp: u64,
    timestamp: u64, // Unix timestamp, if 0 then the mining is not active
    subresource_type: u8,
    rcs: u64,
}
