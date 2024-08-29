use starknet::ContractAddress;

#[starknet::contract]
mod account {
    use core::num::traits::Zero;
    use account::account::interface::{
        IAccount, INFT, INFTDispatcher, INFTDispatcherTrait, SUPPORTED_TX_VERSION
    };
    use starknet::account::Call;
    use starknet::{ContractAddress, get_caller_address, get_tx_info, VALIDATED};
    use starknet::syscalls::call_contract_syscall;
    use core::array::{ArrayTrait, SpanTrait};
    use core::ecdsa::check_ecdsa_signature;

    const SIMULATE_TX_VERSION_OFFSET: felt252 = 340282366920938463463374607431768211456; // 2**128
    const SRC6_TRAIT_ID: felt252 =
        1270010605630597976495846281167968799381097569185364931397797212080166453709; // hash of SNIP-6 trait

    #[storage]
    struct Storage {
        nft_contract: ContractAddress,
        token_id: u256,
        nft_owner: ContractAddress,
        nft_owner_pub_key: felt252,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        nft_contract: ContractAddress,
        token_id: u256,
        initial_owner: ContractAddress,
        nft_owner_pub_key: felt252
    ) {
        self.nft_contract.write(nft_contract);
        self.token_id.write(token_id);
        self.nft_owner.write(initial_owner);
        self.nft_owner_pub_key.write(nft_owner_pub_key);
        println!("Account contract deployed: pubk={}", nft_owner_pub_key);
    }

    #[external(v0)]
    impl AccountImpl of IAccount<ContractState> {
        fn is_valid_signature(
            self: @ContractState, hash: felt252, signature: Array<felt252>
        ) -> felt252 {
            let is_valid = self.is_valid_signature_bool(hash, signature.span());
            if is_valid {
                VALIDATED
            } else {
                0
            }
        }

        fn supports_interface(self: @ContractState, interface_id: felt252) -> bool {
            interface_id == SRC6_TRAIT_ID
        }

        fn get_nft_contract(self: @ContractState) -> ContractAddress {
            self.nft_contract.read()
        }

        fn get_token_id(self: @ContractState) -> u256 {
            self.token_id.read()
        }

        fn get_nft_owner(self: @ContractState) -> ContractAddress {
            self.nft_owner.read()
        }
    }

    #[external(v0)]
    #[generate_trait]
    impl ProtocolImpl of ProtocolTrait {
        fn __execute__(ref self: ContractState, calls: Array<Call>) -> Array<Span<felt252>> {
            self.only_protocol();
            self.only_supported_tx_version(SUPPORTED_TX_VERSION::INVOKE);
            //self.only_nft_owner();
            self.execute_multiple_calls(calls)
        }

        fn __validate__(self: @ContractState, calls: Array<Call>) -> felt252 {
            self.only_protocol();
            self.only_supported_tx_version(SUPPORTED_TX_VERSION::INVOKE);
            self.validate_transaction()
        }

        fn __validate_declare__(self: @ContractState, class_hash: felt252) -> felt252 {
            self.only_protocol();
            self.only_supported_tx_version(SUPPORTED_TX_VERSION::DECLARE);
            self.validate_transaction()
        }

        fn __validate_deploy__(
            self: @ContractState,
            class_hash: felt252,
            salt: felt252,
            nft_contract: ContractAddress,
            token_id: u256,
            initial_owner: ContractAddress
        ) -> felt252 {
            self.only_protocol();
            self.only_supported_tx_version(SUPPORTED_TX_VERSION::DEPLOY_ACCOUNT);
            self.validate_transaction()
        }

        fn set_nft_data(ref self: ContractState, new_token_id: u256, new_owner: ContractAddress) {
            self.only_nft_contract();
            self.token_id.write(new_token_id);
            self.nft_owner.write(new_owner);
        }
    }

    #[generate_trait]
    impl PrivateImpl of PrivateTrait {
        fn only_protocol(self: @ContractState) {
            let sender = get_caller_address();
            assert(sender.is_zero(), 'Account: invalid caller');
        }

        fn only_nft_contract(self: @ContractState) {
            let caller = get_caller_address();
            let nft_contract = self.nft_contract.read();
            assert(caller == nft_contract, 'Only NFT contract can call');
        }

        fn only_nft_owner(self: @ContractState) {
            let caller = get_caller_address();
            let owner = self.nft_owner.read();
            assert(caller == owner, 'Caller is not NFT owner');
        }

        fn is_valid_signature_bool(
            self: @ContractState, hash: felt252, signature: Span<felt252>
        ) -> bool {
            let is_valid_length = signature.len() == 2_u32;

            if !is_valid_length {
                return false;
            }

            let pubkey = self.nft_owner_pub_key.read();

            check_ecdsa_signature(hash, pubkey, *signature.at(0_u32), *signature.at(1_u32))
        }

        fn validate_transaction(self: @ContractState) -> felt252 {
            let tx_info = get_tx_info().unbox();
            let tx_hash = tx_info.transaction_hash;
            let signature = tx_info.signature;

            let is_valid = self.is_valid_signature_bool(tx_hash, signature);
            assert(is_valid, 'Account: Incorrect tx signature');
            VALIDATED
        }

        fn execute_single_call(self: @ContractState, call: Call) -> Span<felt252> {
            let Call { to, selector, calldata } = call;
            call_contract_syscall(to, selector, calldata).unwrap()
        }

        fn execute_multiple_calls(
            self: @ContractState, mut calls: Array<Call>
        ) -> Array<Span<felt252>> {
            let mut res = ArrayTrait::new();
            loop {
                match calls.pop_front() {
                    Option::Some(call) => {
                        let _res = self.execute_single_call(call);
                        res.append(_res);
                    },
                    Option::None(_) => { break (); },
                };
            };
            res
        }

        fn only_supported_tx_version(self: @ContractState, supported_tx_version: felt252) {
            let tx_info = get_tx_info().unbox();
            let version = tx_info.version;
            assert(
                version == supported_tx_version || version == SIMULATE_TX_VERSION_OFFSET
                    + supported_tx_version,
                'Account: Unsupported tx version'
            );
        }
    }
}
