use starknet::ContractAddress;

#[starknet::interface]
pub trait IAccount<TState> {
    fn get_public_key(self: @TState) -> felt252;
}

#[inline(always)]
pub fn iaccount(contract_address: ContractAddress) -> IAccountDispatcher {
    assert(
        contract_address != (starknet::contract_address_const::<0x0>()), 'iaccount(): null address'
    );
    (IAccountDispatcher { contract_address })
}
