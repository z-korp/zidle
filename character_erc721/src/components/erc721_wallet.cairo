use starknet::ContractAddress;

///
/// Interface
///

#[starknet::interface]
trait IERC721Wallet<TState> {
    fn wallet_of(self: @TState, token_id: u256) -> ContractAddress;
}

#[starknet::interface]
trait IERC721WalletCamel<TState> {
    fn walletOf(self: @TState, token_id: u256) -> ContractAddress;
}

///
/// ERC721Wallet Component
///
#[starknet::component]
pub mod Erc721WalletComponent {
    use super::IERC721Wallet;
    use super::IERC721WalletCamel;

    use core::num::traits::Zero;
    use starknet::ContractAddress;
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess,};

    #[storage]
    pub struct Storage {
        wallets: Map<u256, ContractAddress>,
    }

    #[embeddable_as(ERC721WalletImpl)]
    impl ERC721Wallet<
        TContractState, +HasComponent<TContractState>, +Drop<TContractState>,
    > of IERC721Wallet<ComponentState<TContractState>> {
        fn wallet_of(self: @ComponentState<TContractState>, token_id: u256) -> ContractAddress {
            self.get_wallet(token_id)
        }
    }

    #[embeddable_as(ERC721WalletCamelImpl)]
    impl ERC721WalletCamel<
        TContractState, +HasComponent<TContractState>, +Drop<TContractState>,
    > of IERC721WalletCamel<ComponentState<TContractState>> {
        fn walletOf(self: @ComponentState<TContractState>, token_id: u256) -> ContractAddress {
            self.get_wallet(token_id)
        }
    }

    #[generate_trait]
    pub impl InternalImpl<
        TContractState, +HasComponent<TContractState>, +Drop<TContractState>,
    > of InternalTrait<TContractState> {
        fn get_wallet(self: @ComponentState<TContractState>, token_id: u256) -> ContractAddress {
            self.wallets.read(token_id)
        }

        fn set_wallet(
            ref self: ComponentState<TContractState>, token_id: u256, address: ContractAddress
        ) {
            self.wallets.write(token_id, address);
        }

        fn exists(self: @ComponentState<TContractState>, token_id: u256) -> bool {
            let wallet = self.wallets.read(token_id);
            wallet.is_zero()
        }
    }
}
