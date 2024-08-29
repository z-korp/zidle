import { useMemo } from "react";
import { usePlayer } from "./usePlayer";
import { useMiners } from "./useMiners";
import { Resource, ResourceType } from "@/dojo/game/types/resource";
import { Miner } from "@/dojo/game/models/miner";
import { useGolds } from "./useGolds";

export interface Character {
  token_id: string;
  name: string;
  gold: number;
  startTimestamp: number;
  miningRessource: Resource | null;
  miners: Miner[];
  woodProgress: number;
  rockProgress: number;
  foodProgress: number;
  walletAddress: string;
}

export const useCharacter = (tokenId: string) => {
  const { player } = usePlayer({ tokenId });
  const { miners } = useMiners({ tokenId });
  const { goldBalance, walletAddress } = useGolds(tokenId);

  const { character } = useMemo(() => {
    if (!player) {
      return {
        character: null,
      };
    }
    const woodMiner = miners.find(
      (miner) => miner.resource.value === ResourceType.Wood,
    );
    const rockMiner = miners.find(
      (miner) => miner.resource.value === ResourceType.Mineral,
    );
    const foodMiner = miners.find(
      (miner) => miner.resource.value === ResourceType.Food,
    );

    const activeMiner = miners.find((miner) => miner.timestamp !== 0);

    const characterData: Character = {
      token_id: tokenId,
      name: player.name,
      gold: goldBalance,
      woodProgress: woodMiner ? woodMiner.xp : 0,
      rockProgress: rockMiner ? rockMiner.xp : 0,
      foodProgress: foodMiner ? foodMiner.xp : 0,
      startTimestamp: activeMiner ? activeMiner.timestamp : 0,
      miningRessource: activeMiner ? activeMiner.resource : null,
      miners: miners,
      walletAddress: walletAddress ? walletAddress : "",
    };

    return {
      character: characterData,
    };
  }, [player, miners, goldBalance, walletAddress]);

  return { character };
};
