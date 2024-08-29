import React, { useState } from "react";
import { Button } from "../elements/button";
import { Input } from "../elements/input";
import AnimatedSprite from "../components/AnimatedSprite";
import { useDojo } from "@/dojo/useDojo";
import useAccountCustom from "@/hooks/useAccountCustom";
import { Account } from "starknet";
import { usePlayer } from "@/hooks/usePlayer";
import { useMiners } from "@/hooks/useMiners";
import { useCharacter } from "@/hooks/useCharacter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../elements/card";

interface Character {
  id: string;
  name: string;
  gold: number;
}

interface CharacterListProps {
  onCharacterSelect: (character: Character) => void;
}

const CharacterCard: React.FC<{ character: Character; onSelect: () => void }> = ({ character, onSelect }) => (
  <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-300" onClick={onSelect}>
    <CardHeader>
      <CardTitle>{character.name}</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col items-center space-y-4">
      <AnimatedSprite
        width={192}
        height={192}
        scale={1}
        fps={10}
        currentAnimation="idle"
      />
    </CardContent>
    <CardFooter className="flex justify-between">
      <p>Gold: {character.gold}</p>
    </CardFooter>
  </Card>
);

const CharacterList: React.FC<CharacterListProps> = ({ onCharacterSelect }) => {
  const [playerName, setPlayerName] = useState("");
  const {
    setup: {
      systemCalls: { create },
    },
  } = useDojo();
  const { account } = useAccountCustom();
  const { character } = useCharacter(account?.address);
  const { player, loading: playerLoading } = usePlayer({
    playerId: account?.address,
  });
  const { miners, loading: minersLoading } = useMiners({
    playerId: player?.id,
  });

  const handleMint = async () => {
    if (playerName.trim() && account) {
      await create({ account: account as Account, name: playerName });
      setPlayerName("");
    }
  };

  if (playerLoading || minersLoading) {
    return <div>Loading characters...</div>;
  }

  const characters: Character[] = player
    ? [
        {
          id: player.id,
          name: player.name,
          gold: player.gold,
        },
      ]
    : [];

  return (
    <div className="flex flex-col items-center space-y-6">
      <h3 className="text-2xl font-bold">Your Characters</h3>
      {characters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              onSelect={() => character && onCharacterSelect(character)}
            />
          ))}
        </div>
      ) : (
        <p>You don't have any characters yet. Create one below!</p>
      )}
      <Card className="w-full max-w-md">
        <CardContent className="space-y-4 pt-6">
          <Input
            type="text"
            placeholder="Enter new character name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full"
          />
          <Button
            onClick={handleMint}
            className="w-full"
          >
            Mint New Character
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CharacterList;