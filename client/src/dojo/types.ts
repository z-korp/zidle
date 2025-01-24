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

// Type definition for `zidle::events::index::Mine` struct
export interface Mine {
  token_id: string;
  rcs_type: number;
  rcs_sub_type: number;
}

// Type definition for `zidle::events::index::Harvest` struct
export interface Harvest {
  token_id: string;
  rcs_type: number;
  rcs_sub_type: number;
  amount: number;
  xp: number;
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
export interface SchemaType {
  zidle?: {
    // Mining event containing token ID and resource information
    Mine?: Mine;
    // Harvesting event containing token ID, amount, and experience gained
    Harvest?: Harvest;
  };
  [key: string]: any;
}
