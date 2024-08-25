import React, { useState, useEffect } from "react";
import { useTheme } from "@/ui/elements/theme-provider";
import MainMenuCard from "../components/MainMenuCard";
import ReconnectionSummary from "../components/ReconnectionSummary.tsx";

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

  useEffect(() => {
    // Simuler une vérification de reconnexion
    const checkReconnection = async () => {
      // Ici, vous feriez normalement un appel API pour vérifier l'état de la session
      const response: ReconnectionResponse = await mockReconnectionCheck();
      if (response.isReconnecting) {
        setIsReconnecting(true);
        setReconnectionData(response.data);
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

  return (
    <div className="w-full h-screen flex justify-center items-center">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50 animate-zoom-in-out"
          style={{ backgroundColor: `red` }}
        />
      </div>

      {isReconnecting ? (
        <ReconnectionSummary
          data={reconnectionData ?? { timePassed: "", resourcesGained: [] }}
          onContinue={() => {
            console.log("Continuing from reconnection...");
            setIsReconnecting(false);
            // Ajoutez ici d'autres actions nécessaires après la reconnexion
          }}
        />
      ) : (
        <MainMenuCard />
      )}
    </div>
  );
};
