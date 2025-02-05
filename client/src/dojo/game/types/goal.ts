export enum GoalType {
  None = "None",
  Gold = "Gold",
  Wood = "Wood",
  Food = "Food",
  Mineral = "Mineral",
}

export class GoalHelper {
  public static pointsFirst(goalType: GoalType): number {
    switch (goalType) {
      case GoalType.Gold:
        return 100;
      case GoalType.Wood:
        return 50;
      case GoalType.Food:
        return 25;
      case GoalType.Mineral:
        return 75;
      case GoalType.None:
      default:
        return 0;
    }
  }

  public static pointsSecond(goalType: GoalType): number {
    switch (goalType) {
      case GoalType.Gold:
        return 50;
      case GoalType.Wood:
        return 25;
      case GoalType.Food:
        return 12;
      case GoalType.Mineral:
        return 37;
      case GoalType.None:
      default:
        return 0;
    }
  }

  public static from(value: number): GoalType {
    switch (value) {
      case 0:
        return GoalType.None;
      case 1:
        return GoalType.Gold;
      case 2:
        return GoalType.Wood;
      case 3:
        return GoalType.Food;
      case 4:
        return GoalType.Mineral;
      default:
        return GoalType.None;
    }
  }

  public static from_string(value: string): GoalType {
    return GoalType[value as keyof typeof GoalType];
  }
}
