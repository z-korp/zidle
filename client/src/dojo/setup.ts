import { getSyncEntities } from "@dojoengine/state";
import * as torii from "@dojoengine/torii-client";
import { models } from "./models.ts";
import { systems } from "./systems.ts";
import { defineContractComponents } from "./contractModels";
import { world } from "./world.ts";
import { Config } from "../../dojo.config.ts";
import { setupWorld } from "./contractSystems.ts";
import { DojoProvider } from "@dojoengine/core";
import { BurnerManager } from "@dojoengine/create-burner";
import { Account } from "starknet";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup({ ...config }: Config) {
  const toriiClient = await torii.createClient({
    rpcUrl: config.rpcUrl,
    toriiUrl: config.toriiUrl,
    relayUrl: "",
    worldAddress: config.manifest.world.address || "",
  });

  const contractModels = defineContractComponents(world);

  const clientModels = models({ contractModels });

  const dojoProvider = new DojoProvider(config.manifest, config.rpcUrl);

  const sync = await getSyncEntities(
    toriiClient,
    contractModels as any,
    undefined,
    [],
    [],
    [],
    1000,
    true,
  );

  const client = await setupWorld(dojoProvider, config);

  const burnerManager = new BurnerManager({
    masterAccount: new Account(
      {
        nodeUrl: config.rpcUrl,
      },
      config.masterAddress,
      config.masterPrivateKey,
    ),
    accountClassHash: config.accountClassHash,
    rpcProvider: dojoProvider.provider,
    feeTokenAddress: config.feeTokenAddress,
  });

  try {
    await burnerManager.init();

    if (burnerManager.list().length === 0) {
      await burnerManager.create();
    } else {
      burnerManager.select(burnerManager.list()[0].address);
    }
  } catch (e) {
    console.error(e);
  }

  return {
    client,
    clientModels,
    contractModels,
    systemCalls: systems({ client }),
    config,
    world,
    burnerManager,
    dojoProvider,
    rpcProvider: dojoProvider.provider,
    sync,
    toriiClient,
  };
}
