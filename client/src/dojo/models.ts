import { ContractComponents } from "./contractModels";
import { Player } from "./game/models/player";
import { Miner } from "./game/models/miner";

export type ClientModels = ReturnType<typeof models>;

export function models({
  contractModels,
}: {
  contractModels: ContractComponents;
}) {
  return {
    models: {
      ...contractModels,
    },
    classes: {
      Player,
      Miner,
    },
  };
}
