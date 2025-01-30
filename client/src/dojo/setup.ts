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
import { init } from "@dojoengine/sdk/experimental";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup({ ...config }: Config) {
  const sdk = await init({
    client: {
      rpcUrl: config.rpcUrl,
      toriiUrl: config.toriiUrl,
      relayUrl: config.relayUrl,
      worldAddress: config.manifest.world.address,
    },
    domain: {
      name: "zidle",
      version: "1.0",
      chainId: "KATANA",
      revision: "1",
    },
  });

  const toriiClient = await torii.createClient({
    rpcUrl: config.rpcUrl,
    toriiUrl: config.toriiUrl,
    relayUrl: config.relayUrl,
    worldAddress: config.manifest.world.address || "",
  });

  const contractModels = defineContractComponents(world);

  const clientModels = models({ contractModels });

  console.log(config.manifest);
  console.log(config.rpcUrl);
  const dojoProvider = new DojoProvider(config.manifest, config.rpcUrl);
  console.log("qqqq");

  const sync = await getSyncEntities(
    toriiClient,
    contractModels as any,
    undefined,
    [],
    [],
    [],
    1000,
    false,
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
    sdk,
  };
}
