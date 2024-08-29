import type { IWorld } from "./contractSystems";
import { toast } from "sonner";
import * as SystemTypes from "./contractSystems";
import { ClientModels } from "./models";
import { shortenHex } from "@dojoengine/utils";
import { Account } from "starknet";

export type SystemCalls = ReturnType<typeof systems>;

export function systems({
  client,
  clientModels,
}: {
  client: IWorld;
  clientModels: ClientModels;
}) {
  const TOAST_ID = "unique-id";

  const extractedMessage = (message: string) => {
    return message.match(/\('([^']+)'\)/)?.[1];
  };

  const isMdOrLarger = (): boolean => {
    return window.matchMedia("(min-width: 768px)").matches;
  };

  const isSmallHeight = (): boolean => {
    return window.matchMedia("(max-height: 768px)").matches;
  };

  const getToastAction = (transaction_hash: string) => {
    return {
      label: "View",
      onClick: () =>
        window.open(
          `https://worlds.dev/networks/slot/worlds/zidle/txs/${transaction_hash}`,
          //`https://sepolia.voyager.online/tx/${transaction_hash}`,
        ),
    };
  };

  const getToastPlacement = ():
    | "top-center"
    | "bottom-center"
    | "bottom-right" => {
    if (!isMdOrLarger()) {
      // if mobile
      return isSmallHeight() ? "top-center" : "bottom-center";
    }
    return "bottom-right";
  };

  const toastPlacement = getToastPlacement();

  const notify = (message: string, transaction: any) => {
    if (transaction.execution_status !== "REVERTED") {
      toast.success(message, {
        id: TOAST_ID,
        description: shortenHex(transaction.transaction_hash),
        action: getToastAction(transaction.transaction_hash),
        position: toastPlacement,
      });
    } else {
      toast.error(extractedMessage(transaction.revert_reason), {
        id: TOAST_ID,
        position: toastPlacement,
      });
    }
  };

  const handleTransaction = async (
    account: Account,
    action: () => Promise<{ transaction_hash: string }>,
    successMessage: string,
  ) => {
    toast.loading("Transaction in progress...", {
      id: TOAST_ID,
      position: toastPlacement,
    });
    try {
      const { transaction_hash } = await action();
      toast.loading("Transaction in progress...", {
        description: shortenHex(transaction_hash),
        action: getToastAction(transaction_hash),
        id: TOAST_ID,
        position: toastPlacement,
      });

      const transaction = await account.waitForTransaction(transaction_hash, {
        retryInterval: 100,
      });

      notify(successMessage, transaction);
    } catch (error: any) {
      toast.error(extractedMessage(error.message), { id: TOAST_ID });
    }
  };

  const mine = async ({ account, ...props }: SystemTypes.Mine) => {
    await handleTransaction(
      account,
      () => client.resources.mine({ account, ...props }),
      "Resource start mining.",
    );
  };

  const harvest = async ({ account, ...props }: SystemTypes.Harvest) => {
    await handleTransaction(
      account,
      () => client.resources.harvest({ account, ...props }),
      "Resource has been harvested.",
    );
  };

  const sell = async ({ account, ...props }: SystemTypes.Sell) => {
    await handleTransaction(
      account,
      () => client.resources.sell({ account, ...props }),
      "Resource has been sold.",
    );
  };

  const createCharacter = async ({
    account,
    ...props
  }: SystemTypes.CreateCharacter) => {
    await handleTransaction(
      account,
      () => client.character.create({ account, ...props }),
      "Character has been created.",
    );
  };

  return {
    mine,
    harvest,
    sell,
    createCharacter,
  };
}
