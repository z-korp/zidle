import { useEffect, useState } from "react";
import { useContract } from "@starknet-react/core";
import { erc721ABI } from "@/utils/erc721";

const { VITE_PUBLIC_CHARACTER_ERC721_TOKEN_ADDRESS } = import.meta.env;

export const useAllTokenIds = (accountAddress: string | undefined) => {
  const [tokenIds, setTokenIds] = useState<bigint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { contract: erc721Contract } = useContract({
    abi: erc721ABI,
    address: VITE_PUBLIC_CHARACTER_ERC721_TOKEN_ADDRESS,
  });

  useEffect(() => {
    if (accountAddress && erc721Contract) {
      fetchAllTokenIds();
    }
  }, [accountAddress, erc721Contract]);

  const fetchAllTokenIds = async () => {
    setIsLoading(true);
    setError(null);
    setTokenIds([]);

    try {
      // Fetch the total number of NFTs owned
      const ret_erc721_balance = await erc721Contract.call("balance_of", [
        accountAddress,
      ]);
      const numberOfNfts = Number(ret_erc721_balance.toString());

      if (numberOfNfts === 0) {
        setTokenIds([]);
        setIsLoading(false);
        return;
      }

      // Fetch token IDs for each index
      const ids: bigint[] = [];
      for (let i = 0; i < numberOfNfts; i++) {
        try {
          const ret_erc721 = await erc721Contract.call(
            "token_of_owner_by_index",
            [accountAddress, i],
          );
          ids.push(BigInt(ret_erc721.toString()));
        } catch (err) {
          console.error(`Error fetching token ID at index ${i}:`, err);
        }
      }

      setTokenIds(ids);
    } catch (err) {
      console.error("Error fetching token IDs:", err);
      setError("Failed to fetch token IDs.");
    } finally {
      setIsLoading(false);
    }
  };

  return { tokenIds, numberOfNfts: tokenIds.length, isLoading, error };
};
