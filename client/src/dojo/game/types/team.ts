export enum Team {
  None = "None",
  Team1 = "Team1",
  Team2 = "Team2",
}

export class TeamHelper {
  public static from(value: number): Team {
    switch (value) {
      case 0:
        return Team.None;
      case 1:
        return Team.Team1;
      case 2:
        return Team.Team2;
      default:
        return Team.None;
    }
  }

  public static from_string(value: string): Team {
    return Team[value as keyof typeof Team];
  }
}
