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

  public hardness(): number {
    switch (this.value) {
      case WoodType.Pine:
        return 1;
      case WoodType.Oak:
        return 1.5;
      case WoodType.Maple:
        return 2.0;
      case WoodType.Walnut:
        return 2.5;
      case WoodType.Mahogany:
        return 3.0;
      case WoodType.Ebony:
        return 3.5;
      case WoodType.Eldertree:
        return 4.0;
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

  public calculateXp(playerLevel: number): number {
    const base = this.baseXp();
    const levelBonus = Math.max(0, (playerLevel - this.minLevel()) * 2);
    return base + levelBonus;
  }

  public calculateGatheringSpeed(playerLevel: number): number {
    const baseSpeed = 100; // Base speed of 1 unit per minute, scaled by 100 for precision
    const levelBonus = playerLevel * 2; // 2% increase per level
    const hardnessFactor = this.hardness();
    return Math.floor((baseSpeed + levelBonus) * hardnessFactor);
  }
}
