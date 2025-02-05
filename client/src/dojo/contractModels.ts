import { defineComponent, Type as RecsType, World } from "@dojoengine/recs";

const VITE_PUBLIC_NAMESPACE = "zidle";

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
        },
        {
          metadata: {
            namespace: VITE_PUBLIC_NAMESPACE,
            name: "Player",
            types: ["u128", "felt252"],
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
            namespace: VITE_PUBLIC_NAMESPACE,
            name: "Miner",
            types: [
              "u128",
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
    Arena: (() => {
      return defineComponent(
        world,
        {
          id: RecsType.Number,
          token_id_1: RecsType.BigInt,
          token_id_2: RecsType.BigInt,
          is_set: RecsType.Boolean,
          goal1: {
            goal_type: RecsType.Number,
            first_validation: RecsType.Number,
            second_validation: RecsType.Number,
          },
          goal2: {
            goal_type: RecsType.Number,
            first_validation: RecsType.Number,
            second_validation: RecsType.Number,
          },
          goal3: {
            goal_type: RecsType.Number,
            first_validation: RecsType.Number,
            second_validation: RecsType.Number,
          },
          team1_points: RecsType.Number,
          team2_points: RecsType.Number,
        },
        {
          metadata: {
            namespace: VITE_PUBLIC_NAMESPACE,
            name: "Arena",
            types: [
              "u32",
              "u128",
              "u128",
              "bool",
              "u32",
              "u32",
              "u32",

              "u32",
              "u32",
              "u32",

              "u32",
              "u32",
              "u32",

              "u32",
              "u32",
            ],
            customTypes: ["Team", "GoalType"],
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
          amount: RecsType.BigInt,
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
    ERC721Wallet: (() => {
      return defineComponent(
        world,
        {
          token: RecsType.BigInt,
          token_id: RecsType.Number,
          address: RecsType.BigInt,
        },
        {
          metadata: {
            name: "zidle-ERC721WalletModel",
            types: ["felt252", "u128", "felt252"],
            customTypes: [],
          },
        },
      );
    })(),
  };
}
