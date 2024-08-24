// Starknet imports

use starknet::ContractAddress;

// Internal imports
use zidle::models::index::Miner;
use zidle::types::resource::{ResourceTrait, ResourceType, ResourceImpl};

mod errors {
    const MINER_NOT_EXIST: felt252 = 'Miner: not exist';
    const MINER_ALREADY_EXIST: felt252 = 'Miner: already exist';
    const MINER_ALREADY_MINING: felt252 = 'Miner: already mining';
}

#[generate_trait]
impl MinerImpl of MinerTrait {
    #[inline(always)]
    fn new(id: felt252, resource_type: u8) -> Miner {
        // [Return] Miner
        Miner { id, resource_type, xp: 0, timestamp: 0, subresource_type: 0, rcs: 0 }
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
        assert(self.timestamp != 0, errors::MINER_NOT_EXIST);

        // [Effect] Harvest
        let resource: ResourceType = ResourceImpl::from(self.resource_type, self.subresource_type);
        let xp: u64 = resource.calculate_xp(player_level).into();
        let gathering_speed: u16 = resource.calculate_gathering_speed(player_level);

        let time_elapsed: u64 = timestamp - self.timestamp;
        let xp_gained: u64 = (time_elapsed * xp) / 1000;
        self.xp += xp_gained;

        let rcs_gained: u64 = (time_elapsed.into() * gathering_speed.into()) / 1000;
        let rcs = self.rcs + rcs_gained;
        self.rcs = rcs;

        // [Effect] Stop mining
        self.timestamp = 0;
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
            id: core::Zeroable::zero(),
            resource_type: 0,
            xp: 0,
            timestamp: core::Zeroable::zero(),
            subresource_type: 0,
            rcs: 0,
        }
    }

    #[inline(always)]
    fn is_zero(self: Miner) -> bool {
        0 == self.id
    }

    #[inline(always)]
    fn is_non_zero(self: Miner) -> bool {
        !self.is_zero()
    }
}
