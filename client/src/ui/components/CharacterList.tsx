import React, { useState, useEffect } from "react";
import { Button } from "../elements/button";
import { Input } from "../elements/input";
import AnimatedSprite from "../components/AnimatedSprite";
import { useDojo } from "@/dojo/useDojo";
import useAccountCustom from "@/hooks/useAccountCustom";
import { Account } from "starknet";
import { usePlayer } from "@/hooks/usePlayer";
import { useMiners } from "@/hooks/useMiners";
import { useCharacter } from "@/hooks/useCharacter";

interface CharacterListProps {
  onCharacterSelect: (character: Character) => void;
}

const CharacterList: React.FC<CharacterListProps> = ({ onCharacterSelect }) => {
  const [playerName, setPlayerName] = useState("");
  const [currentAnimation, setCurrentAnimation] = useState("idle");

  const {
    setup: {
      systemCalls: { create },
    },
  } = useDojo();
  const { account } = useAccountCustom();
  const { character} = useCharacter(account?.address);
  const { player, loading: playerLoading } = usePlayer({
    playerId: account?.address,
  });
  const { miners, loading: minersLoading } = useMiners({
    playerId: player?.id,
  });

  const handleMint = async () => {
    if (playerName.trim()) {
      await create({ account: account as Account, name: playerName });
      setPlayerName(""); // Clear the input
    }
  };

  if (playerLoading || minersLoading) {
    return <div>Loading characters...</div>;
  }

  if (!player) {
    return (
      <div className="flex flex-col items-center space-y-6">
        <h3>Create Your First Character</h3>
        <Input
          type="text"
          placeholder="Enter character name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-full bg-gray-700 text-white border-gray-600"
        />
        <Button
          onClick={handleMint}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Mint New Character
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <h3>Your Characters</h3>
      <div className="grid grid-cols-2 gap-4">
        <div key={player.id} className="flex flex-col items-center">
        <Button onClick={() => character && onCharacterSelect(character)}>
            {player.name}
          </Button>
          <AnimatedSprite
            width={192}
            height={192}
            scale={1}
            fps={10}
            currentAnimation={currentAnimation}
          />
        </div>
      </div>
      <Input
        type="text"
        placeholder="Enter new character name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        className="w-full bg-gray-700 text-white border-gray-600"
      />
      <Button
        onClick={handleMint}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        Mint New Character
      </Button>
    </div>
  );
};

export default CharacterList;
