// Core imports
use core::debug::PrintTrait;

// Constants
const MAX_LEVEL: u8 = 99;
const BASE_XP: u64 = 100;
const XP_MULTIPLIER: u64 = 50;

// Errors
mod errors {
    const INVALID_LEVEL: felt252 = 'XpLevel: invalid level';
    const INVALID_XP: felt252 = 'XpLevel: invalid xp';
}

#[generate_trait]
impl XpLevel of XpLevelTrait {
    fn get_level_from_xp(xp: u64) -> u8 {
        if xp < Self::xp_for_level(1) {
            return 0;
        }
        if xp >= Self::xp_for_level(MAX_LEVEL) {
            return MAX_LEVEL;
        }
        let mut left: u8 = 1;
        let mut right: u8 = MAX_LEVEL;
        loop {
            if left >= right {
                break;
            }
            let mid = (left + right + 1) / 2;
            if Self::xp_for_level(mid) <= xp {
                left = mid;
            } else {
                right = mid - 1;
            }
        };
        left
    }

    #[inline(always)]
    fn xp_for_level(level: u8) -> u64 {
        assert(level <= MAX_LEVEL, errors::INVALID_LEVEL);
        if level == 0 {
            return 0;
        }
        let level_u64: u64 = level.into();
        BASE_XP + (level_u64 - 1) * (level_u64 + XP_MULTIPLIER)
    }

    #[inline(always)]
    fn xp_for_next_level(current_xp: u64) -> u64 {
        let current_level = Self::get_level_from_xp(current_xp);
        if current_level == MAX_LEVEL {
            return 0; // No next level
        }
        Self::xp_for_level(current_level + 1) - current_xp
    }
}

// Example usage and testing
#[cfg(test)]
mod tests {
    use super::{XpLevel, XpLevelTrait, MAX_LEVEL};

    #[test]
    fn test_get_level_from_xp() {
        assert(XpLevel::get_level_from_xp(0) == 0, 'Level should be 0');
        assert(XpLevel::get_level_from_xp(100) == 1, 'Level should be 1');
        assert(XpLevel::get_level_from_xp(249) == 1, 'Level should be 1');
        assert(XpLevel::get_level_from_xp(250) == 2, 'Level should be 2');
        assert(
            XpLevel::get_level_from_xp(XpLevel::xp_for_level(MAX_LEVEL)) == MAX_LEVEL,
            'Should be max level'
        );
    }

    #[test]
    fn test_xp_for_level() {
        assert(XpLevel::xp_for_level(0) == 0, 'XP for level 0 incorrect');
        assert(XpLevel::xp_for_level(1) == 100, 'XP for level 1 incorrect');
        assert(XpLevel::xp_for_level(2) == 250, 'XP for level 2 incorrect');
        assert(XpLevel::xp_for_level(10) == 5050, 'XP for level 10 incorrect');
        assert(XpLevel::xp_for_level(50) == 125050, 'XP for level 50 incorrect');
    // Uncomment and adjust the following line based on your desired XP for max level
    // assert(XpLevel::xp_for_level(MAX_LEVEL) == 5_000_000, 'XP for max level incorrect');
    }

    #[test]
    fn test_xp_for_next_level() {
        assert(XpLevel::xp_for_next_level(0) == 100, 'XP for next level incorrect');
        assert(XpLevel::xp_for_next_level(100) == 150, 'XP for next level incorrect');
        assert(
            XpLevel::xp_for_next_level(XpLevel::xp_for_level(MAX_LEVEL) - 1) == 1,
            'XP for next level incorrect'
        );
        assert(
            XpLevel::xp_for_next_level(XpLevel::xp_for_level(MAX_LEVEL)) == 0,
            'XP for max level incorrect'
        );
    }

    #[test]
    #[should_panic(expected: ('XpLevel: invalid level',))]
    fn test_invalid_level() {
        XpLevel::xp_for_level(MAX_LEVEL + 1);
    }
}
