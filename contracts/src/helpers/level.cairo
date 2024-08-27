// Core imports
use core::debug::PrintTrait;

// Constants
const MAX_LEVEL: u8 = 99;
const BASE_XP: u64 = 100;
const CURVE_FACTOR: u64 = 10; // Adjusts the steepness of the curve

// Errors
mod errors {
    const INVALID_LEVEL: felt252 = 'XpLevel: invalid level';
    const INVALID_XP: felt252 = 'XpLevel: invalid xp';
}

#[generate_trait]
impl XpLevel of XpLevelTrait {
    fn get_level_from_xp(xp: u64) -> u8 {
        if xp < BASE_XP + CURVE_FACTOR {
            return 0;
        }

        let mut level = 1;
        loop {
            if level == MAX_LEVEL || xp < Self::xp_for_level(level + 1) {
                break;
            }
            level += 1;
        };
        level
    }

    #[inline(always)]
    fn xp_for_level(level: u8) -> u64 {
        assert(level <= MAX_LEVEL, errors::INVALID_LEVEL);
        if level == 0 {
            return 0;
        }
        let level_u64: u64 = level.into();
        BASE_XP + CURVE_FACTOR * level_u64 * level_u64
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
        let test_cases = array![
            (0, 0),
            (99, 0),
            (100, 0),
            (109, 0),
            (110, 1),
            (139, 1),
            (140, 2),
            (189, 2),
            (190, 3),
            (259, 3),
            (260, 4),
            (1099, 9),
            (1100, 10),
            (24599, 49),
            (24600, 49),
            (25099, 49),
            (25100, 50),
            (97109, 98),
            (97110, 98),
            (98109, 98),
            (98110, 99),
            (1000000, 99)
        ];

        let mut i = 0;
        loop {
            if i >= test_cases.len() {
                break;
            }
            let (xp, expected_level) = *test_cases.at(i);
            let result = XpLevel::get_level_from_xp(xp);
            assert(result == expected_level, 'Incorrect level');
            i += 1;
        };
    }

    #[test]
    fn test_xp_for_level() {
        assert(XpLevel::xp_for_level(0) == 0, 'XP for level 0 incorrect');
        assert(XpLevel::xp_for_level(1) == 110, 'XP for level 1 incorrect');
        assert(XpLevel::xp_for_level(2) == 140, 'XP for level 2 incorrect');
        assert(XpLevel::xp_for_level(3) == 190, 'XP for level 3 incorrect');
        assert(XpLevel::xp_for_level(4) == 260, 'XP for level 4 incorrect');
        assert(XpLevel::xp_for_level(10) == 1100, 'XP for level 10 incorrect');
        assert(XpLevel::xp_for_level(50) == 25100, 'XP for level 50 incorrect');
        assert(XpLevel::xp_for_level(99) == 98110, 'XP for level 99 incorrect');
    }

    #[test]
    fn test_xp_for_next_level() {
        assert(XpLevel::xp_for_next_level(0) == 110, 'XP for next level incorrect');
        assert(XpLevel::xp_for_next_level(109) == 1, 'XP for next level incorrect');
        assert(XpLevel::xp_for_next_level(110) == 30, 'XP for next level incorrect');
        assert(XpLevel::xp_for_next_level(139) == 1, 'XP for next level incorrect');
        assert(XpLevel::xp_for_next_level(140) == 50, 'XP for next level incorrect');
        assert(XpLevel::xp_for_next_level(1099) == 1, 'XP for next level incorrect');
        assert(XpLevel::xp_for_next_level(1100) == 210, 'XP for next level incorrect');
        assert(XpLevel::xp_for_next_level(98109) == 1, 'XP for next level incorrect');
        assert(XpLevel::xp_for_next_level(98110) == 0, 'XP for max level incorrect');
    }

    #[test]
    #[should_panic(expected: ('XpLevel: invalid level',))]
    fn test_invalid_level() {
        XpLevel::xp_for_level(MAX_LEVEL + 1);
    }

    #[test]
    fn test_level_progression() {
        let mut previous_xp = 0;
        let mut i = 0;
        loop {
            if i > MAX_LEVEL {
                break;
            }
            let current_xp = XpLevel::xp_for_level(i);
            assert(current_xp >= previous_xp, 'XP should not decrease');
            assert(XpLevel::get_level_from_xp(current_xp) == i, 'Level mismatch');
            if i > 0 {
                assert(
                    XpLevel::get_level_from_xp(current_xp - 1) == i - 1, 'Previous level mismatch'
                );
            }
            previous_xp = current_xp;
            i += 1;
        };
    }
}
