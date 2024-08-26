use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct TokenConfig {
    #[key]
    token_address: ContractAddress,
    max_supply: u64,
    minted_count: u64,
    max_per_wallet: u64,
    is_open: bool,
}
