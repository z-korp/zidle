import { useDojo } from "@/dojo/useDojo";
import { useMemo } from "react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";

export const usePlayer = ({ tokenId }: { tokenId: string | undefined }) => {
  const {
    setup: {
      clientModels: {
        models: { Player },
        classes: { Player: PlayerClass },
      },
    },
  } = useDojo();

  const playerKey = useMemo(
    () => getEntityIdFromKeys([BigInt(tokenId ? tokenId : -1)]) as Entity,
    [tokenId],
  );
  const component = useComponentValue(Player, playerKey);
  const player = useMemo(() => {
    return component ? new PlayerClass(component) : null;
  }, [component]);

  return { player, playerKey };
};
