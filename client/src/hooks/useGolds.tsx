import { useEffect, useState } from "react";
import { useContract } from "@starknet-react/core";
import { erc721ABI } from "@/utils/erc721";
import { erc20ABI } from "@/utils/erc20"; // make sure you have your ERC20 ABI defined

const {
  VITE_PUBLIC_GOLD_ERC20_TOKEN_ADDRESS,
  VITE_PUBLIC_CHARACTER_ERC721_TOKEN_ADDRESS,
} = import.meta.env;

export const useGolds = (tokenId: number | undefined) => {
  const [goldBalance, setGoldBalance] = useState<number>(0);
  const [walletAddress, setWalletAddress] = useState<bigint | null>(null);

  // Setup contract instances for both ERC721 (character) and ERC20 (gold)
  const { contract: erc721Contract } = useContract({
    abi: erc721ABI,
    address: VITE_PUBLIC_CHARACTER_ERC721_TOKEN_ADDRESS,
  });

  const { contract: erc20Contract } = useContract({
    abi: erc20ABI,
    address: VITE_PUBLIC_GOLD_ERC20_TOKEN_ADDRESS,
  });

  // Fetch the wallet associated with the token (one time, when tokenId or erc721Contract changes)
  useEffect(() => {
    if (!tokenId || !erc721Contract) return;

    const fetchWallet = async () => {
      try {
        // Call the "wallet_of" function on your ERC721 contract.
        // Adjust the parameter(s) if your contract expects a different format.
        const ret = await erc721Contract.call("wallet_of", [tokenId]);
        setWalletAddress(BigInt(ret));
      } catch (error) {
        console.error("Error fetching wallet:", error);
      }
    };

    fetchWallet();
  }, [tokenId, erc721Contract]);

  // Poll the gold balance every 2 seconds once we have a wallet address and the ERC20 contract
  useEffect(() => {
    if (!walletAddress || !erc20Contract) return;

    const fetchGoldBalance = async () => {
      try {
        // Call the "balance_of" function on your ERC20 contract.
        // The walletAddress is converted to a string as required by the call.
        const ret = await erc20Contract.call("balance_of", [
          walletAddress.toString(),
        ]);
        setGoldBalance(Number(ret));
      } catch (error) {
        console.error("Error fetching gold balance:", error);
      }
    };

    // Fetch immediately and then every 2 seconds
    fetchGoldBalance();
    const intervalId = setInterval(fetchGoldBalance, 3000);

    // Cleanup the interval on component unmount or if dependencies change
    return () => {
      clearInterval(intervalId);
    };
  }, [walletAddress, erc20Contract]);

  return {
    goldBalance,
    walletAddress: walletAddress ? "0x" + walletAddress.toString(16) : "",
  };
};
