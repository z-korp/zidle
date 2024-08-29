import { ComponentValue } from "@dojoengine/recs";
import { shortString } from "starknet";

export class Player {
  public token_id: string;
  public name: string;
  public gold: number;

  constructor(player: ComponentValue) {
    this.token_id = player.token_id;
    this.name = shortString.decodeShortString(player.name);
    this.gold = player.gold;
  }
}
