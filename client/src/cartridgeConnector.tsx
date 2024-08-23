import { Connector } from "@starknet-react/core";
import CartridgeConnector from "@cartridge/connector";
import { getContractByName } from "@dojoengine/core";
import { ControllerOptions } from "@cartridge/controller";

import local from "../../contracts/manifests/dev/deployment/manifest.json";
import slot from "../../contracts/manifests/dev/deployment/manifest.json";
import slotdev from "../../contracts/manifests/slotdev/deployment/manifest.json";
import sepolia from "../../contracts/manifests/dev/deployment/manifest.json";

const manifest =
  import.meta.env.VITE_PUBLIC_DEPLOY_TYPE === "sepolia"
    ? sepolia
    : import.meta.env.VITE_PUBLIC_DEPLOY_TYPE === "slot"
      ? slot
      : import.meta.env.VITE_PUBLIC_DEPLOY_TYPE === "slotdev"
        ? slotdev
        : local;

const account_contract_address = getContractByName(
  manifest,
  "zkube",
  "account",
)?.address;

const play_contract_address = getContractByName(
  manifest,
  "zkube",
  "play",
)?.address;

console.log("account_contract_address", account_contract_address);
console.log("play_contract_address", play_contract_address);

const policies = [
  {
    target: import.meta.env.VITE_PUBLIC_FEE_TOKEN_ADDRESS,
    method: "approve",
  },
  account
  {
    target: account_contract_address,
    method: "create",
  },
  {
    target: account_contract_address,
    method: "rename",
  },
  play
  {
    target: play_contract_address,
    method: "start",
  },
  {
    target: play_contract_address,
    method: "surrender",
  },
  {
    target: play_contract_address,
    method: "move",
  },
  {
    target: play_contract_address,
    method: "apply_bonus",
  },
];

const options: ControllerOptions = {
  rpc: import.meta.env.VITE_PUBLIC_NODE_URL,
};

const cartridgeConnector = new CartridgeConnector(
  [],
  options,
) as never as Connector;

export default cartridgeConnector;
