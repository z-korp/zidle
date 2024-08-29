use starknet::ContractAddress;
use core::Zeroable;

///
/// Model
///

#[dojo::model]
#[derive(Copy, Drop, Serde)]
struct ERC721WalletModel {
    #[key]
    token: ContractAddress,
    #[key]
    token_id: u128,
    address: ContractAddress,
}

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
mod erc721_wallet_component {
    use super::ERC721WalletModel;
    use super::IERC721Wallet;
    use super::IERC721WalletCamel;

    use starknet::ContractAddress;
    use starknet::{get_contract_address, get_caller_address};
    use dojo::world::{
        IWorldProvider, IWorldProviderDispatcher, IWorldDispatcher, IWorldDispatcherTrait
    };

    #[storage]
    struct Storage {}

    #[embeddable_as(ERC721WalletImpl)]
    impl ERC721Wallet<
        TContractState,
        +HasComponent<TContractState>,
        +IWorldProvider<TContractState>,
        +Drop<TContractState>,
    > of IERC721Wallet<ComponentState<TContractState>> {
        fn wallet_of(self: @ComponentState<TContractState>, token_id: u256) -> ContractAddress {
            self.get_wallet(token_id).address
        }
    }

    #[embeddable_as(ERC721WalletCamelImpl)]
    impl ERC721WalletCamel<
        TContractState,
        +HasComponent<TContractState>,
        +IWorldProvider<TContractState>,
        +Drop<TContractState>,
    > of IERC721WalletCamel<ComponentState<TContractState>> {
        fn walletOf(self: @ComponentState<TContractState>, token_id: u256) -> ContractAddress {
            self.get_wallet(token_id).address
        }
    }


    #[generate_trait]
    impl InternalImpl<
        TContractState,
        +HasComponent<TContractState>,
        +IWorldProvider<TContractState>,
        +Drop<TContractState>,
    > of InternalTrait<TContractState> {
        fn get_wallet(self: @ComponentState<TContractState>, token_id: u256) -> ERC721WalletModel {
            get!(
                self.get_contract().world(),
                (get_contract_address(), token_id.low),
                (ERC721WalletModel)
            )
        }

        fn set_wallet(
            ref self: ComponentState<TContractState>, token_id: u256, address: ContractAddress
        ) {
            set!(
                self.get_contract().world(),
                ERC721WalletModel { token: get_contract_address(), token_id: token_id.low, address }
            );
        }

        fn exists(self: @ComponentState<TContractState>, token_id: u256) -> bool {
            let wallet = self.get_wallet(token_id).address;
            wallet != core::Zeroable::zero()
        }
    }
}
