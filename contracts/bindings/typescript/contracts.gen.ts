import { DojoProvider, DojoCall } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, CairoOption, CairoCustomEnum, ByteArray } from "starknet";
import * as models from "./models.gen";

export function setupWorld(provider: DojoProvider) {

	const build_character_minter_canMint_calldata = (to: string, tokenContractAddress: string): DojoCall => {
		return {
			contractName: "character_minter",
			entrypoint: "can_mint",
			calldata: [to, tokenContractAddress],
		};
	};

	const character_minter_canMint = async (snAccount: Account | AccountInterface, to: string, tokenContractAddress: string) => {
		try {
			return await provider.execute(
				snAccount,
				build_character_minter_canMint_calldata(to, tokenContractAddress),
				"zidle",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_gold_minter_canMint_calldata = (to: string, tokenContractAddress: string): DojoCall => {
		return {
			contractName: "gold_minter",
			entrypoint: "can_mint",
			calldata: [to, tokenContractAddress],
		};
	};

	const gold_minter_canMint = async (snAccount: Account | AccountInterface, to: string, tokenContractAddress: string) => {
		try {
			return await provider.execute(
				snAccount,
				build_gold_minter_canMint_calldata(to, tokenContractAddress),
				"zidle",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_character_create_calldata = (name: BigNumberish): DojoCall => {
		return {
			contractName: "character",
			entrypoint: "create",
			calldata: [name],
		};
	};

	const character_create = async (snAccount: Account | AccountInterface, name: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_character_create_calldata(name),
				"zidle",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_resources_harvest_calldata = (tokenId: BigNumberish, rcsType: BigNumberish): DojoCall => {
		return {
			contractName: "resources",
			entrypoint: "harvest",
			calldata: [tokenId, rcsType],
		};
	};

	const resources_harvest = async (snAccount: Account | AccountInterface, tokenId: BigNumberish, rcsType: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_resources_harvest_calldata(tokenId, rcsType),
				"zidle",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_resources_mine_calldata = (tokenId: BigNumberish, rcsType: BigNumberish, rcsSubType: BigNumberish): DojoCall => {
		return {
			contractName: "resources",
			entrypoint: "mine",
			calldata: [tokenId, rcsType, rcsSubType],
		};
	};

	const resources_mine = async (snAccount: Account | AccountInterface, tokenId: BigNumberish, rcsType: BigNumberish, rcsSubType: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_resources_mine_calldata(tokenId, rcsType, rcsSubType),
				"zidle",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_character_minter_mint_calldata = (to: string, tokenContractAddress: string): DojoCall => {
		return {
			contractName: "character_minter",
			entrypoint: "mint",
			calldata: [to, tokenContractAddress],
		};
	};

	const character_minter_mint = async (snAccount: Account | AccountInterface, to: string, tokenContractAddress: string) => {
		try {
			return await provider.execute(
				snAccount,
				build_character_minter_mint_calldata(to, tokenContractAddress),
				"zidle",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_gold_minter_mint_calldata = (to: string, amount: BigNumberish, tokenContractAddress: string): DojoCall => {
		return {
			contractName: "gold_minter",
			entrypoint: "mint",
			calldata: [to, amount, tokenContractAddress],
		};
	};

	const gold_minter_mint = async (snAccount: Account | AccountInterface, to: string, amount: BigNumberish, tokenContractAddress: string) => {
		try {
			return await provider.execute(
				snAccount,
				build_gold_minter_mint_calldata(to, amount, tokenContractAddress),
				"zidle",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_resources_sell_calldata = (tokenId: BigNumberish, rcsType: BigNumberish, rcsSubType: BigNumberish, amount: BigNumberish): DojoCall => {
		return {
			contractName: "resources",
			entrypoint: "sell",
			calldata: [tokenId, rcsType, rcsSubType, amount],
		};
	};

	const resources_sell = async (snAccount: Account | AccountInterface, tokenId: BigNumberish, rcsType: BigNumberish, rcsSubType: BigNumberish, amount: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_resources_sell_calldata(tokenId, rcsType, rcsSubType, amount),
				"zidle",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_character_minter_setOpen_calldata = (tokenContractAddress: string, isOpen: boolean): DojoCall => {
		return {
			contractName: "character_minter",
			entrypoint: "set_open",
			calldata: [tokenContractAddress, isOpen],
		};
	};

	const character_minter_setOpen = async (snAccount: Account | AccountInterface, tokenContractAddress: string, isOpen: boolean) => {
		try {
			return await provider.execute(
				snAccount,
				build_character_minter_setOpen_calldata(tokenContractAddress, isOpen),
				"zidle",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_gold_minter_setOpen_calldata = (tokenContractAddress: string, isOpen: boolean): DojoCall => {
		return {
			contractName: "gold_minter",
			entrypoint: "set_open",
			calldata: [tokenContractAddress, isOpen],
		};
	};

	const gold_minter_setOpen = async (snAccount: Account | AccountInterface, tokenContractAddress: string, isOpen: boolean) => {
		try {
			return await provider.execute(
				snAccount,
				build_gold_minter_setOpen_calldata(tokenContractAddress, isOpen),
				"zidle",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_settings_updateCharacterErc721Address_calldata = (address: string): DojoCall => {
		return {
			contractName: "settings",
			entrypoint: "update_character_erc721_address",
			calldata: [address],
		};
	};

	const settings_updateCharacterErc721Address = async (snAccount: Account | AccountInterface, address: string) => {
		try {
			return await provider.execute(
				snAccount,
				build_settings_updateCharacterErc721Address_calldata(address),
				"zidle",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_settings_updateGoldErc20Address_calldata = (address: string): DojoCall => {
		return {
			contractName: "settings",
			entrypoint: "update_gold_erc20_address",
			calldata: [address],
		};
	};

	const settings_updateGoldErc20Address = async (snAccount: Account | AccountInterface, address: string) => {
		try {
			return await provider.execute(
				snAccount,
				build_settings_updateGoldErc20Address_calldata(address),
				"zidle",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};



	return {
		character_minter: {
			canMint: character_minter_canMint,
			buildCanMintCalldata: build_character_minter_canMint_calldata,
			mint: character_minter_mint,
			buildMintCalldata: build_character_minter_mint_calldata,
			setOpen: character_minter_setOpen,
			buildSetOpenCalldata: build_character_minter_setOpen_calldata,
		},
		gold_minter: {
			canMint: gold_minter_canMint,
			buildCanMintCalldata: build_gold_minter_canMint_calldata,
			mint: gold_minter_mint,
			buildMintCalldata: build_gold_minter_mint_calldata,
			setOpen: gold_minter_setOpen,
			buildSetOpenCalldata: build_gold_minter_setOpen_calldata,
		},
		character: {
			create: character_create,
			buildCreateCalldata: build_character_create_calldata,
		},
		resources: {
			harvest: resources_harvest,
			buildHarvestCalldata: build_resources_harvest_calldata,
			mine: resources_mine,
			buildMineCalldata: build_resources_mine_calldata,
			sell: resources_sell,
			buildSellCalldata: build_resources_sell_calldata,
		},
		settings: {
			updateCharacterErc721Address: settings_updateCharacterErc721Address,
			buildUpdateCharacterErc721AddressCalldata: build_settings_updateCharacterErc721Address_calldata,
			updateGoldErc20Address: settings_updateGoldErc20Address,
			buildUpdateGoldErc20AddressCalldata: build_settings_updateGoldErc20Address_calldata,
		},
	};
}