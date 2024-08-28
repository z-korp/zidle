import { ComponentValue } from "@dojoengine/recs";
import { Resource } from "../types/resource";

export interface InventoryItem {
  rcs: Resource;
  quantity: number;
}

export class Miner {
  public id: string;
  public resource: Resource;

  public xp: number;
  public timestamp: number;
  public resource_number: number;

  public inventory: InventoryItem[];

  private createInventory(
    resource_type: number,
    rcs_1: number,
    rcs_2: number,
    rcs_3: number,
    rcs_4: number,
    rcs_5: number,
    rcs_6: number,
    rcs_7: number,
  ): InventoryItem[] {
    const inventory: InventoryItem[] = [];
    if (rcs_1 > 0) {
      inventory.push({ rcs: Resource.from(resource_type, 1), quantity: rcs_1 });
    }
    if (rcs_2 > 0) {
      inventory.push({ rcs: Resource.from(resource_type, 2), quantity: rcs_2 });
    }
    if (rcs_3 > 0) {
      inventory.push({ rcs: Resource.from(resource_type, 3), quantity: rcs_3 });
    }
    if (rcs_4 > 0) {
      inventory.push({ rcs: Resource.from(resource_type, 4), quantity: rcs_4 });
    }
    if (rcs_5 > 0) {
      inventory.push({ rcs: Resource.from(resource_type, 5), quantity: rcs_5 });
    }
    if (rcs_6 > 0) {
      inventory.push({ rcs: Resource.from(resource_type, 6), quantity: rcs_6 });
    }
    if (rcs_7 > 0) {
      inventory.push({ rcs: Resource.from(resource_type, 7), quantity: rcs_7 });
    }
    return inventory;
  }

  constructor(miner: ComponentValue) {
    this.id = miner.id;
    this.resource = Resource.from(miner.resource_type, miner.subresource_type);
    this.xp = miner.xp;
    this.timestamp = miner.timestamp;
    this.resource_number = miner.rcs;
    this.inventory = this.createInventory(
      miner.resource_type,
      miner.rcs_1,
      miner.rcs_2,
      miner.rcs_3,
      miner.rcs_4,
      miner.rcs_5,
      miner.rcs_6,
      miner.rcs_7,
    );
  }
}
