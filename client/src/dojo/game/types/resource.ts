import { Food, FoodType } from "../elements/resources/food";
import { Mineral, MineralType } from "../elements/resources/mineral";
import { Wood, WoodType } from "../elements/resources/wood";

export enum ResourceType {
  None = "None",
  Wood = "Wood",
  Food = "Food",
  Mineral = "Mineral",
}

export class Resource {
  value: ResourceType;
  subresourceType: WoodType | FoodType | MineralType;
  subresource: Wood | Food | Mineral;

  constructor(
    value: ResourceType,
    subresource: WoodType | FoodType | MineralType,
  ) {
    this.value = value;
    this.subresourceType = subresource;
    switch (value) {
      case ResourceType.Wood:
        this.subresource = new Wood(subresource as WoodType);
        break;
      case ResourceType.Food:
        this.subresource = new Food(subresource as FoodType);
        break;
      case ResourceType.Mineral:
        this.subresource = new Mineral(subresource as MineralType);
        break;
      default:
        this.subresource = new Wood(WoodType.None);
        break;
    }
  }

  public into(): number {
    return Object.values(ResourceType).indexOf(this.value);
  }

  public static from(index: number, subresource_index: number): Resource {
    const resource = Object.values(ResourceType)[index];
    const subresource = Object.values(WoodType)[subresource_index];
    return new Resource(resource, subresource);
  }

  public isNone(): boolean {
    return this.value === ResourceType.None;
  }

  public getName(): string {
    switch (this.value) {
      case ResourceType.Wood:
        return "Wood";
      case ResourceType.Food:
        return "Food";
      case ResourceType.Mineral:
        return "Mineral";
      default:
        return "";
    }
  }

  public getSubresourceName(): string {
    return this.subresource.value;
  }

  public getSubresource(): Wood | Food | Mineral {
    return this.subresource;
  }

  public getSubresourceType(): WoodType | FoodType | MineralType {
    return this.subresourceType;
  }

  public minLevel(): number {
    return this.subresource.minLevel();
  }

  public maxLevel(): number {
    return this.subresource.maxLevel();
  }

  public hardness(): number {
    return this.subresource.hardness();
  }

  public baseXp(): number {
    return this.subresource.baseXp();
  }

  public calculateXp(level: number): number {
    return this.subresource.calculateXp(level);
  }

  public calculateGatheringSpeed(level: number): number {
    return this.subresource.calculateGatheringSpeed(level);
  }
}
