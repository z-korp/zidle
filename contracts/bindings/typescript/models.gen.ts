import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import { BigNumberish } from 'starknet';

type WithFieldOrder<T> = T & { fieldOrder: string[] };

// Type definition for `zidle::models::admin::Admin` struct
export interface Admin {
	id: BigNumberish;
	is_set: boolean;
}

// Type definition for `zidle::models::admin::AdminValue` struct
export interface AdminValue {
	is_set: boolean;
}

// Type definition for `zidle::models::char::Char` struct
export interface Char {
	id: BigNumberish;
	token_id: BigNumberish;
	name: BigNumberish;
}

// Type definition for `zidle::models::char::CharValue` struct
export interface CharValue {
	name: BigNumberish;
}

// Type definition for `zidle::models::miner::Miner` struct
export interface Miner {
	token_id: BigNumberish;
	resource_type: BigNumberish;
	xp: BigNumberish;
	timestamp: BigNumberish;
	subresource_type: BigNumberish;
	rcs_1: BigNumberish;
	rcs_2: BigNumberish;
	rcs_3: BigNumberish;
	rcs_4: BigNumberish;
	rcs_5: BigNumberish;
	rcs_6: BigNumberish;
	rcs_7: BigNumberish;
}

// Type definition for `zidle::models::miner::MinerValue` struct
export interface MinerValue {
	xp: BigNumberish;
	timestamp: BigNumberish;
	subresource_type: BigNumberish;
	rcs_1: BigNumberish;
	rcs_2: BigNumberish;
	rcs_3: BigNumberish;
	rcs_4: BigNumberish;
	rcs_5: BigNumberish;
	rcs_6: BigNumberish;
	rcs_7: BigNumberish;
}

// Type definition for `zidle::models::player::Player` struct
export interface Player {
	token_id: BigNumberish;
	name: BigNumberish;
}

// Type definition for `zidle::models::player::PlayerValue` struct
export interface PlayerValue {
	name: BigNumberish;
}

// Type definition for `zidle::models::settings::Settings` struct
export interface Settings {
	id: BigNumberish;
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

// Type definition for `zidle::models::token_config::TokenConfig` struct
export interface TokenConfig {
	token_address: string;
	max_supply: BigNumberish;
	minted_count: BigNumberish;
	max_per_wallet: BigNumberish;
	is_open: boolean;
}

// Type definition for `zidle::models::token_config::TokenConfigValue` struct
export interface TokenConfigValue {
	max_supply: BigNumberish;
	minted_count: BigNumberish;
	max_per_wallet: BigNumberish;
	is_open: boolean;
}

// Type definition for `zidle::events::index::Harvest` struct
export interface Harvest {
	token_id: BigNumberish;
	rcs_type: BigNumberish;
	rcs_sub_type: BigNumberish;
	amount: BigNumberish;
	xp: BigNumberish;
}

// Type definition for `zidle::events::index::HarvestValue` struct
export interface HarvestValue {
	rcs_type: BigNumberish;
	rcs_sub_type: BigNumberish;
	amount: BigNumberish;
	xp: BigNumberish;
}

// Type definition for `zidle::events::index::Mine` struct
export interface Mine {
	token_id: BigNumberish;
	rcs_type: BigNumberish;
	rcs_sub_type: BigNumberish;
}

// Type definition for `zidle::events::index::MineValue` struct
export interface MineValue {
	rcs_type: BigNumberish;
	rcs_sub_type: BigNumberish;
}

export interface SchemaType extends ISchemaType {
	zidle: {
		Admin: WithFieldOrder<Admin>,
		AdminValue: WithFieldOrder<AdminValue>,
		Char: WithFieldOrder<Char>,
		CharValue: WithFieldOrder<CharValue>,
		Miner: WithFieldOrder<Miner>,
		MinerValue: WithFieldOrder<MinerValue>,
		Player: WithFieldOrder<Player>,
		PlayerValue: WithFieldOrder<PlayerValue>,
		Settings: WithFieldOrder<Settings>,
		SettingsValue: WithFieldOrder<SettingsValue>,
		TokenConfig: WithFieldOrder<TokenConfig>,
		TokenConfigValue: WithFieldOrder<TokenConfigValue>,
		Harvest: WithFieldOrder<Harvest>,
		HarvestValue: WithFieldOrder<HarvestValue>,
		Mine: WithFieldOrder<Mine>,
		MineValue: WithFieldOrder<MineValue>,
	},
}
export const schema: SchemaType = {
	zidle: {
		Admin: {
			fieldOrder: ['id', 'is_set'],
			id: 0,
			is_set: false,
		},
		AdminValue: {
			fieldOrder: ['is_set'],
			is_set: false,
		},
		Char: {
			fieldOrder: ['id', 'token_id', 'name'],
			id: 0,
			token_id: 0,
			name: 0,
		},
		CharValue: {
			fieldOrder: ['name'],
			name: 0,
		},
		Miner: {
			fieldOrder: ['token_id', 'resource_type', 'xp', 'timestamp', 'subresource_type', 'rcs_1', 'rcs_2', 'rcs_3', 'rcs_4', 'rcs_5', 'rcs_6', 'rcs_7'],
			token_id: 0,
			resource_type: 0,
			xp: 0,
			timestamp: 0,
			subresource_type: 0,
			rcs_1: 0,
			rcs_2: 0,
			rcs_3: 0,
			rcs_4: 0,
			rcs_5: 0,
			rcs_6: 0,
			rcs_7: 0,
		},
		MinerValue: {
			fieldOrder: ['xp', 'timestamp', 'subresource_type', 'rcs_1', 'rcs_2', 'rcs_3', 'rcs_4', 'rcs_5', 'rcs_6', 'rcs_7'],
			xp: 0,
			timestamp: 0,
			subresource_type: 0,
			rcs_1: 0,
			rcs_2: 0,
			rcs_3: 0,
			rcs_4: 0,
			rcs_5: 0,
			rcs_6: 0,
			rcs_7: 0,
		},
		Player: {
			fieldOrder: ['token_id', 'name'],
			token_id: 0,
			name: 0,
		},
		PlayerValue: {
			fieldOrder: ['name'],
			name: 0,
		},
		Settings: {
			fieldOrder: ['id', 'gold_erc20_address', 'character_erc721_address', 'is_set'],
			id: 0,
			gold_erc20_address: "",
			character_erc721_address: "",
			is_set: false,
		},
		SettingsValue: {
			fieldOrder: ['gold_erc20_address', 'character_erc721_address', 'is_set'],
			gold_erc20_address: "",
			character_erc721_address: "",
			is_set: false,
		},
		TokenConfig: {
			fieldOrder: ['token_address', 'max_supply', 'minted_count', 'max_per_wallet', 'is_open'],
			token_address: "",
		max_supply: 0,
		minted_count: 0,
		max_per_wallet: 0,
			is_open: false,
		},
		TokenConfigValue: {
			fieldOrder: ['max_supply', 'minted_count', 'max_per_wallet', 'is_open'],
		max_supply: 0,
		minted_count: 0,
		max_per_wallet: 0,
			is_open: false,
		},
		Harvest: {
			fieldOrder: ['token_id', 'rcs_type', 'rcs_sub_type', 'amount', 'xp'],
			token_id: 0,
			rcs_type: 0,
			rcs_sub_type: 0,
			amount: 0,
			xp: 0,
		},
		HarvestValue: {
			fieldOrder: ['rcs_type', 'rcs_sub_type', 'amount', 'xp'],
			rcs_type: 0,
			rcs_sub_type: 0,
			amount: 0,
			xp: 0,
		},
		Mine: {
			fieldOrder: ['token_id', 'rcs_type', 'rcs_sub_type'],
			token_id: 0,
			rcs_type: 0,
			rcs_sub_type: 0,
		},
		MineValue: {
			fieldOrder: ['rcs_type', 'rcs_sub_type'],
			rcs_type: 0,
			rcs_sub_type: 0,
		},
	},
};
export enum ModelsMapping {
	Admin = 'zidle-Admin',
	AdminValue = 'zidle-AdminValue',
	Char = 'zidle-Char',
	CharValue = 'zidle-CharValue',
	Miner = 'zidle-Miner',
	MinerValue = 'zidle-MinerValue',
	Player = 'zidle-Player',
	PlayerValue = 'zidle-PlayerValue',
	Settings = 'zidle-Settings',
	SettingsValue = 'zidle-SettingsValue',
	TokenConfig = 'zidle-TokenConfig',
	TokenConfigValue = 'zidle-TokenConfigValue',
	Harvest = 'zidle-Harvest',
	HarvestValue = 'zidle-HarvestValue',
	Mine = 'zidle-Mine',
	MineValue = 'zidle-MineValue',
}