import { useMemo } from "react";
import { usePlayer } from "./usePlayer";
import { useMiners } from "./useMiners";
import { ResourceType } from "@/dojo/game/types/resource";

export interface Character {
  id: string;
  name: string;
//   playerXp: number;
//   health: number;
//   attack: number;
//   critical: number;
  woodProgress: number;
  rockProgress: number;
  foodProgress: number;
}

export const useCharacter = (playerId: string | undefined) => {
  const { player } = usePlayer({ playerId });
  const { miners } = useMiners({ playerId });

  const character: Character | null = useMemo(() => {
    if (!player) return null;

    // const totalXp = miners.reduce((sum, miner) => sum + miner.xp, 0);
    const woodMiner = miners.find(miner => miner.resource.value === ResourceType.Wood);
    const rockMiner = miners.find(miner => miner.resource.value === ResourceType.Mineral);
    const foodMiner = miners.find(miner => miner.resource.value === ResourceType.Food)

    return {
      id: player.id,
      name: player.name,
    //   playerXp: totalXp,
    //   health: 100, // Vous pouvez ajuster cela en fonction de votre logique de jeu
    //   attack: Math.floor(totalXp / 100), // Exemple de calcul, ajustez selon vos besoins
    //   critical: Math.min(20, Math.floor(totalXp / 1000)), // Exemple de calcul avec un maximum de 20%
      woodProgress: woodMiner ? woodMiner.xp : 0,
      rockProgress: rockMiner ? rockMiner.xp : 0,
      foodProgress: foodMiner? foodMiner.xp : 0, // Vous devrez peut-être ajouter une logique pour calculer cela
    };
  }, [player, miners]);

  return { character };
};