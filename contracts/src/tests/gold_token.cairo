use starknet::{ContractAddress, get_contract_address, get_caller_address, testing};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use dojo::utils::test::spawn_test_world;

use origami_token::tests::utils;
use origami_token::tests::constants::{ZERO, OWNER, SPENDER, RECIPIENT};
use origami_token::components::security::initializable::{initializable_model};
use origami_token::components::introspection::src5::{src_5_model, SRC5Model};
use origami_token::components::introspection::src5::src5_component::{SRC5Impl};

use origami_token::components::token::erc20::{
    erc20_metadata::{erc_20_metadata_model}, erc20_balance::{erc_20_balance_model},
    erc20_allowance::{erc_20_allowance_model}
};

use zidle::systems::gold_token::{gold_token, IGoldTokenDispatcher, IGoldTokenDispatcherTrait,};
use zidle::systems::gold_minter::{gold_minter, IGoldMinterDispatcher, IGoldMinterDispatcherTrait,};

use zidle::models::char::{char};
use zidle::models::miner::{miner};
use zidle::models::player::{player};
use zidle::models::token_config::{token_config};
use zidle::interfaces::systems::{SELECTORS};

// Event assertion helpers (similar to your ERC721 tests)
// ... (implement similar helpers for Transfer and Approval events)

// Setup

const MAX_SUPPLY: u256 = 1_000_000_000_000;
const MAX_PER_WALLET: u256 = 100_000_000_000;
const MINT_AMOUNT: u256 = 10000;

fn setup_uninitialized() -> (IWorldDispatcher, IGoldTokenDispatcher, IGoldMinterDispatcher) {
    testing::set_block_number(1);
    testing::set_block_timestamp(1);
    let mut world = spawn_test_world(
        ["origami_token", "zidle"].span(),
        array![
            initializable_model::TEST_CLASS_HASH,
            src_5_model::TEST_CLASS_HASH,
            erc_20_metadata_model::TEST_CLASS_HASH,
            erc_20_balance_model::TEST_CLASS_HASH,
            erc_20_allowance_model::TEST_CLASS_HASH,
            // zidle
            char::TEST_CLASS_HASH,
            miner::TEST_CLASS_HASH,
            player::TEST_CLASS_HASH,
            token_config::TEST_CLASS_HASH,
        ]
            .span()
    );

    let mut token = IGoldTokenDispatcher {
        contract_address: world
            .deploy_contract('salt', gold_token::TEST_CLASS_HASH.try_into().unwrap())
    };
    world.grant_owner(dojo::utils::bytearray_hash(@"origami_token"), token.contract_address);
    world.grant_writer(selector_from_tag!("origami_token-SRC5Model"), token.contract_address);
    world
        .grant_writer(
            selector_from_tag!("origami_token-InitializableModel"), token.contract_address
        );
    world
        .grant_writer(
            selector_from_tag!("origami_token-ERC20BalanceModel"), token.contract_address
        );
    world
        .grant_writer(
            selector_from_tag!("origami_token-ERC20MetadataModel"), token.contract_address
        );
    world
        .grant_writer(
            selector_from_tag!("origami_token-ERC20AllowanceModel"), token.contract_address
        );
    world.init_contract(SELECTORS::GOLD_TOKEN, [].span());

    // Deploy minter
    let minter_call_data: Array<felt252> = array![
        token.contract_address.into(),
        MAX_SUPPLY.low.into(), // max_supply
        MAX_SUPPLY.high.into(),
        MAX_PER_WALLET.low.into(), // max_per_wallet
        MAX_PER_WALLET.high.into(),
        1, // is_open
    ];
    let mut minter = IGoldMinterDispatcher {
        contract_address: world
            .deploy_contract('salt2', gold_minter::TEST_CLASS_HASH.try_into().unwrap())
    };
    world.grant_owner(dojo::utils::bytearray_hash(@"origami_token"), minter.contract_address);
    world.grant_writer(selector_from_tag!("zidle-TokenConfig"), minter.contract_address);
    world.grant_writer(selector_from_tag!("zidle-Char"), minter.contract_address);
    world.init_contract(SELECTORS::GOLD_MINTER, minter_call_data.span());

    utils::impersonate(OWNER());

    (world, token, minter)
}

fn setup() -> (IWorldDispatcher, IGoldTokenDispatcher, IGoldMinterDispatcher) {
    let (mut world, mut token, mut minter) = setup_uninitialized();

    minter.mint(OWNER(), MINT_AMOUNT, token.contract_address);

    // Drop all events
    utils::drop_all_events(world.contract_address);
    utils::drop_all_events(token.contract_address);
    utils::drop_all_events(minter.contract_address);

    (world, token, minter)
}

// Tests

#[test]
fn test_initializer() {
    let (_world, mut token, mut _minter) = setup();
    assert(token.name() == "zIdle Gold", 'Name is wrong');
    assert(token.symbol() == "ZIG", 'Symbol is wrong');
    assert(token.total_supply() == MINT_AMOUNT, 'Total supply is wrong');
    assert(token.balance_of(OWNER()) == MINT_AMOUNT, 'Owner balance is wrong');
}

#[test]
fn test_transfer() {
    let (_world, mut token, mut _minter) = setup();

    utils::impersonate(OWNER());
    let transfer_amount: u256 = 1000;

    let initial_balance = token.balance_of(OWNER());
    token.transfer(RECIPIENT(), transfer_amount);

    assert(
        token.balance_of(OWNER()) == initial_balance - transfer_amount,
        'Balance wrong after transfer 1'
    );
    assert(token.balance_of(RECIPIENT()) == transfer_amount, 'Balance wrong after transfer 2');
}

#[test]
fn test_approve() {
    let (_world, mut token, mut _minter) = setup();

    utils::impersonate(OWNER());
    let approve_amount: u256 = 500;

    token.approve(SPENDER(), approve_amount);
    assert(token.allowance(OWNER(), SPENDER()) == approve_amount, 'Allowance not set correctly');
}

#[test]
fn test_transfer_from() {
    let (_world, mut token, mut _minter) = setup();

    assert(token.balance_of(OWNER()) == MINT_AMOUNT, 'Owner should have token');

    // OWNER approves SPENDER to spend tokens
    utils::impersonate(OWNER());
    let approve_amount: u256 = 1000;
    token.approve(SPENDER(), approve_amount);

    // Check that the approval was set correctly
    assert(token.allowance(OWNER(), SPENDER()) == approve_amount, 'Allowance not set correctly');

    // Now, SPENDER transfers tokens from OWNER to RECIPIENT
    utils::impersonate(SPENDER());
    let transfer_amount: u256 = 500;
    token.transfer_from(OWNER(), RECIPIENT(), transfer_amount);

    // Check balances after transfer
    assert(
        token.balance_of(OWNER()) == MINT_AMOUNT - transfer_amount, 'Balance wrong after transfer 1'
    );
    assert(token.balance_of(RECIPIENT()) == transfer_amount, 'Balance wrong after transfer 2');
    assert(token.balance_of(SPENDER()) == 0, 'Balance should not change');

    // Check that the allowance was reduced
    assert(
        token.allowance(OWNER(), SPENDER()) == approve_amount - transfer_amount,
        'Allowance not updated correctly'
    );
}

#[test]
fn test_mint() {
    let (_world, mut token, mut minter) = setup();

    assert(minter.can_mint(RECIPIENT(), token.contract_address) == true, 'Should be able to mint');
    minter.mint(RECIPIENT(), MINT_AMOUNT, token.contract_address);

    assert(token.balance_of(RECIPIENT()) == MINT_AMOUNT, 'Balance wrong after mint');
    assert(token.total_supply() == 2 * MINT_AMOUNT, 'Total supply wrong after mint');
}

#[test]
#[should_panic(expected: ('MINTER: minted out', 'ENTRYPOINT_FAILED'))]
fn test_mint_exceed_max_supply() {
    let (_world, mut token, mut minter) = setup();

    let exceed_amount = MAX_SUPPLY + 1;
    minter.mint(RECIPIENT(), exceed_amount, token.contract_address);
}

#[test]
#[should_panic(expected: ('MINTER: wallet maxed out', 'ENTRYPOINT_FAILED'))]
fn test_mint_exceed_wallet_max() {
    let (_world, mut token, mut minter) = setup();

    minter.mint(RECIPIENT(), MAX_PER_WALLET, token.contract_address);
    minter.mint(RECIPIENT(), 1, token.contract_address);
}
// #[test]
// fn test_set_open() {
//     let (_world, mut token, mut minter) = setup();

//     utils::impersonate(OWNER());
//     minter.set_open(token.contract_address, false);

//     assert(
//         minter.can_mint(RECIPIENT(), token.contract_address) == false, 'Cannot mint when closed'
//     );

//     minter.set_open(token.contract_address, true);
//     assert(minter.can_mint(RECIPIENT(), token.contract_address) == true, 'Cannot mint when
//     open');
// }
// Add more tests as needed


