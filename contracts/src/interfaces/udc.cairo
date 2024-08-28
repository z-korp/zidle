const UDC_ADDRESS: felt252 = 0x41a78e741e5af2fec34b695679bc6891742439f7afb8484ecd7766661ad02bf;

pub trait IUniversalDeployer {
    fn deployContract(
        class_hash: ClassHash, salt: felt252, unique: bool, calldata: Span<felt252>
    ) -> ContractAddress;
}
