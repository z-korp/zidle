import React, { useState, useEffect } from "react";
import { useTheme } from "@/ui/elements/theme-provider";
import MainMenuCard from "../components/MainMenuCard";
import ReconnectionSummary from "../components/ReconnectionSummary.tsx";
import { Input } from "../elements/input";
import { Button } from "../elements/button";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "../elements/card.tsx";
import { SpriteAnimator } from "react-sprite-animator";
import warriorBlue from "/assets/Warrior_Blue.png";

interface ReconnectionResponse {
  isReconnecting: boolean;
  data: {
    timePassed: string;
    resourcesGained: { name: string; quantity: number }[];
  };
}

interface ReconnectionData {
  timePassed: string;
  resourcesGained: { name: string; quantity: number }[];
}

export const Loading = ({
  enter,
  setEnter,
}: {
  enter: boolean;
  setEnter: (state: boolean) => void;
}) => {
  const { themeTemplate } = useTheme();
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [reconnectionData, setReconnectionData] =
    useState<ReconnectionData | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [isInGame, setIsInGame] = useState(false);

  useEffect(() => {
    // Simuler une vérification de reconnexion
    const checkReconnection = async () => {
      // Ici, vous feriez normalement un appel API pour vérifier l'état de la session
      const response: ReconnectionResponse = await mockReconnectionCheck();
      if (response.isReconnecting) {
        //setIsReconnecting(true);
        //setReconnectionData(response.data);
      }
    };

    checkReconnection();
  }, []);

  // Fonction de simulation pour le test
  const mockReconnectionCheck = (): Promise<ReconnectionResponse> => {
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
      }, 1); // Simule un délai de 1 seconde
    });
  };

  const handleMint = () => {
    if (playerName.trim()) {
      setIsInGame(true);
      // Ici, vous pouvez ajouter la logique pour "minter" le personnage
      console.log(`Minting character for ${playerName}`);
    }
  };

return (
  <div className="w-full h-screen flex justify-center items-center bg-gray-900">
    <Card className="w-[350px] bg-gray-800 text-white shadow-xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl">ZIdle</CardTitle>
      </CardHeader>
      <CardContent>
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
              placeholder="Entrez votre nom"
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
        )}
      </CardContent>
    </Card>
    </div>
  );
};
