import { useDojo } from "@/dojo/useDojo";
import { useEffect, useState } from "react";
import { useEntityQuery } from "@dojoengine/react";
import { getComponentValue, Has, HasValue } from "@dojoengine/recs";
import useAccountCustom from "./useAccountCustom";

const { VITE_PUBLIC_CHARACTER_TOKEN_ADDRESS } = import.meta.env;

export const useNFTs = () => {
  const {
    setup: {
      clientModels: {
        models: { ERC721Balance, ERC721EnumerableOwnerIndex },
      },
    },
  } = useDojo();

  const { account } = useAccountCustom();

  const [numberNft, setNumberNft] = useState(0);
  const [tokenIds, setTokenIds] = useState<number[]>([]);

  const balanceKeys = useEntityQuery([
    HasValue(ERC721Balance, {
      token: BigInt(VITE_PUBLIC_CHARACTER_TOKEN_ADDRESS),
      account: BigInt(account?.address ? account.address : 0),
    }),
  ]);

  const tokenKeys = useEntityQuery([
    Has(ERC721EnumerableOwnerIndex),
    HasValue(ERC721EnumerableOwnerIndex, {
      token: BigInt(VITE_PUBLIC_CHARACTER_TOKEN_ADDRESS),
      owner: BigInt(account?.address ? account.address : 0),
    }),
  ]);

  useEffect(() => {
    const components = balanceKeys.map((entity) => {
      const component = getComponentValue(ERC721Balance, entity);
      if (!component) {
        return undefined;
      }
      return component;
    });
    if (components[0]) {
      setNumberNft(components[0].amount);
    }
  }, [balanceKeys]);

  useEffect(() => {
    fetchTokenIds();
  }, [tokenKeys]);

  const fetchTokenIds = () => {
    const ids: number[] = [];
    tokenKeys.forEach((entity) => {
      const tokenInfo = getComponentValue(ERC721EnumerableOwnerIndex, entity);
      if (tokenInfo) {
        ids.push(tokenInfo.token_id);
      }
    });
    setTokenIds(ids);
  };

  return { numberNft, tokenIds };
};
