import React, { useState } from "react";
import { Button } from "../elements/button";
import { Input } from "../elements/input";
import { useDojo } from "@/dojo/useDojo";
import useAccountCustom from "@/hooks/useAccountCustom";
import { Account } from "starknet";
import NFTCard from "./NFTCard";
import { useAllTokenIds } from "@/hooks/useAllTokenIds";
import { ScrollArea } from "@/ui/elements/scroll-area";

interface CharacterListProps {
  onCharacterSelect: (tokenId: string) => void;
}

const CharacterList: React.FC<CharacterListProps> = ({ onCharacterSelect }) => {
  const [playerName, setPlayerName] = useState("");
  const {
    setup: {
      systemCalls: { createCharacter },
    },
  } = useDojo();

  const { account } = useAccountCustom();
  //const { numberNft, tokenIds } = useNFTs(account?.address);
  /*const { numberNft, tokenIds, refetchBalance, refetchToken } = useNFTsManual(
    account?.address,
  );*/
  const {
    tokenIds,
    numberOfNfts: numberNft,
    refetch,
  } = useAllTokenIds(account?.address);

  const handleMint = async () => {
    if (playerName.trim()) {
      await createCharacter({ account: account as Account, name: playerName });
      setPlayerName("");
      refetch();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-10">
      {numberNft > 0 && (
        <>
          <h3>Your Characters</h3>
          <ScrollArea className="h-[400px] w-full pr-4">
            <div className="grid grid-cols-2 gap-4">
              {tokenIds.map((tokenId) => (
                <NFTCard
                  key={tokenId.toString()}
                  tokenId={tokenId.toString()}
                  onSelect={onCharacterSelect}
                />
              ))}
            </div>
          </ScrollArea>
        </>
      )}
      <div className="w-full flex flex-col gap-2">
        <Input
          type="text"
          placeholder="Enter new character name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-full bg-gray-700 text-white border-gray-600"
        />
        <Button onClick={handleMint} className="w-full">
          Mint New Character
        </Button>
      </div>
    </div>
  );
};
export default CharacterList;
