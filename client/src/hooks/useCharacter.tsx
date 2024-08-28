import { useMemo } from "react";
import { usePlayer } from "./usePlayer";
import { useMiners } from "./useMiners";
import { Resource, ResourceType } from "@/dojo/game/types/resource";
import { Miner } from "@/dojo/game/models/miner";

export interface Character {
  id: string;
  name: string;
  gold: number;
  startTimestamp: number;
  miningRessource: Resource | null
  miners: Miner[];
  woodProgress: number;
  rockProgress: number;
  foodProgress: number;
}

export const useCharacter = (playerId: string | undefined) => {
  const { player } = usePlayer({ playerId });
  const { miners } = useMiners({ playerId });

  const { character, currentMiner } = useMemo(() => {
    if (!player) return { character: null, currentMiner: null };

    const woodMiner = miners.find(miner => miner.resource.value === ResourceType.Wood);
    const rockMiner = miners.find(miner => miner.resource.value === ResourceType.Mineral);
    const foodMiner = miners.find(miner => miner.resource.value === ResourceType.Food);

    const activeMiner = miners.find(miner => miner.timestamp !== 0);

    const characterData: Character = {
      id: player.id,
      name: player.name,
      gold: player.gold,
      woodProgress: woodMiner ? woodMiner.xp : 0,
      rockProgress: rockMiner ? rockMiner.xp : 0,
      foodProgress: foodMiner ? foodMiner.xp : 0,
      startTimestamp: activeMiner? activeMiner.timestamp : 0,
      miningRessource: activeMiner? activeMiner.resource : null,
      miners:miners,
    };

    return { 
      character: characterData
    };
  }, [player, miners]);

  return { character };
};