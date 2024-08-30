// Starknet imports

use starknet::ContractAddress;

// Internal imports

use zidle::types::resource::{ResourceTrait, ResourceType, ResourceImpl};

mod errors {
    const MINER_NOT_EXIST: felt252 = 'Miner: not exist';
    const MINER_NOT_MINING: felt252 = 'Miner: not mining';
    const MINER_ALREADY_EXIST: felt252 = 'Miner: already exist';
    const MINER_ALREADY_MINING: felt252 = 'Miner: already mining';
}

#[derive(Copy, Drop, Serde, IntrospectPacked)]
#[dojo::model]
pub struct Miner {
    #[key]
    token_id: u128,
    #[key]
    resource_type: u8, // RessourceType: WoodType, FoodType, MineralType...
    xp: u64,
    timestamp: u64, // Unix timestamp, if 0 then the mining is not active
    subresource_type: u8,
    rcs_1: u64,
    rcs_2: u64,
    rcs_3: u64,
    rcs_4: u64,
    rcs_5: u64,
    rcs_6: u64,
    rcs_7: u64,
}

#[generate_trait]
impl MinerImpl of MinerTrait {
    #[inline(always)]
    fn new(token_id: u128, resource_type: u8) -> Miner {
        println!("New [Miner]  id: {}, resource_type: {}", token_id, resource_type);
        // [Return] Miner
        //let mut xp = 0;
        // if (resource_type == 1) {
        //     xp = 25100;
        // } else if (resource_type == 2) {
        //     xp = 0;
        // } else if (resource_type == 3) {
        //     xp = 75000;
        // }

        Miner {
            token_id,
            resource_type,
            xp: 0,
            timestamp: 0,
            subresource_type: 0,
            rcs_1: 0,
            rcs_2: 0,
            rcs_3: 0,
            rcs_4: 0,
            rcs_5: 0,
            rcs_6: 0,
            rcs_7: 0,
        }
    }

    #[inline(always)]
    fn mine(ref self: Miner, subresource_type: u8, timestamp: u64) {
        // [Check] Mining is not active
        assert(self.timestamp == 0, errors::MINER_ALREADY_MINING);

        // [Effect] Start mining
        self.timestamp = timestamp;
        self.subresource_type = subresource_type;
    }

    #[inline(always)]
    fn harvest(ref self: Miner, timestamp: u64, player_level: u8) {
        // [Check] Mining is active
        assert(self.timestamp != 0, errors::MINER_NOT_MINING);

        // [Effect] Harvest
        let resource: ResourceType = ResourceImpl::from(self.resource_type, self.subresource_type);
        let xp: u64 = resource.calculate_xp(player_level).into();
        let gathering_duration_per_unit: u32 = resource.calculate_gathering_duration(player_level);

        let time_elapsed: u64 = timestamp - self.timestamp;

        let rcs_gained: u64 = (time_elapsed.into() * 1000) / gathering_duration_per_unit.into();
        let xp_gained: u64 = rcs_gained * xp;
        self.xp += xp_gained;

        if (self.subresource_type == 1) {
            self.rcs_1 += rcs_gained;
        } else if (self.subresource_type == 2) {
            self.rcs_2 += rcs_gained;
        } else if (self.subresource_type == 3) {
            self.rcs_3 += rcs_gained;
        } else if (self.subresource_type == 4) {
            self.rcs_4 += rcs_gained;
        } else if (self.subresource_type == 5) {
            self.rcs_5 += rcs_gained;
        } else if (self.subresource_type == 6) {
            self.rcs_6 += rcs_gained;
        } else if (self.subresource_type == 7) {
            self.rcs_7 += rcs_gained;
        }

        // [Effect] Stop mining
        self.timestamp = 0;
    }

    #[inline(always)]
    fn get_available_rcs(ref self: Miner, subresource_type: u8) -> u64 {
        if (subresource_type == 1) {
            self.rcs_1
        } else if (subresource_type == 2) {
            self.rcs_2
        } else if (subresource_type == 3) {
            self.rcs_3
        } else if (subresource_type == 4) {
            self.rcs_4
        } else if (subresource_type == 5) {
            self.rcs_5
        } else if (subresource_type == 6) {
            self.rcs_6
        } else if (subresource_type == 7) {
            self.rcs_7
        } else {
            0
        }
    }

    #[inline(always)]
    fn sell(ref self: Miner, subresource_type: u8, amount: u64) {
        let rcs: u64 = self.get_available_rcs(subresource_type);
        assert(rcs >= amount, 'Miner: not enough rcs');

        if (subresource_type == 1) {
            self.rcs_1 -= amount;
        } else if (subresource_type == 2) {
            self.rcs_2 -= amount;
        } else if (subresource_type == 3) {
            self.rcs_3 -= amount;
        } else if (subresource_type == 4) {
            self.rcs_4 -= amount;
        } else if (subresource_type == 5) {
            self.rcs_5 -= amount;
        } else if (subresource_type == 6) {
            self.rcs_6 -= amount;
        } else if (subresource_type == 7) {
            self.rcs_7 -= amount;
        }
    }
}

#[generate_trait]
impl MinerAssert of AssertTrait {
    #[inline(always)]
    fn assert_exists(self: Miner) {
        assert(self.is_non_zero(), errors::MINER_NOT_EXIST);
    }

    #[inline(always)]
    fn assert_not_exists(self: Miner) {
        assert(self.is_zero(), errors::MINER_ALREADY_EXIST);
    }
}

impl ZeroableMinerImpl of core::Zeroable<Miner> {
    #[inline(always)]
    fn zero() -> Miner {
        Miner {
            token_id: core::Zeroable::zero(),
            resource_type: 0,
            xp: 0,
            timestamp: core::Zeroable::zero(),
            subresource_type: 0,
            rcs_1: 0,
            rcs_2: 0,
            rcs_3: 0,
            rcs_4: 0,
            rcs_5: 0,
            rcs_6: 0,
            rcs_7: 0,
        }
    }

    #[inline(always)]
    fn is_zero(self: Miner) -> bool {
        0 == self.token_id
    }

    #[inline(always)]
    fn is_non_zero(self: Miner) -> bool {
        !self.is_zero()
    }
}

#[cfg(test)]
mod tests {
    // Core imports

    use core::debug::PrintTrait;
    use core::Default;

    // Local imports

    use super::{Miner, MinerImpl};

    // Constants

    const TIME: u64 = 1710347593;

    #[test]
    fn test_miner_new() {
        // [Setup]
        let id: felt252 = 1;
        let resource_type: u8 = 2;

        // [Execute]
        let miner: Miner = MinerImpl::new(id, resource_type);

        // [Assert]
        assert(miner.id == id, 'Create: wrong miner id');
        assert(miner.resource_type == resource_type, 'Create: wrong miner rcs type');
        println!("miner.xp: {}", miner.xp);
        assert(miner.xp == 0, 'Create: wrong miner xp');
        assert(miner.timestamp == 0, 'Create: wrong miner timestamp');
        assert(miner.subresource_type == 0, 'Create: wrong miner subrcs type');
        assert(miner.rcs_1 == 0, 'Create: wrong miner rcs');
        assert(miner.rcs_2 == 0, 'Create: wrong miner rcs');
        assert(miner.rcs_3 == 0, 'Create: wrong miner rcs');
        assert(miner.rcs_4 == 0, 'Create: wrong miner rcs');
        assert(miner.rcs_5 == 0, 'Create: wrong miner rcs');
        assert(miner.rcs_6 == 0, 'Create: wrong miner rcs');
        assert(miner.rcs_7 == 0, 'Create: wrong miner rcs');
    }

    #[test]
    fn test_miner_mine() {
        // [Setup]
        let id: felt252 = 1;
        let resource_type: u8 = 1;
        let subresource_type: u8 = 1;
        let timestamp: u64 = TIME;

        let mut miner: Miner = MinerImpl::new(id, resource_type);

        // [Execute]
        miner.mine(subresource_type, timestamp);

        // [Assert]
        assert(miner.timestamp == timestamp, 'Mine: wrong miner timestamp');
        assert(miner.subresource_type == subresource_type, 'Mine: wrong miner subrcs type');
    }
}
