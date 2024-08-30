import { useDojo } from "@/dojo/useDojo";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/ui/elements/button";
import { Account, RpcProvider } from "starknet";
import useAccountCustom from "@/hooks/useAccountCustom";
import { useGolds } from "@/hooks/useGolds";

interface TransferGoldProps {
  tokenId: string;
  recipient: string;
  amount: number;
  onTxSuccess: () => void;
}

export const TransferGold: React.FC<TransferGoldProps> = ({
  tokenId,
  recipient,
  amount,
  onTxSuccess,
}) => {
  const { account } = useAccountCustom();
  const [isLoading, setIsLoading] = useState(false);
  const {
    master,
    setup: {
      systemCalls: { transferGold },
    },
  } = useDojo();
  const { walletAddress } = useGolds(tokenId);

  const handleClick = useCallback(async () => {
    if (!walletAddress) return;
    if (!account) return;
    setIsLoading(true);

    const provider = new RpcProvider({
      nodeUrl: import.meta.env.VITE_PUBLIC_NODE_URL as string,
    });
    // We create the wallet account to send the gold from
    // with the owner signer
    const walletAccount = new Account(provider, walletAddress, account.signer);
    try {
      await transferGold({
        account: walletAccount as Account,
        recipient: BigInt(recipient),
        amount: amount,
      });
    } finally {
      setIsLoading(false);
      onTxSuccess();
    }
  }, [account, walletAddress, recipient, amount]);

  const disabled = useMemo(() => {
    return !account || !master || account === master;
  }, [account, master]);

  if (disabled) return null;

  return (
    <Button
      disabled={!walletAddress || isLoading}
      isLoading={isLoading}
      onClick={handleClick}
    >
      {`Send Gold${amount > 1 ? "s" : ""}`}
    </Button>
  );
};
