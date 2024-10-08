import { Connector } from "@starknet-react/core";
import CartridgeConnector from "@cartridge/connector";
import { getContractByName } from "@dojoengine/core";
import { ControllerOptions } from "@cartridge/controller";

import local from "../../contracts/manifests/dev/deployment/manifest.json";
import slot from "../../contracts/manifests/dev/deployment/manifest.json";
// import slotdev from "../../contracts/manifests/slotdev/deployment/manifest.json";
import sepolia from "../../contracts/manifests/dev/deployment/manifest.json";

const manifest =
  import.meta.env.VITE_PUBLIC_DEPLOY_TYPE === "sepolia"
    ? sepolia
    : import.meta.env.VITE_PUBLIC_DEPLOY_TYPE === "slot"
      ? slot
      : import.meta.env.VITE_PUBLIC_DEPLOY_TYPE === "slotdev"
        ? local
        : local;

const policies = [
  {
    target: import.meta.env.VITE_PUBLIC_FEE_TOKEN_ADDRESS,
    method: "approve",
  },
];

const options: ControllerOptions = {
  rpc: import.meta.env.VITE_PUBLIC_NODE_URL,
};

const cartridgeConnector = new CartridgeConnector(
  policies,
  options,
) as never as Connector;

export default cartridgeConnector;
