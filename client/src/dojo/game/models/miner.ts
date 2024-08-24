import { ComponentValue } from "@dojoengine/recs";
import { Resource } from "../types/resource";

export class Miner {
  public id: string;
  public resource: Resource;

  public xp: number;
  public timestamp: number;
  public resource_number: number;

  constructor(miner: ComponentValue) {
    this.id = miner.id;
    this.resource = Resource.from(miner.resource_type, miner.subresource_type);
    this.xp = miner.xp;
    this.timestamp = miner.timestamp;
    this.resource_number = miner.rcs;
  }
}
