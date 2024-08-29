import { useState, useRef, useEffect } from "react";
import { Resource } from "@/dojo/game/types/resource";
import { Character } from "./useCharacter";
import { calculateResourceGain } from "@/utils/resource";

export const useResourceProgress = (
  selectedResource: Resource,
  character: Character,
) => {
  const [progress, setProgress] = useState(0);
  const [amountProduced, setAmountProduced] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [showSparkle, setShowSparkle] = useState(false);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const updateProgress = () => {
      const currentMiner = character.miners.find(miner => miner.timestamp !== 0);
      if (currentMiner?.resource) {
      const { progress: newProgress, resourcesGained: newAmountProduced, totalXP: newTotalXP } = calculateResourceGain(
        selectedResource,
        character,
        character.startTimestamp
      );
    

      setProgress(newProgress);
      setAmountProduced(newAmountProduced);
      setTotalXP(newTotalXP);

      if (newProgress >= 99) {
        setShowSparkle(true);
        setTimeout(() => setShowSparkle(false), 1000);
        setProgress(0);
      }

      animationFrameRef.current = requestAnimationFrame(updateProgress);
    }
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [selectedResource, character]);

  return { progress, amountProduced, totalXP, showSparkle };
};