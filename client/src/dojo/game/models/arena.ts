import { ComponentValue } from "@dojoengine/recs";
import { GoalHelper, GoalType } from "../types/goal";
import { Team, TeamHelper } from "../types/team";

export class Goal {
  public goalType: GoalType;
  public firstValidation: Team;
  public secondValidation: Team;

  constructor(goal: ComponentValue) {
    // Assuming goal.goal_type is a numeric tag
    this.goalType = GoalHelper.from_string(goal.goal_type);
    // Assuming Team.from converts a numeric value into a Team enum.
    this.firstValidation = TeamHelper.from_string(goal.first_validation);
    this.secondValidation = TeamHelper.from_string(goal.second_validation);
  }
}

export class Arena {
  public id: number;
  public tokenId1: bigint;
  public tokenId2: bigint;
  public isSet: boolean;
  public goal1: Goal;
  public goal2: Goal;
  public goal3: Goal;
  public team1Points: number;
  public team2Points: number;

  constructor(arena: ComponentValue) {
    console.log("arena constructor ", arena);
    this.id = arena.id;
    this.tokenId1 = arena.token_id_1;
    this.tokenId2 = arena.token_id_2;
    this.isSet = arena.is_set;
    this.goal1 = new Goal(arena.goal1);
    this.goal2 = new Goal(arena.goal2);
    this.goal3 = new Goal(arena.goal3);
    this.team1Points = Number(arena.team1_points);
    this.team2Points = Number(arena.team2_points);
  }

  // You can add helper methods that wrap assertions or formatting.
  public assertSet(): void {
    if (!this.isSet) {
      throw new Error("Arena is not set");
    }
  }

  public assertNotSet(): void {
    if (this.isSet) {
      throw new Error("Arena is already set");
    }
  }
}
