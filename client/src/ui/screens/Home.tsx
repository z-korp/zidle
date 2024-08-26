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

interface ReconnectionData {
  timePassed: string;
  resourcesGained: { name: string; quantity: number }[];
}

export const Home = () => {
  const {
    setup: { toriiClient, contractComponents, systemCalls: { create } },
  } = useDojo();

  useQuerySync(toriiClient, contractComponents as any, []);

  const { account } = useAccountCustom();
  const { player } = usePlayer({ playerId: account?.address });

  const [enter, setEnter] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [reconnectionData, setReconnectionData] = useState<ReconnectionData | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [isInGame, setIsInGame] = useState(false);

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

  const handleMint = async () => {
    if (playerName.trim()) {
      setIsInGame(true);
      await create({ account: account as Account, name: playerName });
      console.log(`Minting character for ${playerName}`);
    }
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
                setIsInGame(true);
              }}
            />
          ) : isInGame ? (
            <MainMenuCard />
          ) : (
            <Card className="w-[350px] bg-gray-800 text-white shadow-xl">
              <CardHeader>
                <CardTitle className="text-center text-2xl">ZIdle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-6">
                  <SpriteAnimator
                    sprite={warriorBlue}
                    width={192}
                    height={192}
                    scale={1}
                    fps={10}
                  />
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full bg-gray-700 text-white border-gray-600"
                  />
                  <Button 
                    onClick={handleMint} 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Mint
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};