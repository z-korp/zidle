mod setup {
    // Core imports

    use core::debug::PrintTrait;

    // Starknet imports

    use starknet::ContractAddress;
    use starknet::testing::{set_contract_address};

    // Dojo imports

    use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
    use dojo::test_utils::{spawn_test_world, deploy_contract};

    // Internal imports

    use zidle::models::player::Player;
    use zidle::models::team::Team;
    use zidle::models::shop::Shop;
    use zidle::models::character::Character;
    use zidle::models::registry::Registry;
    use zidle::models::league::League;
    use zidle::models::slot::Slot;
    use zidle::models::squad::Squad;
    use zidle::models::foe::Foe;
    use zidle::systems::account::{account, IAccountDispatcher, IAccountDispatcherTrait};
    use zidle::systems::battle::{battle, IBattleDispatcher, IBattleDispatcherTrait};
    use zidle::systems::market::{market, IMarketDispatcher, IMarketDispatcherTrait};

    // Constants

    fn PLAYER() -> ContractAddress {
        starknet::contract_address_const::<'PLAYER'>()
    }

    const PLAYER_NAME: felt252 = 'PLAYER';

    #[derive(Drop)]
    struct Systems {
        account: IAccountDispatcher,
        battle: IBattleDispatcher,
        market: IMarketDispatcher,
    }

    #[derive(Drop)]
    struct Context {
        player_id: felt252,
        player_name: felt252,
    }

    #[inline(always)]
    fn spawn_game() -> (IWorldDispatcher, Systems, Context) {
        // [Setup] World
        let mut models = core::array::ArrayTrait::new();
        models.append(zidle::models::index::player::TEST_CLASS_HASH);
        models.append(zidle::models::index::team::TEST_CLASS_HASH);
        models.append(zidle::models::index::shop::TEST_CLASS_HASH);
        models.append(zidle::models::index::character::TEST_CLASS_HASH);
        models.append(zidle::models::index::registry::TEST_CLASS_HASH);
        models.append(zidle::models::index::league::TEST_CLASS_HASH);
        models.append(zidle::models::index::slot::TEST_CLASS_HASH);
        models.append(zidle::models::index::squad::TEST_CLASS_HASH);
        models.append(zidle::models::index::foe::TEST_CLASS_HASH);
        let world = spawn_test_world(models);

        // [Setup] Systems
        let account_address = deploy_contract(account::TEST_CLASS_HASH, array![].span());
        let battle_address = deploy_contract(battle::TEST_CLASS_HASH, array![].span());
        let market_address = deploy_contract(market::TEST_CLASS_HASH, array![].span());
        let systems = Systems {
            account: IAccountDispatcher { contract_address: account_address },
            battle: IBattleDispatcher { contract_address: battle_address },
            market: IMarketDispatcher { contract_address: market_address },
        };

        // [Setup] Context
        set_contract_address(PLAYER());
        systems.account.create(world, PLAYER_NAME);
        let context = Context { player_id: PLAYER().into(), player_name: PLAYER_NAME, };

        // [Return]
        (world, systems, context)
    }
}
