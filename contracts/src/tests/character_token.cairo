use starknet::{ContractAddress, get_contract_address, get_caller_address, testing};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use dojo::utils::test::spawn_test_world;

use origami_token::tests::utils;
use origami_token::tests::constants::{ZERO, OWNER, SPENDER, RECIPIENT};
use origami_token::components::security::initializable::{initializable_model};
use origami_token::components::introspection::src5::{src_5_model, SRC5Model};
use origami_token::components::introspection::src5::src5_component::{SRC5Impl};
use origami_token::components::token::erc721::interface::{IERC721_ID, IERC721_METADATA_ID,};
use origami_token::components::token::erc721::{
    erc721_approval::{erc_721_token_approval_model}, erc721_metadata::{erc_721_meta_model},
    erc721_balance::{erc_721_balance_model}, erc721_owner::{erc_721_owner_model},
    erc721_enumerable::{erc_721_enumerable_index_model},
    erc721_enumerable::{erc_721_enumerable_owner_index_model},
    erc721_enumerable::{erc_721_enumerable_owner_token_model},
    erc721_enumerable::{erc_721_enumerable_token_model},
    erc721_enumerable::{erc_721_enumerable_total_model},
    erc721_approval::{erc_721_operator_approval_model},
};
use origami_token::components::token::erc721::erc721_approval::erc721_approval_component::{
    Approval, ApprovalForAll, ERC721ApprovalImpl, InternalImpl as ERC721ApprovalInternalImpl
};
use origami_token::components::token::erc721::erc721_balance::erc721_balance_component::{
    Transfer, ERC721BalanceImpl, InternalImpl as ERC721BalanceInternalImpl
};
use origami_token::components::token::erc721::erc721_mintable::erc721_mintable_component::InternalImpl as ERC721MintableInternalImpl;
use origami_token::components::token::erc721::erc721_burnable::erc721_burnable_component::InternalImpl as ERC721BurnableInternalImpl;

// Internal imports

use zidle::systems::character_token::{
    character_token, ICharacterTokenDispatcher, ICharacterTokenDispatcherTrait,
};
use zidle::systems::character_minter::{
    character_minter, ICharacterMinterDispatcher, ICharacterMinterDispatcherTrait,
};

use zidle::models::char::{char};
use zidle::models::miner::{miner};
use zidle::models::player::{player};
use zidle::models::token_config::{token_config};

use zidle::interfaces::systems::{SELECTORS};

//
// events helpers
//

fn assert_event_transfer(
    emitter: ContractAddress, from: ContractAddress, to: ContractAddress, token_id: u256
) {
    let event = utils::pop_log::<Transfer>(emitter).unwrap();
    assert(event.from == from, 'Invalid `from`');
    assert(event.to == to, 'Invalid `to`');
    assert(event.token_id == token_id, 'Invalid `token_id`');
}

fn assert_only_event_transfer(
    emitter: ContractAddress, from: ContractAddress, to: ContractAddress, token_id: u256
) {
    assert_event_transfer(emitter, from, to, token_id);
    utils::assert_no_events_left(emitter);
}

fn assert_event_approval(
    emitter: ContractAddress, owner: ContractAddress, spender: ContractAddress, token_id: u256
) {
    let event = utils::pop_log::<Approval>(emitter).unwrap();
    assert(event.owner == owner, 'Invalid `owner`');
    assert(event.spender == spender, 'Invalid `spender`');
    assert(event.token_id == token_id, 'Invalid `token_id`');
}

fn assert_only_event_approval(
    emitter: ContractAddress, owner: ContractAddress, spender: ContractAddress, token_id: u256
) {
    assert_event_approval(emitter, owner, spender, token_id);
    utils::assert_no_events_left(emitter);
}


//
// Setup
//

const TOKEN_ID: u256 = 1;
const TOKEN_ID_2: u256 = 2;
const TOKEN_ID_3: u256 = 3;
const TOKEN_ID_4: u256 = 4;
const TOKEN_ID_5: u256 = 5;

fn setup_uninitialized() -> (
    IWorldDispatcher, ICharacterTokenDispatcher, ICharacterMinterDispatcher
) {
    testing::set_block_number(1);
    testing::set_block_timestamp(1);
    let mut world = spawn_test_world(
        ["origami_token", "zidle"].span(),
        array![
            initializable_model::TEST_CLASS_HASH,
            src_5_model::TEST_CLASS_HASH,
            erc_721_token_approval_model::TEST_CLASS_HASH,
            erc_721_balance_model::TEST_CLASS_HASH,
            erc_721_meta_model::TEST_CLASS_HASH,
            erc_721_owner_model::TEST_CLASS_HASH,
            erc_721_enumerable_index_model::TEST_CLASS_HASH,
            erc_721_enumerable_owner_index_model::TEST_CLASS_HASH,
            erc_721_enumerable_owner_token_model::TEST_CLASS_HASH,
            erc_721_enumerable_token_model::TEST_CLASS_HASH,
            erc_721_enumerable_total_model::TEST_CLASS_HASH,
            erc_721_operator_approval_model::TEST_CLASS_HASH,
            // zidle
            char::TEST_CLASS_HASH,
            miner::TEST_CLASS_HASH,
            player::TEST_CLASS_HASH,
            token_config::TEST_CLASS_HASH,
        ]
            .span()
    );

    let mut token = ICharacterTokenDispatcher {
        contract_address: world
            .deploy_contract('salt', character_token::TEST_CLASS_HASH.try_into().unwrap())
    };
    world.grant_owner(dojo::utils::bytearray_hash(@"origami_token"), token.contract_address);
    world.grant_writer(selector_from_tag!("origami_token-SRC5Model"), token.contract_address);
    world
        .grant_writer(
            selector_from_tag!("origami_token-InitializableModel"), token.contract_address
        );
    world.grant_writer(selector_from_tag!("origami_token-ERC721MetaModel"), token.contract_address);
    world
        .grant_writer(
            selector_from_tag!("origami_token-ERC721TokenApprovalModel"), token.contract_address
        );
    world
        .grant_writer(
            selector_from_tag!("origami_token-ERC721BalanceModel"), token.contract_address
        );
    world
        .grant_writer(
            selector_from_tag!("origami_token-ERC721EnumerableIndexModel"), token.contract_address
        );
    world
        .grant_writer(
            selector_from_tag!("origami_token-ERC721EnumerableOwnerIndexModel"),
            token.contract_address
        );
    world
        .grant_writer(
            selector_from_tag!("origami_token-ERC721EnumerableTokenModel"), token.contract_address
        );
    world
        .grant_writer(
            selector_from_tag!("origami_token-ERC721EnumerableOwnerTokenModel"),
            token.contract_address
        );
    world
        .grant_writer(
            selector_from_tag!("origami_token-ERC721EnumerableTotalModel"), token.contract_address
        );
    world
        .grant_writer(selector_from_tag!("origami_token-ERC721OwnerModel"), token.contract_address);
    world.init_contract(SELECTORS::CHARACTER_TOKEN, [].span());

    // deploy minter
    let max_supply: u256 = 3;
    let max_per_wallet: u256 = 2;
    let minter_call_data: Array<felt252> = array![
        token.contract_address.into(),
        max_supply.low.into(),
        max_supply.high.into(),
        max_per_wallet.low.into(),
        max_per_wallet.high.into(),
        1, // is_open
    ];
    let mut minter = ICharacterMinterDispatcher {
        contract_address: world
            .deploy_contract('salt2', character_minter::TEST_CLASS_HASH.try_into().unwrap())
    };
    world.grant_owner(dojo::utils::bytearray_hash(@"origami_token"), minter.contract_address);
    world.grant_writer(selector_from_tag!("zidle-TokenConfig"), minter.contract_address);
    world.grant_writer(selector_from_tag!("zidle-Char"), minter.contract_address);
    world.init_contract(SELECTORS::CHARACTER_MINTER, minter_call_data.span());

    utils::impersonate(OWNER());

    (world, token, minter)
}

fn setup() -> (IWorldDispatcher, ICharacterTokenDispatcher, ICharacterMinterDispatcher) {
    let (mut world, mut token, mut minter) = setup_uninitialized();

    // initialize contracts
    minter.mint(OWNER(), token.contract_address);
    minter.mint(OWNER(), token.contract_address);

    // drop all events
    utils::drop_all_events(world.contract_address);
    utils::drop_all_events(token.contract_address);
    utils::drop_all_events(minter.contract_address);

    (world, token, minter)
}

//
// initialize
//

#[test]
fn test_initializer() {
    let (_world, mut token, mut _minter) = setup();
    assert(token.balance_of(OWNER(),) == 2, 'Should eq 2');
    assert(token.name() == "zIdle Character", 'Name is wrong');
    assert(token.symbol() == "ZIC", 'Symbol is wrong');
//assert(token.supports_interface(IERC721_ID) == true, 'should support IERC721_ID');
//assert(token.supports_interface(IERC721_METADATA_ID) == true, 'should support METADATA');
//assert(token.supportsInterface(IERC721_ID) == true, 'should support IERC721_ID Camel');
}

#[test]
#[should_panic(expected: ('ERC721: invalid token ID', 'ENTRYPOINT_FAILED'))]
fn test_token_uri_invalid() {
    let (_world, mut token, mut _minter) = setup();
    token.token_uri(999);
}


//
// approve
//

#[test]
fn test_approve() {
    let (world, mut token, mut _minter) = setup();

    utils::impersonate(OWNER(),);

    token.approve(SPENDER(), TOKEN_ID);
    assert(token.get_approved(TOKEN_ID) == SPENDER(), 'Spender not approved correctly');

    // drop StoreSetRecord ERC721TokenApprovalModel
    utils::drop_event(world.contract_address);

    assert_only_event_approval(token.contract_address, OWNER(), SPENDER(), TOKEN_ID);
    assert_only_event_approval(world.contract_address, OWNER(), SPENDER(), TOKEN_ID);
}

//
// transfer_from
//

#[test]
fn test_transfer_from() {
    let (world, mut token, mut _minter) = setup();

    utils::impersonate(OWNER(),);
    token.approve(SPENDER(), TOKEN_ID);

    utils::drop_all_events(token.contract_address);
    utils::drop_all_events(world.contract_address);
    utils::assert_no_events_left(token.contract_address);

    utils::impersonate(SPENDER());
    token.transfer_from(OWNER(), RECIPIENT(), TOKEN_ID);

    assert_only_event_transfer(token.contract_address, OWNER(), RECIPIENT(), TOKEN_ID);

    assert(token.balance_of(RECIPIENT()) == 1, 'Should eq 1');
    assert(token.balance_of(OWNER(),) == 1, 'Should eq 1');
    assert(token.get_approved(TOKEN_ID) == ZERO(), 'Should eq 0');
    assert(token.total_supply() == 2, 'Should eq 2');
    assert(token.token_by_index(0) == TOKEN_ID, 'Should eq TOKEN_ID');
    assert(token.token_of_owner_by_index(RECIPIENT(), 0) == TOKEN_ID, 'Should eq TOKEN_ID');
}

//
// mint
//

#[test]
fn test_mint() {
    let (_world, mut token, mut minter) = setup();
    assert(token.total_supply() == 2, 'invalid total_supply init');
    assert(minter.can_mint(RECIPIENT(), token.contract_address) == true, '!can_mint');
    minter.mint(RECIPIENT(), token.contract_address);
    assert(token.balance_of(RECIPIENT()) == 1, 'invalid balance_of');
    assert(token.total_supply() == 3, 'invalid total_supply');
    assert(token.token_by_index(2) == TOKEN_ID_3, 'invalid token_by_index');
    assert(token.token_of_owner_by_index(RECIPIENT(), 0) == 3, 'invalid token_of_owner_by_index');
}

#[test]
#[should_panic(expected: ('CharToken: caller is not minter', 'ENTRYPOINT_FAILED'))]
fn test_mint_not_minter() {
    let (_world, mut token, mut _minter) = setup();
    token.mint(RECIPIENT(), TOKEN_ID_3);
}

#[test]
#[should_panic(expected: ('MINTER: wallet maxed out', 'ENTRYPOINT_FAILED'))]
fn test_mint_maxed_out() {
    let (_world, mut token, mut minter) = setup();
    assert(minter.can_mint(OWNER(), token.contract_address) == false, 'can_mint');
    minter.mint(OWNER(), token.contract_address);
}

#[test]
#[should_panic(expected: ('MINTER: minted out', 'ENTRYPOINT_FAILED'))]
fn test_mint_minted_out() {
    let (_world, mut token, mut minter) = setup();
    assert(minter.can_mint(RECIPIENT(), token.contract_address) == true, 'can_mint 1');
    minter.mint(RECIPIENT(), token.contract_address);
    assert(minter.can_mint(RECIPIENT(), token.contract_address) == false, 'can_mint 2');
    minter.mint(RECIPIENT(), token.contract_address);
}

//
// burn
//

#[test]
fn test_burn() {
    let (_world, mut token, mut _minter) = setup();
    assert(token.total_supply() == 2, 'invalid total_supply init');
    token.burn(TOKEN_ID_2);
    assert(token.balance_of(OWNER(),) == 1, 'invalid balance_of');
    assert(token.total_supply() == 1, 'invalid total_supply');
    assert(token.token_by_index(0) == TOKEN_ID, 'invalid token_by_index');
    assert(
        token.token_of_owner_by_index(OWNER(), 0) == TOKEN_ID, 'invalid token_of_owner_by_index'
    );
}

