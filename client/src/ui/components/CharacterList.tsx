import React, { useState, useEffect } from 'react';
import { Button } from "../elements/button";
import { Input } from "../elements/input";
import AnimatedSprite from '../components/AnimatedSprite';
import { useDojo } from "@/dojo/useDojo";
import useAccountCustom from "@/hooks/useAccountCustom";
import { Account } from "starknet";


interface CharacterListProps {
  onCharacterSelect: (character: Character) => void;
}

const CharacterList: React.FC<CharacterListProps> = ({ onCharacterSelect }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [currentAnimation, setCurrentAnimation] = useState("idle");

  const {
    setup: { systemCalls: { create } },
  } = useDojo();
  const { account } = useAccountCustom();

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    // TODO: Implement the actual fetching of characters from your backend
    const mockCharacters: Character[] = [
      { id: '1', name: 'Character 1' },
      { id: '2', name: 'Character 2' },
    ];
    setCharacters(mockCharacters);
  };

  const handleMint = async () => {
    if (playerName.trim()) {
      await create({ account: account as Account, name: playerName });
      console.log(`Minting character for ${playerName}`);
      fetchCharacters(); // Refresh the character list
      setPlayerName(""); // Clear the input
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <h3>Your Characters</h3>
      <div className="grid grid-cols-2 gap-4">
        {characters.map(char => (
          <div key={char.id} className="flex flex-col items-center">
            <Button onClick={() => onCharacterSelect(char)}>
              {char.name}
            </Button>
            <AnimatedSprite
              width={192}
              height={192}
              scale={1}
              fps={10}
              currentAnimation={currentAnimation}
            />
          </div>
        ))}
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