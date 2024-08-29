export enum WoodType {
  None = "None",
  Pine = "Pine",
  Oak = "Oak",
  Maple = "Maple",
  Walnut = "Walnut",
  Mahogany = "Mahogany",
  Ebony = "Ebony",
  Eldertree = "Eldertree",
}

export class Wood {
  value: WoodType;

  constructor(value: WoodType) {
    this.value = value;
  }

  public into(): number {
    return Object.values(WoodType).indexOf(this.value);
  }

  public static from(index: number): Wood {
    const wood = Object.values(WoodType)[index];
    return new Wood(wood);
  }

  public unitPrice(): number {
    switch (this.value) {
      case WoodType.Pine:
        return 1;
      case WoodType.Oak:
        return 2;
      case WoodType.Maple:
        return 3;
      case WoodType.Walnut:
        return 4;
      case WoodType.Mahogany:
        return 5;
      case WoodType.Ebony:
        return 6;
      case WoodType.Eldertree:
        return 10;
      default:
        return 0;
    }
  }

  public minLevel(): number {
    switch (this.value) {
      case WoodType.Pine:
        return 0;
      case WoodType.Oak:
        return 15;
      case WoodType.Maple:
        return 30;
      case WoodType.Walnut:
        return 45;
      case WoodType.Mahogany:
        return 60;
      case WoodType.Ebony:
        return 75;
      case WoodType.Eldertree:
        return 90;
      default:
        return 0;
    }
  }

  public maxLevel(): number {
    switch (this.value) {
      case WoodType.Pine:
        return 14;
      case WoodType.Oak:
        return 29;
      case WoodType.Maple:
        return 44;
      case WoodType.Walnut:
        return 59;
      case WoodType.Mahogany:
        return 74;
      case WoodType.Ebony:
        return 89;
      case WoodType.Eldertree:
        return 99;
      default:
        return 0;
    }
  }

  public baseXp(): number {
    switch (this.value) {
      case WoodType.Pine:
        return 5;
      case WoodType.Oak:
        return 10;
      case WoodType.Maple:
        return 15;
      case WoodType.Walnut:
        return 20;
      case WoodType.Mahogany:
        return 25;
      case WoodType.Ebony:
        return 30;
      case WoodType.Eldertree:
        return 50;
      default:
        return 0;
    }
  }

  public baseTime(): number {
    switch (this.value) {
      case WoodType.None:
        return 0;
      case WoodType.Pine:
        return 2000;
      case WoodType.Oak:
        return 3000;
      case WoodType.Maple:
        return 4000;
      case WoodType.Walnut:
        return 5000;
      case WoodType.Mahogany:
        return 6000;
      case WoodType.Ebony:
        return 10000;
      case WoodType.Eldertree:
        return 15000;
      default:
        return 0;
    }
  }

  public calculateXp(playerLevel: number): number {
    const base = this.baseXp();
    const levelBonus = Math.max(0, (playerLevel - this.minLevel()) * 2);
    return base + levelBonus;
  }

  public calculateGatheringDurationPerUnit(playerLevel: number): number {
    const levelBonus = playerLevel * 5; // 0.5% per level, multiplied by 10 for precision
    const timeReduction = (this.baseTime() * levelBonus) / 1000; // Divide by 1000 to apply percentage

    return this.baseTime() - timeReduction; // Minimum 1 second (1000ms)
  }
}
