use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct TokenConfig {
    #[key]
    token_address: ContractAddress,
    max_supply: u256,
    minted_count: u256,
    max_per_wallet: u256,
    is_open: bool,
}
