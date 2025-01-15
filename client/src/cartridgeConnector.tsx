import { Connector } from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";
import { ColorMode, ControllerOptions } from "@cartridge/controller";
import { manifest } from "./config/manifest";

const { VITE_PUBLIC_NODE_URL, VITE_PUBLIC_DEPLOY_TYPE } = import.meta.env;

console.log("VITE_PUBLIC_NODE_URL", VITE_PUBLIC_NODE_URL);

export type Manifest = typeof manifest;

const colorMode: ColorMode = "dark";
const slot = `${VITE_PUBLIC_DEPLOY_TYPE}-zidle`;
console.log("slot", slot);

const policies = [
  {
    target: import.meta.env.VITE_PUBLIC_FEE_TOKEN_ADDRESS,
    method: "approve",
  },
];

const options: ControllerOptions = {
  rpc: VITE_PUBLIC_NODE_URL,
  slot,
  policies,
  theme: undefined,
  colorMode,
};

const cartridgeConnector = new ControllerConnector(
  options,
) as never as Connector;

export default cartridgeConnector;
