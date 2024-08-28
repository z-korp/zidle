use starknet::ContractAddress;

///
/// Model
///

#[dojo::model]
#[derive(Copy, Drop, Serde)]
struct ERC721BalanceWalletModel {
    #[key]
    token: ContractAddress,
    #[key]
    account: ContractAddress,
    amount: u128,
}

///
/// Interface
///

#[starknet::interface]
trait IERC721BalanceWallet<TState> {
    fn balance_of(self: @TState, account: ContractAddress) -> u256;
    fn transfer_from(ref self: TState, from: ContractAddress, to: ContractAddress, token_id: u256);
    fn safe_transfer_from(
        ref self: TState,
        from: ContractAddress,
        to: ContractAddress,
        token_id: u256,
        data: Span<felt252>
    );
}

#[starknet::interface]
trait IERC721BalanceWalletCamel<TState> {
    fn balanceOf(self: @TState, account: ContractAddress) -> u256;
    fn transferFrom(ref self: TState, from: ContractAddress, to: ContractAddress, tokenId: u256);
    fn safeTransferFrom(
        ref self: TState,
        from: ContractAddress,
        to: ContractAddress,
        tokenId: u256,
        data: Span<felt252>
    );
}

///
/// ERC721BalanceWallet Component
///
#[starknet::component]
mod erc721_balance_wallet_component {
    use core::Zeroable;
    use super::ERC721BalanceWalletModel;
    use super::IERC721BalanceWallet;
    use super::IERC721BalanceWalletCamel;

    use starknet::ContractAddress;
    use starknet::{get_contract_address, get_caller_address};
    use dojo::world::{
        IWorldProvider, IWorldProviderDispatcher, IWorldDispatcher, IWorldDispatcherTrait
    };
    use origami_token::components::introspection::src5::{
        ISRC5Dispatcher, ISRC5DispatcherTrait, src5_component, src5_component::SRC5,
    };
    use origami_token::components::token::erc721::erc721_approval::erc721_approval_component as erc721_approval_comp;
    use origami_token::components::token::erc721::erc721_owner::erc721_owner_component as erc721_owner_comp;
    use origami_token::components::token::erc721::erc721_enumerable::erc721_enumerable_component as erc721_enumerable_comp;
    use origami_token::components::token::erc721::interface::{
        IERC721ReceiverDispatcher, IERC721ReceiverDispatcherTrait, IERC721_RECEIVER_ID,
        IERC721_ENUMERABLE_ID,
    };
    use erc721_approval_comp::InternalImpl as ERC721ApprovalInternal;
    use erc721_owner_comp::InternalImpl as ERC721OwnerInternal;
    use erc721_enumerable_comp::InternalImpl as ERC721EnumerableInternal;

    use zidle::components::erc721::erc721_wallet::erc721_wallet_component as erc721_wallet_comp;
    use erc721_wallet_comp::ERC721Wallet;


    #[storage]
    struct Storage {}

    #[event]
    #[derive(Copy, Drop, Serde, starknet::Event)]
    enum Event {
        Transfer: Transfer
    }

    #[derive(Copy, Drop, Serde, starknet::Event)]
    struct Transfer {
        from: ContractAddress,
        to: ContractAddress,
        token_id: u256
    }

    mod Errors {
        const INVALID_ACCOUNT: felt252 = 'ERC721: invalid account';
        const UNAUTHORIZED: felt252 = 'ERC721: unauthorized caller';
        const INVALID_RECEIVER: felt252 = 'ERC721: invalid receiver';
        const WRONG_SENDER: felt252 = 'ERC721: wrong sender';
        const SAFE_TRANSFER_FAILED: felt252 = 'ERC721: safe transfer failed';
    }

    #[embeddable_as(ERC721BalanceWalletImpl)]
    impl ERC721BalanceWallet<
        TContractState,
        +HasComponent<TContractState>,
        +IWorldProvider<TContractState>,
        impl ERC721Approval: erc721_approval_comp::HasComponent<TContractState>,
        impl ERC721Owner: erc721_owner_comp::HasComponent<TContractState>,
        impl ERC721Enumerable: erc721_enumerable_comp::HasComponent<TContractState>,
        impl SRC5: src5_component::HasComponent<TContractState>,
        impl ERC721Wallet: erc721_wallet_comp::HasComponent<TContractState>,
        +Drop<TContractState>
    > of IERC721BalanceWallet<ComponentState<TContractState>> {
        fn balance_of(self: @ComponentState<TContractState>, account: ContractAddress) -> u256 {
            assert(account.is_non_zero(), Errors::INVALID_ACCOUNT);
            self.get_balance(account).amount.into()
        }

        fn transfer_from(
            ref self: ComponentState<TContractState>,
            from: ContractAddress,
            to: ContractAddress,
            token_id: u256
        ) {
            let mut erc721_approval = get_dep_component_mut!(ref self, ERC721Approval);
            assert(
                erc721_approval.is_approved_or_owner(get_caller_address(), token_id),
                Errors::UNAUTHORIZED
            );
            assert(!to.is_zero(), Errors::INVALID_RECEIVER);
            self.transfer_internal(from, to, token_id)
        }

        fn safe_transfer_from(
            ref self: ComponentState<TContractState>,
            from: ContractAddress,
            to: ContractAddress,
            token_id: u256,
            data: Span<felt252>
        ) {
            let mut erc721_approval = get_dep_component_mut!(ref self, ERC721Approval);
            assert(
                erc721_approval.is_approved_or_owner(get_caller_address(), token_id),
                Errors::UNAUTHORIZED
            );
            assert(!to.is_zero(), Errors::INVALID_RECEIVER);
            self.safe_transfer_internal(from, to, token_id, data);
        }
    }

    #[embeddable_as(ERC721BalanceWalletCamelImpl)]
    impl ERC721BalanceWalletCamel<
        TContractState,
        +HasComponent<TContractState>,
        +IWorldProvider<TContractState>,
        impl ERC721Approval: erc721_approval_comp::HasComponent<TContractState>,
        impl ERC721Owner: erc721_owner_comp::HasComponent<TContractState>,
        impl ERC721Enumerable: erc721_enumerable_comp::HasComponent<TContractState>,
        impl SRC5: src5_component::HasComponent<TContractState>,
        impl ERC721Wallet: erc721_wallet_comp::HasComponent<TContractState>,
        +Drop<TContractState>
    > of IERC721BalanceWalletCamel<ComponentState<TContractState>> {
        fn balanceOf(self: @ComponentState<TContractState>, account: ContractAddress) -> u256 {
            self.balance_of(account)
        }

        fn transferFrom(
            ref self: ComponentState<TContractState>,
            from: ContractAddress,
            to: ContractAddress,
            tokenId: u256
        ) {
            self.transfer_from(from, to, tokenId)
        }
        fn safeTransferFrom(
            ref self: ComponentState<TContractState>,
            from: ContractAddress,
            to: ContractAddress,
            tokenId: u256,
            data: Span<felt252>
        ) {
            self.safe_transfer_from(from, to, tokenId, data)
        }
    }


    #[generate_trait]
    impl InternalImpl<
        TContractState,
        +HasComponent<TContractState>,
        +IWorldProvider<TContractState>,
        impl ERC721Approval: erc721_approval_comp::HasComponent<TContractState>,
        impl ERC721Owner: erc721_owner_comp::HasComponent<TContractState>,
        impl ERC721Enumerable: erc721_enumerable_comp::HasComponent<TContractState>,
        impl SRC5: src5_component::HasComponent<TContractState>,
        impl ERC721Wallet: erc721_wallet_comp::HasComponent<TContractState>,
        +Drop<TContractState>
    > of InternalTrait<TContractState> {
        fn get_balance(
            self: @ComponentState<TContractState>, account: ContractAddress
        ) -> ERC721BalanceWalletModel {
            get!(
                self.get_contract().world(),
                (get_contract_address(), account),
                (ERC721BalanceWalletModel)
            )
        }

        fn set_balance(
            ref self: ComponentState<TContractState>, account: ContractAddress, amount: u256
        ) {
            set!(
                self.get_contract().world(),
                ERC721BalanceWalletModel {
                    token: get_contract_address(), account, amount: amount.low
                }
            );
        }

        fn transfer_internal(
            ref self: ComponentState<TContractState>,
            from: ContractAddress,
            to: ContractAddress,
            token_id: u256
        ) {
            let mut erc721_approval = get_dep_component_mut!(ref self, ERC721Approval);
            let mut erc721_owner = get_dep_component_mut!(ref self, ERC721Owner);
            let mut erc721_wallet = get_dep_component_mut!(ref self, ERC721Wallet);

            // not minting, reduce balance
            if (from != Zeroable::zero()) {
                let owner = erc721_owner.get_owner(token_id).address;
                assert(from == owner, Errors::WRONG_SENDER);

                // Implicit clear approvals, no need to emit an event
                erc721_approval.set_token_approval(owner, Zeroable::zero(), token_id, false);

                self.set_balance(from, self.get_balance(from).amount.into() - 1);
            }

            // not burning, increase balance
            if (to != Zeroable::zero()) {
                self.set_balance(to, self.get_balance(to).amount.into() + 1);
            }

            erc721_owner.set_owner(token_id, to);

            let src5 = get_dep_component!(@self, SRC5);
            if src5.supports_interface(IERC721_ENUMERABLE_ID) {
                let mut erc721_enumerable = get_dep_component_mut!(ref self, ERC721Enumerable);
                erc721_enumerable.after_transfer(from, to, token_id);
            }

            let transfer_event = Transfer { from, to, token_id };

            self.emit(transfer_event.clone());
            emit!(self.get_contract().world(), (Event::Transfer(transfer_event)));

            // Update wallet
            erc721_wallet.set_wallet(token_id, to);
        }

        fn safe_transfer_internal(
            ref self: ComponentState<TContractState>,
            from: ContractAddress,
            to: ContractAddress,
            token_id: u256,
            data: Span<felt252>
        ) {
            self.transfer_internal(from, to, token_id);
            assert(
                self.check_on_erc721_received(from, to, token_id, data),
                Errors::SAFE_TRANSFER_FAILED
            );
        }

        fn check_on_erc721_received(
            ref self: ComponentState<TContractState>,
            from: ContractAddress,
            to: ContractAddress,
            token_id: u256,
            data: Span<felt252>
        ) -> bool {
            let src5_dispatcher = ISRC5Dispatcher { contract_address: to };
            if src5_dispatcher.supports_interface(IERC721_RECEIVER_ID) {
                let erc721_dispatcher = IERC721ReceiverDispatcher { contract_address: to };
                erc721_dispatcher
                    .on_erc721_received(
                        get_caller_address(), from, token_id, data
                    ) == IERC721_RECEIVER_ID
            } else {
                false
            }
        }
    }
}
