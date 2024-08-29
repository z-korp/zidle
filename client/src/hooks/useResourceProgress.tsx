// hooks/useResourceProgress.ts
import { useState, useEffect, useRef } from "react";
import { Resource } from "@/dojo/game/types/resource";
import { getLevelFromXp } from "@/utils/level";
import { Character } from "./useCharacter";

export const useResourceProgress = (
  selectedResource: Resource,
  character: Character,
) => {
  const [progress, setProgress] = useState(0);
  const [amountProduced, setAmountProduced] = useState(0);
  const [showSparkle, setShowSparkle] = useState(false);
  const startTimeRef = useRef(Date.now());
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const secondsPerResource = calculateSecondsPerResource(
      selectedResource,
      character,
    );

    const updateProgress = () => {
      const currentTime = Date.now();
      const elapsedTime = (currentTime - startTimeRef.current) / 1000;

      const newProgress =
        ((elapsedTime % secondsPerResource) / secondsPerResource) * 100;
      const newAmountProduced = Math.floor(elapsedTime / secondsPerResource);

      if (newProgress >= 100) {
        setProgress(0);
        setShowSparkle(true);
        setTimeout(() => setShowSparkle(false), 1000);
      } else {
        setProgress(newProgress);
      }

      setAmountProduced(newAmountProduced);

      animationFrameRef.current = requestAnimationFrame(updateProgress);
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [selectedResource, character]);

  return { progress, amountProduced, showSparkle };
};

function calculateSecondsPerResource(
  selectedResource: Resource,
  character: Character,
): number {
  const resourceType = selectedResource.getName();
  switch (resourceType) {
    case "Wood":
      return selectedResource.calculateGatheringDurationPerUnit(
        getLevelFromXp(character.woodProgress),
      );
    case "Mineral":
      return selectedResource.calculateGatheringDurationPerUnit(
        getLevelFromXp(character.rockProgress),
      );
    case "Food":
      return selectedResource.calculateGatheringDurationPerUnit(
        getLevelFromXp(character.forgeProgress),
      );
    default:
      return 1;
  }
}
