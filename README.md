# zIdle

A fully on-chain game, with Dojo on Starknet.


### Starkli
**Systems**
Character  : 0x7065f221124ca95cbba9d863bae35d498e32bfa2a5047a01c5c8dec35e0d1d8
Character_minter : 0x4d80bc147458ca04bf43003847c341e91ab63b3c2bd041641b625962f07cdd8
Gold_minter : 0x5c6a68e93ec807383c5aacf19e555891a869f23b3ccec3b84bcd986f4885ee7
Pvp        : 0x4bc66fb0bc5d4d860b2a59c50530009c3782ab9172c6a2cdb33f3daa1c450ec
Resources  : 0x46a51d013617a242a1aacb1bebc2bb55e46f1291e5078e51517907c2983856e
Settings   : 0x6198ea3d19de7266f1dda3be16286047701f151914247aae8847ff8dd3bf9bc

**Setup starkli**
source ~/.starkli-wallets/slot-zidle/account_1/envars.sh

**Create character** 
starkli invoke 0x7065f221124ca95cbba9d863bae35d498e32bfa2a5047a01c5c8dec35e0d1d8 selector:create str:agent

**Get TokenID by address**
starkli call 0x051d88174534ea0e084f1eb6669da78a1e3a0c1fe4fd23542397815385550cd2 selector:token_of_owner_by_index 0x6daf2a924fab727ae5409f0743de4869850f988b6f8545268016ad1107fd2cd 1 0

**Get wallet of a character**
starkli call 0x051d88174534ea0e084f1eb6669da78a1e3a0c1fe4fd23542397815385550cd2 selector:wallet_of 1 0

**Get gold balance**
starkli call 0x041a8602ddf005594d1a6149325eaa21a103216a15c2883188ee912ed9a59cb0 selector:balance_of 0x27a3d3785f196eff48a0fca952ed7333753ebf523f7f8fc2e85aee730229eba

**Mine/Harvest** 
starkli invoke <resources_system> selector:mine/harvest <token_id> <rcs> (<subrcs> for mining)
starkli invoke 0x46a51d013617a242a1aacb1bebc2bb55e46f1291e5078e51517907c2983856e selector:mine 6 1 1
starkli invoke 0x46a51d013617a242a1aacb1bebc2bb55e46f1291e5078e51517907c2983856e selector:harvest 6 1

**Sell**
starkli invoke <resources_system> selector:sell <token_id> <rcs> <subrcs> <amount>
starkli invoke 0x46a51d013617a242a1aacb1bebc2bb55e46f1291e5078e51517907c2983856e selector:sell 6 1 1 10

**Arena** 
starkli invoke <pvp_system> selector:create_arena <token_id_1> <token_id_2>
starkli invoke 0x4bc66fb0bc5d4d860b2a59c50530009c3782ab9172c6a2cdb33f3daa1c450ec selector:create_arena 6 7

starkli invoke <pvp_system> selector:validate_goal <token_id> <arena_id> <goal_number>
starkli invoke 0x4bc66fb0bc5d4d860b2a59c50530009c3782ab9172c6a2cdb33f3daa1c450ec selector:validate_goal 6 1 1

starkli call <pvp_system> selector:get_goals_status <token_id> <arena_id> 
starkli call 0x4bc66fb0bc5d4d860b2a59c50530009c3782ab9172c6a2cdb33f3daa1c450ec selector:get_goals_status 2 1

starkli call <pvp_system> selector:is_goal_validated  <token_id> <arena_id> <goal_number>
starkli call 0x4bc66fb0bc5d4d860b2a59c50530009c3782ab9172c6a2cdb33f3daa1c450ec selector:is_goal_validated 2 1 1

**Goals numbers:** 
1) Gold > 50 Gold    -> 100 1er / 50pts 2eme
2) Wood > 50 Pine    -> 50 / 25
3) Food > 50 Berries -> 20 / 10