import { useReadContract } from "@starknet-react/core";
import { erc721ABI } from "@/utils/erc721";
import { useEffect, useState } from "react";

const { VITE_PUBLIC_CHARACTER_ERC721_TOKEN_ADDRESS } = import.meta.env;

export const useNFTsManual = (playerId: string | undefined) => {
  const [numberNft, setNumberNft] = useState<bigint>(0n);
  const [tokenIds, setTokenIds] = useState<number[]>([]);

  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    address: VITE_PUBLIC_CHARACTER_ERC721_TOKEN_ADDRESS,
    abi: erc721ABI,
    functionName: "balance_of",
    args: [playerId],
    watch: true,
    refetchInterval: 2000,
  });

  const { data: tokenData, refetch: refetchToken } = useReadContract({
    address: VITE_PUBLIC_CHARACTER_ERC721_TOKEN_ADDRESS,
    abi: erc721ABI,
    functionName: "token_of_owner_by_index",
    args: [playerId, 0], // Index will need to iterate for all tokens
    watch: false,
  });

  useEffect(() => {
    if (balanceData) {
      setNumberNft(BigInt(balanceData.toString()));
    }
  }, [balanceData]);

  useEffect(() => {
    if (numberNft > 0n) {
      fetchTokenIds();
    }
  }, [numberNft]);

  const fetchTokenIds = async () => {
    const ids: number[] = [];
    for (let i = 0n; i < numberNft; i++) {
      try {
        const { data: tokenIdData } = await refetchToken({
          args: [playerId, i],
        });
        if (tokenIdData) {
          ids.push(Number(tokenIdData.toString()));
        }
      } catch (error) {
        console.error("Error fetching token ID:", error);
      }
    }
    setTokenIds(ids);
  };

  return { numberNft, tokenIds, refetchBalance, refetchToken };
};
