// hooks/useResourceCalculations.ts
import { useState, useEffect } from 'react';
import { Resource } from "@/dojo/game/types/resource";
import { Character } from "@/types/types";
import { getLevelFromXp } from "@/utils/level";

export const useResourceCalculations = (selectedResource: Resource, character: Character, amountProduced: number) => {
  const [secondsPerResource, setSecondsPerResource] = useState(1);
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    const resourceType = selectedResource.getName();
    let xp = 1;
    let seconds = 1;

    switch (resourceType) {
      case "Wood":
        xp = selectedResource.calculateXp(getLevelFromXp(character.woodProgress));
        seconds = selectedResource.calculateGatheringSpeed(getLevelFromXp(character.woodProgress));
        break;
      case "Mineral":
        xp = selectedResource.calculateXp(getLevelFromXp(character.rockProgress));
        seconds = selectedResource.calculateGatheringSpeed(getLevelFromXp(character.rockProgress));
        break;
      case "Food":
        xp = selectedResource.calculateXp(getLevelFromXp(character.forgeProgress));
        seconds = selectedResource.calculateGatheringSpeed(getLevelFromXp(character.forgeProgress));
        break;
    }
    setSecondsPerResource(seconds);
    setTotalXP(amountProduced * xp);
  }, [selectedResource, character, amountProduced]);

  return { secondsPerResource, totalXP };
};