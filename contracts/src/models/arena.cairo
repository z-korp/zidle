use starknet::ContractAddress;
use core::traits::TryInto;
use core::debug::PrintTrait;
use core::Default;
use core::Zeroable;
use zidle::types::goal::{GoalType, GoalTrait};

#[derive(Copy, Drop, Serde, Introspect, PartialEq)]
pub enum Team {
    None,
    Team1,
    Team2,
}

#[derive(Copy, Drop, Serde, Introspect)]
pub struct Goal {
    pub goal_type: GoalType,
    pub first_validation: Team,
    pub second_validation: Team,
}

#[derive(Copy, Drop, Serde, IntrospectPacked)]
#[dojo::model]
struct Arena {
    #[key]
    pub token_id_1: u128,
    #[key]
    pub token_id_2: u128,
    pub is_set: bool,
    //pub goals: Array<Goal>,
    pub goal1: Goal,
    pub goal2: Goal,
    pub goal3: Goal,
    pub team1_points: u64,
    pub team2_points: u64,
}

#[generate_trait]
impl ArenaImpl of ArenaTrait {
    #[inline(always)]
    fn new(token_id_1: u128, token_id_2: u128) -> Arena {
        Arena {
            token_id_1,
            token_id_2,
            is_set: true,
            goal1: Goal {
                goal_type: GoalType::Gold,
                first_validation: Team::None,
                second_validation: Team::None,
            },
            goal2: Goal {
                goal_type: GoalType::Wood,
                first_validation: Team::None,
                second_validation: Team::None,
            },
            goal3: Goal {
                goal_type: GoalType::Food,
                first_validation: Team::None,
                second_validation: Team::None,
            },
            team1_points: 0,
            team2_points: 0,
        }
    }

    fn validate_goal(ref self: Arena, goal_number: u8, team: Team) -> bool {
        // On rejette la validation si l'équipe est None.
        if team == Team::None {
            return false;
        }
        if goal_number == 1 {
            if self.goal1.first_validation == Team::None {
                self.goal1.first_validation = team;
                if team == Team::Team1 {
                    self.team1_points = self.team1_points + self.goal1.goal_type.points_first();
                } else if team == Team::Team2 {
                    self.team2_points = self.team2_points + self.goal1.goal_type.points_first();
                }
                return true;
            } else if self.goal1.second_validation == Team::None
                && self.goal1.first_validation != team {
                self.goal1.second_validation = team;
                if team == Team::Team1 {
                    self.team1_points = self.team1_points + self.goal1.goal_type.points_second();
                } else if team == Team::Team2 {
                    self.team2_points = self.team2_points + self.goal1.goal_type.points_second();
                }
                return true;
            }
            return false;
        } else if goal_number == 2 {
            if self.goal2.first_validation == Team::None {
                self.goal2.first_validation = team;
                if team == Team::Team1 {
                    self.team1_points = self.team1_points + self.goal2.goal_type.points_first();
                } else if team == Team::Team2 {
                    self.team2_points = self.team2_points + self.goal2.goal_type.points_first();
                }
                return true;
            } else if self.goal2.second_validation == Team::None
                && self.goal2.first_validation != team {
                self.goal2.second_validation = team;
                if team == Team::Team1 {
                    self.team1_points = self.team1_points + self.goal2.goal_type.points_second();
                } else if team == Team::Team2 {
                    self.team2_points = self.team2_points + self.goal2.goal_type.points_second();
                }
                return true;
            }
            return false;
        } else if goal_number == 3 {
            if self.goal3.first_validation == Team::None {
                self.goal3.first_validation = team;
                if team == Team::Team1 {
                    self.team1_points = self.team1_points + self.goal3.goal_type.points_first();
                } else if team == Team::Team2 {
                    self.team2_points = self.team2_points + self.goal3.goal_type.points_first();
                }
                return true;
            } else if self.goal3.second_validation == Team::None
                && self.goal3.first_validation != team {
                self.goal3.second_validation = team;
                if team == Team::Team1 {
                    self.team1_points = self.team1_points + self.goal3.goal_type.points_second();
                } else if team == Team::Team2 {
                    self.team2_points = self.team2_points + self.goal3.goal_type.points_second();
                }
                return true;
            }
            return false;
        } else {
            return false;
        }
    }
}

#[generate_trait]
impl ArenaAssert of AssertTrait {
    #[inline(always)]
    fn assert_set(self: Arena) {
        assert(self.is_set, 'Arena is not set');
    }

    #[inline(always)]
    fn assert_not_set(self: Arena) {
        assert(!self.is_set, 'Arena is already set');
    }
}

impl ZeroableArena of Zeroable<Arena> {
    fn zero() -> Arena {
        Arena {
            token_id_1: 0,
            token_id_2: 0,
            is_set: false,
            goal1: Goal {
                // We assume GoalType::None exists; if not, choose an appropriate default.
                goal_type: GoalType::None,
                first_validation: Team::None,
                second_validation: Team::None,
            },
            goal2: Goal {
                goal_type: GoalType::None,
                first_validation: Team::None,
                second_validation: Team::None,
            },
            goal3: Goal {
                goal_type: GoalType::None,
                first_validation: Team::None,
                second_validation: Team::None,
            },
            team1_points: 0,
            team2_points: 0,
        }
    }

    fn is_zero(self: Arena) -> bool {
        !self.is_set
    }

    fn is_non_zero(self: Arena) -> bool {
        !self.is_zero()
    }
}

#[cfg(test)]
mod tests {
    use core::Zeroable;
    use super::{Arena, ArenaTrait, ArenaAssert, ZeroableArena, Team};

    #[test]
    fn test_arena_new() {
        let arena = ArenaTrait::new(1, 2);
        assert(arena.token_id_1 == 1, 'Arena token_id_1 should be 1');
        assert(arena.token_id_2 == 2, 'Arena token_id_2 should be 2');
        assert(arena.is_set, 'Arena should be set');
        assert(arena.team1_points == 0, 'Initial team1_pts shld be 0');
        assert(arena.team2_points == 0, 'Initial team2_pts shld be 0');
    }

    #[test]
    fn test_validate_goal() {
        let mut arena = ArenaTrait::new(1, 2);
        // Validate goal1 for Team1.
        let res = arena.validate_goal(1, Team::Team1);
        assert(res, 'Validation should succeed');
        assert(arena.goal1.first_validation == Team::Team1, 'Goal1 first_val shld be Team1');

        // Validate goal1 for Team2 (second validation).
        let res2 = arena.validate_goal(1, Team::Team2);
        assert(res2, '2nd validation shld succeed');
        assert(arena.goal1.second_validation == Team::Team2, 'Goal1 second_val shld be Team2');

        // Further validation on goal1 should fail.
        let res3 = arena.validate_goal(1, Team::Team1);
        assert(!res3, 'Further validation should fail');
    }

    #[test]
    fn test_zeroable_arena() {
        let arena_zero = ZeroableArena::zero();
        assert(ZeroableArena::is_zero(arena_zero), 'Arena should be zero');
        let arena = ArenaTrait::new(1, 2);
        assert(!ZeroableArena::is_zero(arena), 'Arena should be non-zero');
    }

    #[test]
    fn test_arena_assert() {
        let arena = ArenaTrait::new(1, 2);
        ArenaAssert::assert_set(arena);
        let zero_arena = ZeroableArena::zero();
        ArenaAssert::assert_not_set(zero_arena);
    }
}
