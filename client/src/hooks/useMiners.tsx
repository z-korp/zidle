import { useDojo } from "@/dojo/useDojo";
import { useEffect, useMemo, useState } from "react";
import { useEntityQuery } from "@dojoengine/react";
import {
  ComponentValue,
  getComponentValue,
  Has,
  HasValue,
} from "@dojoengine/recs";
import { useGoalStore } from "@/stores/useGoalStore";
import { WoodType } from "@/dojo/game/elements/resources/wood";
import { FoodType } from "@/dojo/game/elements/resources/food";

export const useMiners = ({ tokenId }: { tokenId: string | undefined }) => {
  const {
    setup: {
      clientModels: {
        models: { Miner },
        classes: { Miner: MinerClass },
      },
    },
  } = useDojo();

  const { setBerriesAmount, setPineAmount } = useGoalStore();

  type MinerInstance = InstanceType<typeof MinerClass>;

  const [miners, setMiners] = useState<MinerInstance[]>([]);

  const minerKeys = useEntityQuery([
    Has(Miner),
    HasValue(Miner, { token_id: BigInt(tokenId ? tokenId : -1) }),
  ]);

  useEffect(() => {
    const components = minerKeys.map((entity) => {
      const component = getComponentValue(Miner, entity);
      if (!component) return undefined;
      return component;
    });

    setMiners(
      components
        .filter((component) => component !== undefined)
        .map((component) => new MinerClass(component as ComponentValue)),
    );
  }, [minerKeys]);

  useEffect(() => {
    if (miners.length === 0) return;

    let totalBerries = 0;
    let totalPine = 0;

    miners.forEach((miner) => {
      miner.inventory.forEach((item) => {
        if (item.rcs.getSubresourceType() === WoodType.Pine) {
          totalPine += item.quantity;
        }
        if (item.rcs.getSubresourceType() === FoodType.Berries) {
          totalBerries += item.quantity;
        }
      });
    });

    setBerriesAmount(totalBerries);
    setPineAmount(totalPine);
  }, [miners, setBerriesAmount, setPineAmount]);

  const currentMiner = useMemo(() => {
    return miners.find((miner) => miner.timestamp !== 0);
  }, [miners]);

  return { miners, currentMiner };
};
