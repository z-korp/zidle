import slot from "../../../contracts/manifest_slot.json";

const deployType = import.meta.env.VITE_PUBLIC_DEPLOY_TYPE;

const manifests: Record<string, unknown> = {
  sepolia: undefined,
  mainnet: undefined,
  sepoliadev1: undefined,
  sepoliadev2: undefined,
  slot,
  slotdev: undefined,
};

export const manifest =
  deployType in manifests && manifests[deployType]
    ? manifests[deployType]
    : slot;

export type Manifest = typeof manifest;
