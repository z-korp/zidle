use starknet::{ClassHash, ContractAddress, contract_address_const};
use core::array::{ArrayTrait, SpanTrait};
use starknet::class_hash::class_hash_const;

#[starknet::interface]
trait IUniversalDeployer<TContractState> {
    fn deployContract(
        ref self: TContractState,
        class_hash: ClassHash,
        salt: felt252,
        unique: bool,
        calldata: Span<felt252>
    ) -> ContractAddress;
}

const UDC_ADDRESS: felt252 = 0x041a78e741e5af2fec34b695679bc6891742439f7afb8484ecd7766661ad02bf;

fn deploy_account(
    nft_contract: ContractAddress,
    token_id: u256,
    initial_owner: ContractAddress,
    owner_pubk: felt252
) -> ContractAddress {
    let dispatcher = IUniversalDeployerDispatcher {
        contract_address: contract_address_const::<UDC_ADDRESS>()
    };

    // deployment parameters
    let class_hash = class_hash_const::<
        0x0252070d7c5b42ade09beba0f79bad510433f1451f5dcffa7a79338cfea52cb9
    >();
    let salt = 1234567879;
    let unique = false;

    // Prepare constructor calldata
    let mut calldata = ArrayTrait::new();
    calldata.append(nft_contract.into());
    calldata.append(token_id.low.into());
    calldata.append(token_id.high.into());
    calldata.append(initial_owner.into());
    calldata.append(owner_pubk.into());

    // Deploy the contract and return the address
    dispatcher.deployContract(class_hash, salt, unique, calldata.span())
}
