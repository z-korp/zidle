import React, { useState, useEffect } from 'react';
import { Header } from "@/ui/containers/Header";
import { usePlayer } from "@/hooks/usePlayer";
import { useDojo } from "@/dojo/useDojo";
import { useQuerySync } from "@dojoengine/react";
import useAccountCustom from "@/hooks/useAccountCustom";
import ReconnectionSummary from "../components/ReconnectionSummary";
import MainMenuCard from "../components/MainMenuCard";
import { Card, CardHeader, CardTitle, CardContent } from "../elements/card";
import { Button } from '../elements/button';
import { Character } from '@/types/types';
import CharacterList from '../components/CharacterList';

interface ReconnectionData {
  timePassed: string;
  resourcesGained: { name: string; quantity: number }[];
}


export const Home = () => {
  const {
    setup: { toriiClient, contractComponents },
  } = useDojo();

  useQuerySync(toriiClient, contractComponents as any, []);

  const { account } = useAccountCustom();
  const { player } = usePlayer({ playerId: account?.address });

  const [isReconnecting, setIsReconnecting] = useState(false);
  const [reconnectionData, setReconnectionData] = useState<ReconnectionData | null>(null);
  const [showSummary, setShowSummary] = useState(false);
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

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
    setShowSummary(true);
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
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
            <Card className="w-[350px] bg-gray-800 text-white shadow-xl">
              <CardHeader>
                <CardTitle className="text-center text-2xl">ZIdle</CardTitle>
              </CardHeader>
              <CardContent>
                <CharacterList onCharacterSelect={handleCharacterSelect} />
              </CardContent>
            </Card>
          )}
          {selectedCharacter && !showSummary && <MainMenuCard />}
        </div>
      </div>
    </div>
  );
};