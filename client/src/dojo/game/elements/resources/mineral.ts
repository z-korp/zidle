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

  public unitPrice(): number {
    switch (this.value) {
      case MineralType.Coal:
        return 1;
      case MineralType.Copper:
        return 2;
      case MineralType.Iron:
        return 3;
      case MineralType.Silver:
        return 4;
      case MineralType.Gold:
        return 5;
      case MineralType.Mithril:
        return 6;
      case MineralType.Adamantium:
        return 10;
      default:
        return 0;
    }
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

  public baseTime(): number {
    switch (this.value) {
      case MineralType.None:
        return 0;
      case MineralType.Coal:
        return 2000;
      case MineralType.Copper:
        return 3000;
      case MineralType.Iron:
        return 4000;
      case MineralType.Silver:
        return 5000;
      case MineralType.Gold:
        return 6000;
      case MineralType.Mithril:
        return 10000;
      case MineralType.Adamantium:
        return 15000;
      default:
        return 0;
    }
  }

  public calculateXp(playerLevel: number): number {
    const base = this.baseXp();
    const levelBonus = (playerLevel - this.minLevel()) * 2;
    return base + levelBonus;
  }

  public calculateGatheringDurationPerUnit(playerLevel: number): number {
    const levelBonus = playerLevel * 5; // 0.5% per level, multiplied by 10 for precision
    const timeReduction = (this.baseTime() * levelBonus) / 1000; // Divide by 1000 to apply percentage

    return this.baseTime() - timeReduction; // Minimum 1 second (1000ms)
  }
}
