use starknet::ContractAddress;
use core::Zeroable;

#[starknet::interface]
trait IAccount<TState> {
    fn get_public_key(self: @TState) -> felt252;
}

#[inline(always)]
fn iaccount(contract_address: ContractAddress) -> IAccountDispatcher {
    assert(contract_address != core::Zeroable::zero(), 'iaccount(): null address');
    (IAccountDispatcher { contract_address })
}
