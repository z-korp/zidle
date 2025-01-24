import { Resource } from "@/dojo/game/types/resource";
import { ParsedGameEvent } from "@/dojo/types";
import { ParsedEntity, SchemaType } from "@dojoengine/sdk";

export const eventToString = (event: ParsedGameEvent): string => {
  if (event.type === "Mine") {
    const rcs = Resource.from(event.rcsType, event.rcsSubType);
    return `Start mining ${rcs.getSubresourceName()}`;
  } else if (event.type === "Harvest") {
    const rcs = Resource.from(event.rcsType, event.rcsSubType);
    return `Harvested ${event.amount} ${rcs.getSubresourceName()} (+${event.xp} XP)`;
  }
  return "Unknown event";
};

/**
 * Utility function to convert bigint to number safely
 */
const bigintToNumber = (value: bigint): number => {
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
    console.warn(
      "BigInt value exceeds Number.MAX_SAFE_INTEGER. Precision may be lost.",
    );
  }
  return Number(value);
};

export const parseGameEvent = (
  e: ParsedEntity<SchemaType>,
): ParsedGameEvent | undefined => {
  if (!e.models.zidle) return undefined;

  const { Mine, Harvest } = e.models.zidle;

  if (Mine) {
    // Check if all required fields are present
    if (
      Mine.token_id !== undefined &&
      Mine.rcs_type !== undefined &&
      Mine.rcs_sub_type !== undefined &&
      Mine.timestamp !== undefined
    ) {
      return {
        type: "Mine",
        tokenId: bigintToNumber(Mine.token_id),
        rcsType: Mine.rcs_type,
        rcsSubType: Mine.rcs_sub_type,
        timestamp: Mine.timestamp,
      };
    }
  }

  if (Harvest) {
    // Check if all required fields are present
    if (
      Harvest.token_id !== undefined &&
      Harvest.rcs_type !== undefined &&
      Harvest.rcs_sub_type !== undefined &&
      Harvest.amount !== undefined &&
      Harvest.xp !== undefined &&
      Harvest.timestamp !== undefined
    ) {
      return {
        type: "Harvest",
        tokenId: bigintToNumber(Harvest.token_id),
        rcsType: Harvest.rcs_type,
        rcsSubType: Harvest.rcs_sub_type,
        amount: Harvest.amount,
        xp: Harvest.xp,
        timestamp: Harvest.timestamp,
      };
    }
  }

  return undefined;
};
