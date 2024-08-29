import { useDojo } from "@/dojo/useDojo";
import { useEffect, useMemo, useState } from "react";
import { useEntityQuery } from "@dojoengine/react";
import {
  ComponentValue,
  getComponentValue,
  Has,
  HasValue,
} from "@dojoengine/recs";

export const useMiners = ({ tokenId }: { tokenId: string | undefined }) => {
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
    HasValue(Miner, { id: BigInt(tokenId ? tokenId : -1) }),
  ]);

  useEffect(() => {
    const components = minerKeys.map((entity) => {
      const component = getComponentValue(Miner, entity);
      if (!component) {
        return undefined;
      }
      return component;
    });
    setMiners(
      components
        .filter((component) => component !== undefined)
        .map((component) => new MinerClass(component as ComponentValue)),
    );
  }, [minerKeys]);

  const currentMiner = useMemo(() => {
    return miners.find((miner) => miner.timestamp !== 0);
  }, [miners]);

  return { miners, currentMiner };
};
