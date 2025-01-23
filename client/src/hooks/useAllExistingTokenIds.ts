import { useEffect, useState } from "react";
import { useContract } from "@starknet-react/core";
import { erc721ABI } from "@/utils/erc721";

const { VITE_PUBLIC_CHARACTER_ERC721_TOKEN_ADDRESS } = import.meta.env;

/**
 * Custom hook to fetch all NFT token IDs that exists on smartcontract
 * @returns Object containing:
 * - tokenIds: Array of token IDs that exist
 * - numberOfNfts: Total number of NFTs owned
 * - isLoading: Loading state indicator
 * - error: Error message if any
 * - refetch: Function to manually refresh the data
 */
export const useAllExistingTokenIds = () => {
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
   * Fetches all existing token IDs from the contract
   * Process:
   * 1. Gets the total supply of NFTs from the contract
   * 2. For each possible token ID, checks if it exists
   * 3. Handles errors for individual token checks
   */
  const fetchAllExistingTokenIds = async () => {
    // Validate contract connection
    if (!erc721Contract) {
      setError("ERC721 contract is undefined.");
      return;
    }

    // Reset states before fetching
    setIsLoading(true);
    setError(null);
    setTokenIds([]);

    try {
      // Get total supply of NFTs
      const totalSupply = await erc721Contract.call("total_supply", []);
      const totalNFTs = Number(totalSupply.toString());

      // Early return if no NFTs exist
      if (totalNFTs === 0) {
        setTokenIds([]);
        setIsLoading(false);
        return;
      }

      // Fetch all existing token IDs
      const ids: bigint[] = [];
      for (let i = 1; i <= totalNFTs; i++) {
        try {
          // Check if token exists by trying to get its owner
          await erc721Contract.call("owner_of", [i]);
          ids.push(BigInt(i));
        } catch (err) {
          // Log error but continue checking other tokens
          console.error(`Error checking token ID ${i}:`, err);
        }
      }

      setTokenIds(ids);
    } catch (err) {
      console.error("Error fetching existing token IDs:", err);
      setError("Failed to fetch existing token IDs.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Effect to automatically fetch token IDs when:
   * - Contract connection is established/changed
   */
  useEffect(() => {
    if (erc721Contract) {
      fetchAllExistingTokenIds();
    }
  }, [erc721Contract]);

  /**
   * Public method to manually trigger a refresh of token IDs
   * Only executes if contract is available
   */
  const refetch = () => {
    if (erc721Contract) {
      fetchAllExistingTokenIds();
    }
  };

  // Return all necessary data and functions for consumers
  return { tokenIds, numberOfNfts: tokenIds.length, isLoading, error, refetch };
};
