import { ComponentValue } from "@dojoengine/recs";
import { Goal, GoalHelper } from "../types/goal";
import { Team } from "../types/team";

export class Arena {
  public id: number;
  public tokenId1: number;
  public tokenId2: number;
  public isSet: boolean;
  public goal1: Goal;
  public goal2: Goal;
  public goal3: Goal;
  public team1Points: number;
  public team2Points: number;

  constructor(arena: ComponentValue) {
    this.id = arena.id;
    this.tokenId1 = Number(arena.token_id_1);
    this.tokenId2 = Number(arena.token_id_2);
    this.isSet = arena.is_set;
    this.goal1 = new Goal(arena.goal1);
    this.goal2 = new Goal(arena.goal2);
    this.goal3 = new Goal(arena.goal3);
    this.team1Points = arena.team1_points;
    this.team2Points = arena.team2_points;
  }

  public get_total_points(tokenId: number): number {
    if (this.tokenId1 === tokenId) {
      return this.team1Points;
    } else if (this.tokenId2 === tokenId) {
      return this.team2Points;
    }
    return 0;
  }

  public get_goal_points(tokenId: number, goal_index: number): number {
    if (goal_index < 1 || goal_index > 3) {
      return 0;
    }
    if (this.tokenId1 === tokenId) {
      if (goal_index === 1) {
        return this.goal1.firstValidation === Team.Team1
          ? GoalHelper.pointsFirst(this.goal1.goalType)
          : GoalHelper.pointsSecond(this.goal1.goalType);
      } else if (goal_index === 2) {
        return this.goal2.firstValidation === Team.Team1
          ? GoalHelper.pointsFirst(this.goal2.goalType)
          : GoalHelper.pointsSecond(this.goal2.goalType);
      }
      return this.goal3.firstValidation === Team.Team1
        ? GoalHelper.pointsFirst(this.goal3.goalType)
        : GoalHelper.pointsSecond(this.goal3.goalType);
    } else if (this.tokenId2 === tokenId) {
      if (goal_index === 1) {
        return this.goal1.firstValidation === Team.Team2
          ? GoalHelper.pointsFirst(this.goal1.goalType)
          : GoalHelper.pointsSecond(this.goal1.goalType);
      } else if (goal_index === 2) {
        return this.goal2.firstValidation === Team.Team2
          ? GoalHelper.pointsFirst(this.goal2.goalType)
          : GoalHelper.pointsSecond(this.goal2.goalType);
      }
      return this.goal3.firstValidation === Team.Team2
        ? GoalHelper.pointsFirst(this.goal3.goalType)
        : GoalHelper.pointsSecond(this.goal3.goalType);
    }

    return 0;
  }
}
