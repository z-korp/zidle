export enum MineralType {
  None = "None",
  Coal = "Coal",
  Copper = "Copper",
  Iron = "Iron",
  Silver = "Silver",
  Gold = "Gold",
  Mithril = "Mithril",
  Adamantium = "Adamantium",
}

export class Mineral {
  value: MineralType;

  constructor(value: MineralType) {
    this.value = value;
  }

  public into(): number {
    return Object.values(MineralType).indexOf(this.value);
  }

  public static from(index: number): Mineral {
    const wood = Object.values(MineralType)[index];
    return new Mineral(wood);
  }

  public minLevel(): number {
    switch (this.value) {
      case MineralType.Coal:
        return 0;
      case MineralType.Copper:
        return 15;
      case MineralType.Iron:
        return 30;
      case MineralType.Silver:
        return 45;
      case MineralType.Gold:
        return 60;
      case MineralType.Mithril:
        return 75;
      case MineralType.Adamantium:
        return 90;
      default:
        return 0;
    }
  }

  public maxLevel(): number {
    switch (this.value) {
      case MineralType.Coal:
        return 14;
      case MineralType.Copper:
        return 29;
      case MineralType.Iron:
        return 44;
      case MineralType.Silver:
        return 59;
      case MineralType.Gold:
        return 74;
      case MineralType.Mithril:
        return 89;
      case MineralType.Adamantium:
        return 99;
      default:
        return 0;
    }
  }

  public hardness(): number {
    switch (this.value) {
      case MineralType.Coal:
        return 10;
      case MineralType.Copper:
        return 15;
      case MineralType.Iron:
        return 20;
      case MineralType.Silver:
        return 25;
      case MineralType.Gold:
        return 30;
      case MineralType.Mithril:
        return 35;
      case MineralType.Adamantium:
        return 40;
      default:
        return 0;
    }
  }

  public baseXp(): number {
    switch (this.value) {
      case MineralType.Coal:
        return 5;
      case MineralType.Copper:
        return 10;
      case MineralType.Iron:
        return 15;
      case MineralType.Silver:
        return 20;
      case MineralType.Gold:
        return 25;
      case MineralType.Mithril:
        return 30;
      case MineralType.Adamantium:
        return 50;
      default:
        return 0;
    }
  }

  public calculateXp(playerLevel: number): number {
    const base = this.baseXp();
    const levelBonus = (playerLevel - this.minLevel()) * 2;
    return base + levelBonus;
  }

  public calculateGatheringSpeed(playerLevel: number): number {
    const baseSpeed = 100; // Base speed of 1 unit per minute, scaled by 100 for precision
    const levelBonus = playerLevel * 2; // 2% increase per level
    const hardnessFactor = this.hardness();

    return Math.floor((baseSpeed + levelBonus) / hardnessFactor);
  }
}
