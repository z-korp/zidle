import { Resource, ResourceType } from "@/dojo/game/types/resource";
import { Character } from "@/hooks/useCharacter";
import { getLevelFromXp } from "@/utils/level";
import wood from "/assets/wood2.png";
import rock from "/assets/rock2.png";
import food from "/assets/food.png"

export function calculateResourceGain(
  resource: Resource,
  character: Character,
  startTimestamp: number
) {
  const secondsPerResource = calculateSecondsPerResource(resource, character);
  const timePassed = Date.now() - startTimestamp * 1000;
  const resourcesGained = Math.floor(timePassed / 1000 / secondsPerResource);
  const xpPerResource = resource.getSubresource().baseXp();
  const totalXP = resourcesGained * xpPerResource;

  return {
    timePassed,
    resourcesGained,
    totalXP,
    progress: (timePassed / 1000 % secondsPerResource) / secondsPerResource * 100
  };
}

export const getResourceImage = (type: ResourceType) => {
    switch (type) {
      case ResourceType.Wood:
        return wood;
      case ResourceType.Mineral:
        return rock;
      case ResourceType.Food:
        return food;
      default:
        return undefined;
    }
  };

export function calculateSecondsPerResource(
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
        getLevelFromXp(character.foodProgress),
      );
    default:
      return 1;
  }
}

export function formatTimePassed(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  return `${seconds} second${seconds > 1 ? 's' : ''}`;
}