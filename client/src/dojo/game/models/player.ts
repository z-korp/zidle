import { ComponentValue } from "@dojoengine/recs";
import { shortenHex } from "@dojoengine/utils";
import { shortString } from "starknet";

export class Player {
  public id: string;
  public name: string;
  public gold: number;

  constructor(player: ComponentValue) {
    this.id = player.id;
    this.name = shortString.decodeShortString(player.name);
    this.gold = player.gold;
  }

  public getShortAddress(): string {
    return shortenHex(this.id);
  }
}
