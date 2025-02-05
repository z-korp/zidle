import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

type WithFieldOrder<T> = T & { fieldOrder: string[] };

// Type definition for `dojo::meta::layout::FieldLayout` struct
export interface FieldLayout {
  selector: string;
  layout: Layout;
}

// Type definition for `dojo::meta::introspect::Enum` struct
export interface Enum {
  name: string;
  attrs: string[];
  children: [string, Ty][];
}

// Type definition for `zidle::models::player::PlayerValue` struct
export interface PlayerValue {
  name: string;
}

// Type definition for `dojo::model::definition::ModelDef` struct
export interface ModelDef {
  name: string;
  layout: Layout;
  schema: Struct;
  packed_size: Option<number>;
  unpacked_size: Option<number>;
}

// Type definition for `dojo::meta::introspect::Member` struct
export interface Member {
  name: string;
  attrs: string[];
  ty: Ty;
}

// Type definition for `dojo::meta::introspect::Struct` struct
export interface Struct {
  name: string;
  attrs: string[];
  children: Member[];
}

// Type definition for `zidle::models::player::Player` struct
export interface Player {
  token_id: string;
  name: string;
}

// Type definition for `core::byte_array::ByteArray` struct
export interface ByteArray {
  data: string[];
  pending_word: string;
  pending_word_len: number;
}

// Type definition for `dojo::meta::introspect::Ty` enum
type Ty =
  | { type: "Primitive"; data: string }
  | { type: "Struct"; data: Struct }
  | { type: "Enum"; data: Enum }
  | { type: "Tuple"; data: Ty[] }
  | { type: "Array"; data: Ty[] }
  | { type: "ByteArray" };
// Type definition for `dojo::meta::layout::Layout` enum
type Layout =
  | { type: "Fixed"; data: number[] }
  | { type: "Struct"; data: FieldLayout[] }
  | { type: "Tuple"; data: Layout[] }
  | { type: "Array"; data: Layout[] }
  | { type: "ByteArray" }
  | { type: "Enum"; data: FieldLayout[] };
// Type definition for `core::option::Option::<core::integer::u32>` enum
type Option<A> = { type: "Some"; data: A } | { type: "None" };

// Type definition for `zidle::models::char::CharValue` struct
export interface CharValue {
  name: string;
}

// Type definition for `zidle::models::char::Char` struct
export interface Char {
  id: string;
  token_id: bigint;
  name: string;
}

// Type definition for `core::integer::u256` struct
export interface U256 {
  low: bigint;
  high: bigint;
}

// Type definition for `zidle::models::token_config::TokenConfig` struct
export interface TokenConfig {
  token_address: string;
  max_supply: U256;
  minted_count: U256;
  max_per_wallet: U256;
  is_open: boolean;
}

// Type definition for `zidle::models::token_config::TokenConfigValue` struct
export interface TokenConfigValue {
  max_supply: U256;
  minted_count: U256;
  max_per_wallet: U256;
  is_open: boolean;
}

// Type definition for `zidle::models::admin::AdminValue` struct
export interface AdminValue {
  is_set: boolean;
}

// Type definition for `zidle::models::admin::Admin` struct
export interface Admin {
  id: string;
  is_set: boolean;
}

// Type definition for `zidle::models::settings::Settings` struct
export interface Settings {
  id: number;
  gold_erc20_address: string;
  character_erc721_address: string;
  is_set: boolean;
}

// Type definition for `zidle::models::settings::SettingsValue` struct
export interface SettingsValue {
  gold_erc20_address: string;
  character_erc721_address: string;
  is_set: boolean;
}

// Type definition for `zidle::models::miner::MinerValue` struct
export interface MinerValue {
  xp: bigint;
  timestamp: bigint;
  subresource_type: number;
  rcs_1: bigint;
  rcs_2: bigint;
  rcs_3: bigint;
  rcs_4: bigint;
  rcs_5: bigint;
  rcs_6: bigint;
  rcs_7: bigint;
}

// Type definition for `zidle::models::miner::Miner` struct
export interface Miner {
  token_id: bigint;
  resource_type: number;
  xp: bigint;
  timestamp: bigint;
  subresource_type: number;
  rcs_1: bigint;
  rcs_2: bigint;
  rcs_3: bigint;
  rcs_4: bigint;
  rcs_5: bigint;
  rcs_6: bigint;
  rcs_7: bigint;
}

// Type definition for `zidle::events::index::Mine` struct
export interface Mine {
  token_id: bigint;
  rcs_type: number;
  rcs_sub_type: number;
  timestamp: number;
}

// Type definition for `zidle::events::index::Harvest` struct
export interface Harvest {
  token_id: bigint;
  rcs_type: number;
  rcs_sub_type: number;
  amount: number;
  xp: number;
  timestamp: number;
}

// Type definition for `zidle::events::index::Harvest` struct
export interface Sell {
  token_id: bigint;
  rcs_type: number;
  rcs_sub_type: number;
  amount: number;
  gold: number;
  timestamp: number;
}

export const schema: SchemaType = {
  zidle: {
    Mine: {
      fieldOrder: ["token_id", "rcs_type", "rcs_sub_type", "timestamp"],
      token_id: 0n,
      rcs_type: 0,
      rcs_sub_type: 0,
      timestamp: 0,
    },
    Harvest: {
      fieldOrder: [
        "token_id",
        "rcs_type",
        "rcs_sub_type",
        "amount",
        "xp",
        "timestamp",
      ],
      token_id: 0n,
      rcs_type: 0,
      rcs_sub_type: 0,
      amount: 0,
      xp: 0,
      timestamp: 0,
    },
    Sell: {
      fieldOrder: [
        "token_id",
        "rcs_type",
        "rcs_sub_type",
        "amount",
        "gold",
        "timestamp",
      ],
      token_id: 0n,
      rcs_type: 0,
      rcs_sub_type: 0,
      amount: 0,
      gold: 0,
      timestamp: 0,
    },
  },
};

/**
 * Main schema type for game events
 * This defines the structure of events we receive from the blockchain
 *
 * zidle: The game's namespace
 * Mine: Mining event data
 * Harvest: Harvesting event data
 *
 * [key: string]: any - Allows for additional properties
 */
export interface SchemaType extends ISchemaType {
  zidle: {
    Mine: WithFieldOrder<Mine>;
    Harvest: WithFieldOrder<Harvest>;
    Sell: WithFieldOrder<Sell>;
  };
  [key: string]: any;
}

interface ParsedMine {
  type: "Mine";
  tokenId: number;
  rcsType: number;
  rcsSubType: number;
  timestamp: number;
}

interface ParsedHarvest {
  type: "Harvest";
  tokenId: number;
  rcsType: number;
  rcsSubType: number;
  amount: number;
  xp: number;
  timestamp: number;
}

interface ParsedSell {
  type: "Sell";
  tokenId: number;
  rcsType: number;
  rcsSubType: number;
  amount: number;
  gold: number;
  timestamp: number;
}

export type ParsedGameEvent = ParsedMine | ParsedHarvest | ParsedSell;
