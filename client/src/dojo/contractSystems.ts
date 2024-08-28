import { DojoProvider } from "@dojoengine/core";
import { Config } from "../../dojo.config.ts";
import { Account, UniversalDetails, shortString } from "starknet";

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
  rcs_type: bigint;
  rcs_sub_type: bigint;
}

export interface Harvest extends Signer {
  rcs_sub_type: bigint;
}

export interface Sell extends Signer {
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

export interface Move extends Signer {
  row_index: number;
  start_index: number;
  final_index: number;
}

export interface Bonus extends Signer {
  bonus: number;
  row_index: number;
  block_index: number;
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

  function account() {
    const contract_name = "account";
    const contract = config.manifest.contracts.find((c: any) =>
      c.tag.includes(contract_name),
    );
    if (!contract) {
      throw new Error(`Contract ${contract_name} not found in manifest`);
    }

    const create = async ({ account, name }: Create) => {
      try {
        const encoded_name = shortString.encodeShortString(name);
        return await provider.execute(
          account,
          {
            contractName: contract_name,
            entrypoint: "create",
            calldata: [encoded_name],
          },
          NAMESPACE,
          details,
        );
      } catch (error) {
        console.error("Error executing create:", error);
        throw error;
      }
    };

    const rename = async ({ account, name }: Rename) => {
      try {
        const encoded_name = shortString.encodeShortString(name);
        return await provider.execute(
          account,
          {
            contractName: contract_name,
            entrypoint: "rename",
            calldata: [encoded_name],
          },
          NAMESPACE,
          details,
        );
      } catch (error) {
        console.error("Error executing rename:", error);
        throw error;
      }
    };

    return {
      address: contract.address,
      create,
      rename,
    };
  }

  function resources() {
    const contract_name = "resources";

    const contract = config.manifest.contracts.find((c: any) =>
      c.tag.includes(contract_name),
    );
    if (!contract) {
      throw new Error(`Contract ${contract_name} not found in manifest`);
    }

    const mine = async ({ account, rcs_type, rcs_sub_type }: Mine) => {
      try {
        return await provider.execute(
          account,
          {
            contractName: contract_name,
            entrypoint: "mine",
            calldata: [rcs_type, rcs_sub_type],
          },
          NAMESPACE,
          details,
        );
      } catch (error) {
        console.error("Error executing mine:", error);
        throw error;
      }
    };

    const harvest = async ({ account, rcs_sub_type }: Harvest) => {
      try {
        return await provider.execute(
          account,
          {
            contractName: contract_name,
            entrypoint: "harvest",
            calldata: [rcs_sub_type],
          },
          NAMESPACE,
          details,
        );
      } catch (error) {
        console.error("Error executing harvest:", error);
        throw error;
      }
    };

    const sell = async ({ account, rcs_type, rcs_sub_type, amount }: Sell) => {
      try {
        return await provider.execute(
          account,
          {
            contractName: contract_name,
            entrypoint: "sell",
            calldata: [rcs_type, rcs_sub_type, amount],
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

  return {
    account: account(),
    resources: resources(),
  };
}
