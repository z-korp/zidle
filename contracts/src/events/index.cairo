use zidle::resources::interface::{ResourceType};

#[derive(Copy, Drop, Serde)]
#[dojo::event(historical: true)]
pub struct Mine {
    #[key]
    pub token_id: u128,
    pub rcs_type: u8,
    pub rcs_sub_type: u8,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event(historical: true)]
pub struct Harvest {
    #[key]
    pub token_id: u128,
    pub rcs_type: u8,
    pub rcs_sub_type: u8,
    pub amount: u64,
    pub xp: u64,
}
