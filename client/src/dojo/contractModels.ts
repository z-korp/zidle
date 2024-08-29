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
          token_id: RecsType.BigInt,
          name: RecsType.BigInt,
          gold: RecsType.Number,
        },
        {
          metadata: {
            name: "zidle-Player",
            types: ["felt252", "felt252", "u64"],
            customTypes: [],
          },
        },
      );
    })(),
    Miner: (() => {
      return defineComponent(
        world,
        {
          token_id: RecsType.BigInt,
          resource_type: RecsType.Number,
          xp: RecsType.Number,
          timestamp: RecsType.Number,
          subresource_type: RecsType.Number,
          rcs_1: RecsType.Number,
          rcs_2: RecsType.Number,
          rcs_3: RecsType.Number,
          rcs_4: RecsType.Number,
          rcs_5: RecsType.Number,
          rcs_6: RecsType.Number,
          rcs_7: RecsType.Number,
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
    ERC721Balance: (() => {
      return defineComponent(
        world,
        {
          token: RecsType.BigInt,
          account: RecsType.BigInt,
          amount: RecsType.Number,
        },
        {
          metadata: {
            name: "origami_token-ERC721BalanceModel",
            types: ["felt252", "felt252", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    ERC20Balance: (() => {
      return defineComponent(
        world,
        {
          token: RecsType.BigInt,
          account: RecsType.BigInt,
          amount: RecsType.Number,
        },
        {
          metadata: {
            name: "origami_token-ERC20BalanceModel",
            types: ["felt252", "felt252", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
    ERC721Owner: (() => {
      return defineComponent(
        world,
        {
          token: RecsType.BigInt,
          token_id: RecsType.Number,
          address: RecsType.BigInt,
        },
        {
          metadata: {
            name: "origami_token-ERC721OwnerModel",
            types: ["felt252", "u128", "felt252"],
            customTypes: [],
          },
        },
      );
    })(),
    ERC721EnumerableOwnerIndex: (() => {
      return defineComponent(
        world,
        {
          token: RecsType.BigInt,
          owner: RecsType.BigInt,
          index: RecsType.Number,
          token_id: RecsType.Number,
        },
        {
          metadata: {
            name: "origami_token-ERC721EnumerableOwnerIndexModel",
            types: ["felt252", "felt252", "u128", "u128"],
            customTypes: [],
          },
        },
      );
    })(),
  };
}
