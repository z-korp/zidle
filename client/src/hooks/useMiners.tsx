import { useDojo } from "@/dojo/useDojo";
import { useEffect, useMemo, useState } from "react";
import { useEntityQuery } from "@dojoengine/react";
import { getComponentValue, Has, HasValue } from "@dojoengine/recs";

export const useMiners = ({ playerId }: { playerId: string | undefined }) => {
  const {
    setup: {
      clientModels: {
        models: { Miner },
        classes: { Miner: MinerClass },
      },
    },
  } = useDojo();

  type MinerInstance = InstanceType<typeof MinerClass>;

  const [miners, setMiners] = useState<MinerInstance[]>([]);

  const minerKeys = useEntityQuery([
    Has(Miner),
    HasValue(Miner, { id: BigInt(playerId ? playerId : -1) }),
  ]);

  useEffect(() => {
    const components = minerKeys.map((entity) => {
      const component = getComponentValue(Miner, entity);
      if (!component) {
        return undefined;
      }
      return new MinerClass(component);
    });
    setMiners(
      components
        .filter((component) => component !== undefined)
        .map((component) => new MinerClass(component)),
    );
  }, [minerKeys]);

  const currentMiner = useMemo(() => {
    return miners.find((miner) => miner.timestamp !== 0);
  }, [miners]);

  return { miners, currentMiner };
};
