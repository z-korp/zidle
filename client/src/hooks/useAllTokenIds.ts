import { useEffect, useState } from "react";
import { useContract } from "@starknet-react/core";
import { erc721ABI } from "@/utils/erc721";

const { VITE_PUBLIC_CHARACTER_ERC721_TOKEN_ADDRESS } = import.meta.env;

/**
 * Custom hook to fetch all NFT token IDs owned by a specific account
 * @param accountAddress The Starknet address of the account to check
 * @returns Object containing:
 * - tokenIds: Array of token IDs owned by the account
 * - numberOfNfts: Total number of NFTs owned
 * - isLoading: Loading state indicator
 * - error: Error message if any
 * - refetch: Function to manually refresh the data
 */
export const useAllTokenIds = (accountAddress: string | undefined) => {
  // State management for token IDs and UI states
  const [tokenIds, setTokenIds] = useState<bigint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize ERC721 contract connection
  const { contract: erc721Contract } = useContract({
    abi: erc721ABI,
    address: VITE_PUBLIC_CHARACTER_ERC721_TOKEN_ADDRESS,
  });

  /**
   * Fetches all token IDs owned by the specified account
   * Process:
   * 1. Gets the total balance of NFTs for the account
   * 2. For each NFT index, fetches the corresponding token ID
   * 3. Handles errors for individual token fetches
   */
  const fetchAllTokenIds = async () => {
    // Validate required parameters
    if (!accountAddress) {
      setError("Account address is undefined.");
      return;
    }
    if (!erc721Contract) {
      setError("ERC721 contract is undefined.");
      return;
    }

    // Reset states before fetching
    setIsLoading(true);
    setError(null);
    setTokenIds([]);

    try {
      // Get total number of NFTs owned by the account
      const ret_erc721_balance = await erc721Contract.call("balance_of", [
        accountAddress,
      ]);
      const numberOfNfts = Number(ret_erc721_balance.toString());

      // Early return if account owns no NFTs
      if (numberOfNfts === 0) {
        setTokenIds([]);
        setIsLoading(false);
        return;
      }

      // Fetch each token ID owned by the account
      const ids: bigint[] = [];
      for (let i = 0; i < numberOfNfts; i++) {
        try {
          // Get token ID at specific index for the owner
          const ret_erc721 = await erc721Contract.call(
            "token_of_owner_by_index",
            [accountAddress, i],
          );
          ids.push(BigInt(ret_erc721.toString()));
        } catch (err) {
          // Log error but continue fetching other tokens
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

  /**
   * Effect to automatically fetch token IDs when:
   * - Account address changes
   * - Contract connection is established/changed
   */
  useEffect(() => {
    if (accountAddress && erc721Contract) {
      fetchAllTokenIds();
    }
  }, [accountAddress, erc721Contract]);

  /**
   * Public method to manually trigger a refresh of token IDs
   * Only executes if required parameters are available
   */
  const refetch = () => {
    if (accountAddress && erc721Contract) {
      fetchAllTokenIds();
    }
  };

  // Return all necessary data and functions for consumers
  return { tokenIds, numberOfNfts: tokenIds.length, isLoading, error, refetch };
};
