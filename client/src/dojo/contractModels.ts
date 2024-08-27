import { defineComponent, Type as RecsType, World } from "@dojoengine/recs";

export type ContractComponents = Awaited<
  ReturnType<typeof defineContractComponents>
>;

export function defineContractComponents(world: World) {
  return {
    Player: (() => {
      return defineComponent(
        world,
        {
          id: RecsType.BigInt,
          name: RecsType.BigInt,
        },
        {
          metadata: {
            name: "zidle-Player",
            types: ["felt252", "felt252"],
            customTypes: [],
          },
        },
      );
    })(),
    Miner: (() => {
      return defineComponent(
        world,
        {
          id: RecsType.BigInt,
          resource_type: RecsType.Number,
          subresource_type: RecsType.Number,
          xp: RecsType.Number,
          timestamp: RecsType.Number,
          rcs1: RecsType.Number,
          rcs2: RecsType.Number,
          rcs3: RecsType.Number,
          rcs4: RecsType.Number,
          rcs5: RecsType.Number,
          rcs6: RecsType.Number,
          rcs7: RecsType.Number,
        },
        {
          metadata: {
            name: "zidle-Miner",
            types: [
              "felt252",
              "u8",
              "u64",
              "u64",
              "u8",
              "u64",
              "u64",
              "u64",
              "u64",
              "u64",
              "u64",
              "u64",
            ],
            customTypes: [],
          },
        },
      );
    })(),
  };
}
