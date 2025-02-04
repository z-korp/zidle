// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts for Cairo ^0.20.0

use starknet::ContractAddress;

use openzeppelin_token::erc721::interface::{IERC721Dispatcher, IERC721DispatcherTrait};

const PAUSER_ROLE: felt252 = selector!("PAUSER_ROLE");
const MINTER_ROLE: felt252 = selector!("MINTER_ROLE");
const UPGRADER_ROLE: felt252 = selector!("UPGRADER_ROLE");

#[starknet::interface]
trait IERC721MinterRole<TState> {
    fn update_minter_role(self: @TState, new_minter: ContractAddress);
}

#[starknet::contract]
mod ERC721 {
    use zidle::tests::mocks::components::erc721_wallet::{Erc721WalletComponent};

    use core::num::traits::Zero;
    use openzeppelin::access::accesscontrol::{AccessControlComponent, DEFAULT_ADMIN_ROLE};
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::security::pausable::PausableComponent;
    use openzeppelin::token::erc721::ERC721Component;
    use openzeppelin::token::erc721::extensions::ERC721EnumerableComponent;
    use openzeppelin::token::erc721::interface::{IERC721Metadata, IERC721MetadataCamelOnly};
    use openzeppelin::upgrades::interface::IUpgradeable;
    use openzeppelin::upgrades::UpgradeableComponent;
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess,};
    use starknet::{ClassHash, ContractAddress, get_caller_address, get_contract_address};
    use super::{MINTER_ROLE, PAUSER_ROLE, UPGRADER_ROLE};

    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);
    component!(path: PausableComponent, storage: pausable, event: PausableEvent);
    component!(path: AccessControlComponent, storage: accesscontrol, event: AccessControlEvent);
    component!(
        path: ERC721EnumerableComponent, storage: erc721_enumerable, event: ERC721EnumerableEvent
    );
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);
    component!(path: Erc721WalletComponent, storage: erc721_wallet, event: ERC721WalletEvent);

    // External
    #[abi(embed_v0)]
    impl ERC721Impl = ERC721Component::ERC721Impl<ContractState>;
    #[abi(embed_v0)]
    impl ERC721EnumerableImpl =
        ERC721EnumerableComponent::ERC721EnumerableImpl<ContractState>;
    #[abi(embed_v0)]
    impl ERC721CamelOnlyImpl = ERC721Component::ERC721CamelOnlyImpl<ContractState>;
    #[abi(embed_v0)]
    impl PausableImpl = PausableComponent::PausableImpl<ContractState>;
    #[abi(embed_v0)]
    impl AccessControlImpl =
        AccessControlComponent::AccessControlImpl<ContractState>;
    #[abi(embed_v0)]
    impl AccessControlCamelImpl =
        AccessControlComponent::AccessControlCamelImpl<ContractState>;
    #[abi(embed_v0)]
    impl ERC721WalletImpl = Erc721WalletComponent::ERC721WalletImpl<ContractState>;

    // Internal
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;
    impl PausableInternalImpl = PausableComponent::InternalImpl<ContractState>;
    impl AccessControlInternalImpl = AccessControlComponent::InternalImpl<ContractState>;
    impl ERC721EnumerableInternalImpl = ERC721EnumerableComponent::InternalImpl<ContractState>;
    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;
    impl ERC721WalletInternalImpl = Erc721WalletComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        #[substorage(v0)]
        pausable: PausableComponent::Storage,
        #[substorage(v0)]
        accesscontrol: AccessControlComponent::Storage,
        #[substorage(v0)]
        erc721_enumerable: ERC721EnumerableComponent::Storage,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,
        #[substorage(v0)]
        erc721_wallet: Erc721WalletComponent::Storage,
        constant_token_uri: ByteArray,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC721Event: ERC721Component::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
        #[flat]
        PausableEvent: PausableComponent::Event,
        #[flat]
        AccessControlEvent: AccessControlComponent::Event,
        #[flat]
        ERC721EnumerableEvent: ERC721EnumerableComponent::Event,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
        #[flat]
        ERC721WalletEvent: Erc721WalletComponent::Event,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        default_admin: ContractAddress,
        pauser: ContractAddress,
        minter: ContractAddress,
        upgrader: ContractAddress,
    ) {
        let constant_uri = "ipfs://QmZf1uNuPPAcTqxXGBdcTjBnviPTftypxxUwMSgAGC1HDC/metadata.json";
        self.constant_token_uri.write(constant_uri);

        self.erc721.initializer("zIdle Character", "ZIC", self.constant_token_uri.read());
        self.accesscontrol.initializer();
        self.erc721_enumerable.initializer();

        self.accesscontrol._grant_role(DEFAULT_ADMIN_ROLE, default_admin);
        self.accesscontrol._grant_role(PAUSER_ROLE, pauser);
        self.accesscontrol._grant_role(MINTER_ROLE, minter);
        self.accesscontrol._grant_role(UPGRADER_ROLE, upgrader);
    }

    impl ERC721HooksImpl of ERC721Component::ERC721HooksTrait<ContractState> {
        fn before_update(
            ref self: ERC721Component::ComponentState<ContractState>,
            to: ContractAddress,
            token_id: u256,
            auth: ContractAddress,
        ) {
            let mut contract_state = self.get_contract_mut();
            contract_state.pausable.assert_not_paused();
            contract_state.erc721_enumerable.before_update(to, token_id);
        }
    }

    #[generate_trait]
    #[abi(per_item)]
    impl ExternalImpl of ExternalTrait {
        #[external(v0)]
        fn pause(ref self: ContractState) {
            self.accesscontrol.assert_only_role(PAUSER_ROLE);
            self.pausable.pause();
        }

        #[external(v0)]
        fn unpause(ref self: ContractState) {
            self.accesscontrol.assert_only_role(PAUSER_ROLE);
            self.pausable.unpause();
        }

        #[external(v0)]
        fn burn(ref self: ContractState, token_id: u256) {
            self.erc721.update(Zero::zero(), token_id, get_caller_address());
        }

        #[external(v0)]
        fn mint(ref self: ContractState, recipient: ContractAddress, token_id: u256,) {
            self.accesscontrol.assert_only_role(MINTER_ROLE);
            self.erc721.mint(recipient, token_id);

            // Get the owner public key
            // let account = iaccount(recipient);
            // let pubk = account.get_public_key();

            // Deploy an account contract for this NFT
            // let account_address = account_deployer::deploy_account(
            //    get_contract_address(), token_id, recipient, pubk
            //);
            self.erc721_wallet.set_wallet(token_id, recipient); //account_address);
        }

        #[external(v0)]
        fn update_minter_role(ref self: ContractState, new_minter: ContractAddress) {
            self.accesscontrol.assert_only_role(DEFAULT_ADMIN_ROLE);
            self.accesscontrol._grant_role(MINTER_ROLE, new_minter);
        }
    }

    //
    // Upgradeable
    //

    #[abi(embed_v0)]
    impl UpgradeableImpl of IUpgradeable<ContractState> {
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            self.accesscontrol.assert_only_role(UPGRADER_ROLE);
            self.upgradeable.upgrade(new_class_hash);
        }
    }

    //
    // Metadata
    //

    #[abi(embed_v0)]
    impl ERC721MetadataImpl of IERC721Metadata<ContractState> {
        fn name(self: @ContractState) -> ByteArray {
            self.erc721.ERC721_name.read()
        }

        fn symbol(self: @ContractState) -> ByteArray {
            self.erc721.ERC721_symbol.read()
        }

        fn token_uri(self: @ContractState, token_id: u256) -> ByteArray {
            self.erc721.exists(token_id);
            self.constant_token_uri.read()
        }
    }

    #[abi(embed_v0)]
    impl ERC721MetadataCamelOnlyImpl of IERC721MetadataCamelOnly<ContractState> {
        fn tokenURI(self: @ContractState, tokenId: u256) -> ByteArray {
            self.token_uri(tokenId)
        }
    }
}
