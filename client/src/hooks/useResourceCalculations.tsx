// hooks/useResourceCalculations.ts
import { useState, useEffect } from "react";
import { Resource } from "@/dojo/game/types/resource";
import { Character } from "@/types/types";
import { getLevelFromXp } from "@/utils/level";

export const useResourceCalculations = (
  selectedResource: Resource,
  character: Character,
  amountProduced: number,
) => {
  const [secondsPerResource, setSecondsPerResource] = useState(1);
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    const resourceType = selectedResource.getName();
    let xp = 1;
    let seconds = 1;

    switch (resourceType) {
      case "Wood":
        xp = selectedResource.baseXp()
        seconds = selectedResource.calculateGatheringDurationPerUnit(
          getLevelFromXp(character.woodProgress),
        );
        break;
      case "Mineral":
        xp = selectedResource.baseXp();
        seconds = selectedResource.calculateGatheringDurationPerUnit(
          getLevelFromXp(character.rockProgress),
        );
        break;
      case "Food":
        xp = selectedResource.baseXp();
        seconds = selectedResource.calculateGatheringDurationPerUnit(
          getLevelFromXp(character.forgeProgress),
        );
        break;
    }
    setSecondsPerResource(seconds);
    setTotalXP(amountProduced * xp);
  }, [selectedResource, character, amountProduced]);

  return { secondsPerResource, totalXP };
};
