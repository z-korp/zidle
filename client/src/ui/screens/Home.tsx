import React, { useState, useEffect } from 'react';
import { Header } from "@/ui/containers/Header";
import { Create } from "../actions/Create";
import { usePlayer } from "@/hooks/usePlayer";
import { useDojo } from "@/dojo/useDojo";
import { useQuerySync } from "@dojoengine/react";
import useAccountCustom from "@/hooks/useAccountCustom";
import { Loading } from './Loading';
import MainMenuCard from "../components/MainMenuCard";
import ReconnectionSummary from "../components/ReconnectionSummary";
import { Input } from "../elements/input";
import { Button } from "../elements/button";
import { Card, CardHeader, CardTitle, CardContent } from "../elements/card";
import { SpriteAnimator } from "react-sprite-animator";
import warriorBlue from "/assets/Warrior_Blue.png";
import { Account } from "starknet";
import AnimatedSprite from '../components/AnimatedSprite';

interface ReconnectionData {
  timePassed: string;
  resourcesGained: { name: string; quantity: number }[];
}

interface Character {
  id: string;
  name: string;
  // Add other character properties as needed
}

export const Home = () => {
  const {
    setup: { toriiClient, contractComponents, systemCalls: { create } },
  } = useDojo();

  useQuerySync(toriiClient, contractComponents as any, []);

  const [currentAnimation, setCurrentAnimation] = React.useState("idle");
  const { account } = useAccountCustom();
  const { player } = usePlayer({ playerId: account?.address });


  const [isReconnecting, setIsReconnecting] = useState(false);
  const [reconnectionData, setReconnectionData] = useState<ReconnectionData | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [isInGame, setIsInGame] = useState(false); // TODO check if I already have a character
  const [showSummary, setShowSummary] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  useEffect(() => {
    const checkReconnection = async () => {
      const response = await mockReconnectionCheck();
      if (response.isReconnecting) {
        setIsReconnecting(true);
        setReconnectionData(response.data);
      }
    };

    checkReconnection();
    fetchCharacters(); // Fetch existing characters
  }, []);


  const mockReconnectionCheck = (): Promise<{ isReconnecting: boolean; data: ReconnectionData }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          isReconnecting: true,
          data: {
            timePassed: "2 hours",
            resourcesGained: [
              { name: "Wood", quantity: 120 },
              { name: "Stone", quantity: 80 },
            ],
          },
        });
      }, 1000);
    });
  };

  const handleMint = async () => {
    if (playerName.trim()) {
      setIsInGame(true);
      await create({ account: account as Account, name: playerName });
      console.log(`Minting character for ${playerName}`);
    }
  };

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
    setShowSummary(true);
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
  };

  const fetchCharacters = async () => {
    // TODO: Implement the actual fetching of characters from your backend
    const mockCharacters: Character[] = [
      { id: '1', name: 'Character 1' },
      { id: '2', name: 'Character 2' },
    ];
    setCharacters(mockCharacters);
  };


  return (
    <div className="relative flex flex-col h-screen">
      <Header />
      <div className="relative flex flex-col gap-8 grow items-center justify-start">
        <div className="absolute flex flex-col items-center gap-4 w-full p-2 max-w-4xl mt-4">
          {isReconnecting ? (
            <ReconnectionSummary
              data={reconnectionData ?? { timePassed: "", resourcesGained: [] }}
              onContinue={() => {
                console.log("Continuing from reconnection...");
                setIsReconnecting(false);
              }}
            />
          ) : showSummary ? (
            <div>
              <h2>Character Summary</h2>
              {/* Add your character summary component here */}
              <Button onClick={handleCloseSummary}>Close Summary</Button>
            </div>
          ) : (
            <>
              <Card className="w-[350px] bg-gray-800 text-white shadow-xl">
                <CardHeader>
                  <CardTitle className="text-center text-2xl">ZIdle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center space-y-6">
                    <h3>Your Characters</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {characters.map(char => (
                        <div key={char.id} className="flex flex-col items-center">
                          <Button onClick={() => handleCharacterSelect(char)}>
                            {char.name}
                          </Button>
                          <AnimatedSprite
          width={192}  // Largeur d'un seul frame
          height={192} // Hauteur d'un seul frame
          scale={1}   // Agrandir l'image si nécessaire
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
                </CardContent>
              </Card>
              {selectedCharacter && !showSummary && <MainMenuCard />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};