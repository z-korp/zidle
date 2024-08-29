import { DojoProvider } from "@dojoengine/core";
import { Config } from "../../dojo.config.ts";
import { Account, UniversalDetails, shortString } from "starknet";
import { x } from "@starknet-react/core/dist/index-79NvzQC9";

const NAMESPACE = "zidle";

export interface Signer {
  account: Account;
}

export interface Create extends Signer {
  name: string;
}

export interface Rename extends Signer {
  name: string;
}

export interface Mine extends Signer {
  token_id: string;
  rcs_type: number;
  rcs_sub_type: number;
}

export interface Harvest extends Signer {
  token_id: string;
  rcs_sub_type: number;
}

export interface Sell extends Signer {
  token_id: string;
  rcs_type: number;
  rcs_sub_type: number;
  amount: number;
}

export interface Start extends Signer {
  mode: number;
  x: bigint;
  y: bigint;
  c: bigint;
  s: bigint;
  sqrt_ratio_hint: bigint;
  seed: bigint;
  beta: bigint;
}

export interface CreateCharacter extends Signer {
  name: string;
}

export interface TransferFrom extends Signer {
  sender: bigint;
  recipient: bigint;
  amount: number;
}

export interface Transfer extends Signer {
  recipient: bigint;
  amount: number;
}

export interface Approve extends Signer {
  spender: bigint;
  amount: number;
}

export type IWorld = Awaited<ReturnType<typeof setupWorld>>;

export const getContractByName = (manifest: any, name: string) => {
  const contract = manifest.contracts.find((contract: any) =>
    contract.name.includes("::" + name),
  );
  if (contract) {
    return contract.address;
  } else {
    return "";
  }
};

export async function setupWorld(provider: DojoProvider, config: Config) {
  const details: UniversalDetails | undefined = undefined; // { maxFee: 1e15 };

  function resources() {
    const contract_name = "resources";

    const contract = config.manifest.contracts.find((c: any) =>
      c.tag.includes(contract_name),
    );
    if (!contract) {
      throw new Error(`Contract ${contract_name} not found in manifest`);
    }

    const mine = async ({
      account,
      token_id,
      rcs_type,
      rcs_sub_type,
    }: Mine) => {
      try {
        return await provider.execute(
          account,
          {
            contractName: contract_name,
            entrypoint: "mine",
            calldata: [token_id, rcs_type, rcs_sub_type],
          },
          NAMESPACE,
          details,
        );
      } catch (error) {
        console.error("Error executing mine:", error);
        throw error;
      }
    };

    const harvest = async ({ account, token_id, rcs_sub_type }: Harvest) => {
      try {
        return await provider.execute(
          account,
          {
            contractName: contract_name,
            entrypoint: "harvest",
            calldata: [token_id, rcs_sub_type],
          },
          NAMESPACE,
          details,
        );
      } catch (error) {
        console.error("Error executing harvest:", error);
        throw error;
      }
    };

    const sell = async ({
      account,
      token_id,
      rcs_type,
      rcs_sub_type,
      amount,
    }: Sell) => {
      try {
        return await provider.execute(
          account,
          {
            contractName: contract_name,
            entrypoint: "sell",
            calldata: [token_id, rcs_type, rcs_sub_type, amount],
          },
          NAMESPACE,
          details,
        );
      } catch (error) {
        console.error("Error executing sell:", error);
        throw error;
      }
    };

    return {
      mine,
      harvest,
      sell,
    };
  }

  function character() {
    const contract_name = "character";

    const contract = config.manifest.contracts.find((c: any) =>
      c.tag.includes(contract_name),
    );
    if (!contract) {
      throw new Error(`Contract ${contract_name} not found in manifest`);
    }

    const create = async ({ account, name }: CreateCharacter) => {
      try {
        return await provider.execute(
          account,
          {
            contractName: contract_name,
            entrypoint: "create",
            calldata: [name],
          },
          NAMESPACE,
          details,
        );
      } catch (error) {
        console.error("Error executing create:", error);
        throw error;
      }
    };

    return {
      create,
    };
  }

  function gold_token() {
    const contract_name = "gold_token";

    const contract = config.manifest.contracts.find((c: any) =>
      c.tag.includes(contract_name),
    );
    if (!contract) {
      throw new Error(`Contract ${contract_name} not found in manifest`);
    }

    /*const approve = async ({ account, spender, amount }: Approve) => {
      try {
        return await provider.execute(
          account,
          {
            contractName: contract_name,
            entrypoint: "approve",
            calldata: [spender, amount],
          },
          NAMESPACE,
          details,
        );
      } catch (error) {
        console.error("Error executing approve:", error);
        throw error;
      }
    };*/

    const transfer_from = async ({
      account,
      sender, // The address of the NFT-based account contract
      recipient,
      amount,
    }: TransferFrom) => {
      try {
        return await provider.execute(
          account,
          [
            {
              contractName: contract_name,
              entrypoint: "approve",
              calldata: [recipient, amount, 0],
            },
            {
              contractName: contract_name,
              entrypoint: "transfer_from",
              calldata: [sender, recipient, amount, 0],
            },
          ],
          NAMESPACE,
          details,
        );
      } catch (error) {
        console.error("Error executing start:", error);
        throw error;
      }
    };

    const transfer = async ({ account, recipient, amount }: Transfer) => {
      try {
        return await provider.execute(
          account,
          [
            {
              contractName: contract_name,
              entrypoint: "transfer",
              calldata: [recipient, amount, 0],
            },
          ],
          NAMESPACE,
          details,
        );
      } catch (error) {
        console.error("Error executing start:", error);
        throw error;
      }
    };

    return {
      transfer_from,
      transfer,
    };
  }

  return {
    resources: resources(),
    character: character(),
    gold_token: gold_token(),
  };
}
