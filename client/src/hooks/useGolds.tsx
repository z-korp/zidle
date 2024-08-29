import { useDojo } from "@/dojo/useDojo";
import { useEffect, useState } from "react";
import { useEntityQuery } from "@dojoengine/react";
import { getComponentValue, HasValue } from "@dojoengine/recs";

const { VITE_PUBLIC_GOLD_TOKEN_ADDRESS, VITE_PUBLIC_CHARACTER_TOKEN_ADDRESS } =
  import.meta.env;

export const useGolds = (tokenId: string | undefined) => {
  const {
    setup: {
      clientModels: {
        models: { ERC721Wallet, ERC20Balance },
      },
    },
  } = useDojo();

  const [goldBalance, setGoldBalance] = useState<number>(0);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Query to get the wallet address for the given token ID
  const walletKeys = useEntityQuery([
    HasValue(ERC721Wallet, {
      token: BigInt(VITE_PUBLIC_CHARACTER_TOKEN_ADDRESS),
      token_id: Number(tokenId) || 0,
    }),
  ]);

  // Effect to set the wallet address when we get it
  useEffect(() => {
    const walletComponent =
      walletKeys.length > 0
        ? getComponentValue(ERC721Wallet, walletKeys[0])
        : null;
    if (walletComponent) {
      setWalletAddress("0x" + walletComponent.address.toString(16));
    }
  }, [walletKeys]);

  // Query to get the gold balance for the wallet address
  const balanceKeys = useEntityQuery([
    HasValue(ERC20Balance, {
      token: BigInt(VITE_PUBLIC_GOLD_TOKEN_ADDRESS),
      account: walletAddress ? BigInt(walletAddress) : BigInt(0),
    }),
  ]);

  // Effect to set the gold balance when we get it
  useEffect(() => {
    const balanceComponent =
      balanceKeys.length > 0
        ? getComponentValue(ERC20Balance, balanceKeys[0])
        : null;
    if (balanceComponent) {
      setGoldBalance(balanceComponent.amount);
    }
  }, [balanceKeys]);

  return { goldBalance, walletAddress };
};
