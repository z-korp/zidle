use core::array::{ArrayTrait, SpanTrait};
use starknet::account::Call;
use starknet::ContractAddress;

pub mod SUPPORTED_TX_VERSION {
    pub const DEPLOY_ACCOUNT: felt252 = 1;
    pub const DECLARE: felt252 = 2;
    pub const INVOKE: felt252 = 1;
}

#[starknet::interface]
pub trait IAccount<TState> {
    fn get_token_id(self: @TState) -> u256;
    fn get_nft_owner(self: @TState) -> ContractAddress;
    fn get_nft_contract(self: @TState) -> ContractAddress;
    fn is_valid_signature(self: @TState, hash: felt252, signature: Array<felt252>) -> felt252;
    fn supports_interface(self: @TState, interface_id: felt252) -> bool;
}

#[starknet::interface]
pub trait IProtocol<TState> {
    fn __execute__(ref self: TState, calls: Array<Call>) -> Array<Span<felt252>>;
    fn __validate__(self: @TState, calls: Array<Call>) -> felt252;
    fn __validate_declare__(self: @TState, class_hash: felt252) -> felt252;
    fn __validate_deploy__(
        self: @TState,
        class_hash: felt252,
        salt: felt252,
        nft_contract: ContractAddress,
        token_id: u256
    ) -> felt252;
}

// Entry points case-convention is enforced by the protocol
#[starknet::interface]
trait AccountCamel<TState> {
    fn __execute__(self: @TState, calls: Array<Call>) -> Array<Span<felt252>>;
    fn __validate__(self: @TState, calls: Array<Call>) -> felt252;
    fn __validate_declare__(self: @TState, classHash: felt252) -> felt252;
    fn __validate_deploy__(
        self: @TState,
        classHash: felt252,
        contractAddressSalt: felt252,
        nftContract: ContractAddress,
        tokenId: u256
    ) -> felt252;
    fn setNFTDetails(ref self: TState, newNFTContract: ContractAddress, newTokenId: u256);
    fn getNFTContract(self: @TState) -> ContractAddress;
    fn getTokenId(self: @TState) -> u256;
    fn isValidSignature(self: @TState, hash: felt252, signature: Array<felt252>) -> felt252;
    fn supportsInterface(self: @TState, interfaceId: felt252) -> bool;
}

#[starknet::interface]
pub trait INFT<TState> {
    fn owner_of(self: @TState, token_id: u256) -> ContractAddress;
}
