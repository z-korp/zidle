export enum FoodType {
  None = "None",
  Berries = "Berries",
  Wheat = "Wheat",
  Vegetables = "Vegetables",
  Fruits = "Fruits",
  Herbs = "Herbs",
  Mushrooms = "Mushrooms",
  Ambrosia = "Ambrosia",
}

export class Food {
  value: FoodType;

  constructor(value: FoodType) {
    this.value = value;
  }

  public into(): number {
    return Object.values(FoodType).indexOf(this.value);
  }

  public static from(index: number): Food {
    const food = Object.values(FoodType)[index];
    return new Food(food);
  }

  public unitPrice(): number {
    switch (this.value) {
      case FoodType.Berries:
        return 1;
      case FoodType.Wheat:
        return 2;
      case FoodType.Vegetables:
        return 3;
      case FoodType.Fruits:
        return 4;
      case FoodType.Herbs:
        return 5;
      case FoodType.Mushrooms:
        return 6;
      case FoodType.Ambrosia:
        return 10;
      default:
        return 0;
    }
  }

  public minLevel(): number {
    switch (this.value) {
      case FoodType.Berries:
        return 0;
      case FoodType.Wheat:
        return 15;
      case FoodType.Vegetables:
        return 30;
      case FoodType.Fruits:
        return 45;
      case FoodType.Herbs:
        return 60;
      case FoodType.Mushrooms:
        return 75;
      case FoodType.Ambrosia:
        return 90;
      default:
        return 0;
    }
  }

  public maxLevel(): number {
    switch (this.value) {
      case FoodType.Berries:
        return 14;
      case FoodType.Wheat:
        return 29;
      case FoodType.Vegetables:
        return 44;
      case FoodType.Fruits:
        return 59;
      case FoodType.Herbs:
        return 74;
      case FoodType.Mushrooms:
        return 89;
      case FoodType.Ambrosia:
        return 99;
      default:
        return 0;
    }
  }

  public hardness(): number {
    switch (this.value) {
      case FoodType.Berries:
        return 10;
      case FoodType.Wheat:
        return 15;
      case FoodType.Vegetables:
        return 20;
      case FoodType.Fruits:
        return 25;
      case FoodType.Herbs:
        return 30;
      case FoodType.Mushrooms:
        return 35;
      case FoodType.Ambrosia:
        return 40;
      default:
        return 0;
    }
  }

  public baseXp(): number {
    switch (this.value) {
      case FoodType.Berries:
        return 5;
      case FoodType.Wheat:
        return 10;
      case FoodType.Vegetables:
        return 15;
      case FoodType.Fruits:
        return 20;
      case FoodType.Herbs:
        return 25;
      case FoodType.Mushrooms:
        return 30;
      case FoodType.Ambrosia:
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
