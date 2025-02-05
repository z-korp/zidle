import { useDojo } from "@/dojo/useDojo";
import { useMemo } from "react";
import { useEntityQuery } from "@dojoengine/react";
import { getComponentValue, Has, HasValue } from "@dojoengine/recs";

export const useArenas = ({ tokenId }: { tokenId: string | undefined }) => {
  const {
    setup: {
      clientModels: {
        models: { Arena },
        classes: { Arena: ArenaClass },
      },
    },
  } = useDojo();

  const minerKeys1 = useEntityQuery([
    Has(Arena),
    HasValue(Arena, { token_id_1: BigInt(tokenId ? tokenId : -1) }),
  ]);
  const minerKeys2 = useEntityQuery([
    Has(Arena),
    HasValue(Arena, { token_id_2: BigInt(tokenId ? tokenId : -1) }),
  ]);

  const minerKeys = useMemo(() => {
    return [...minerKeys1, ...minerKeys2];
  }, [minerKeys1, minerKeys2]);

  // Memoize the arenas so that they are re-calculated only when minerKeys (or the models) change.
  const arenas = useMemo(() => {
    const components = minerKeys.map((entity) => {
      const component = getComponentValue(Arena, entity);
      if (!component) {
        return undefined;
      }
      return component;
    });

    return components
      .filter((component) => component !== undefined)
      .map((component) => new ArenaClass(component));
  }, [minerKeys, Arena, ArenaClass]);

  return { arenas };
};
