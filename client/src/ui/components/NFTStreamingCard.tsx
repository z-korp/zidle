import { Card, CardContent } from "../elements/card";
import { Button } from "../elements/button";
import { ArrowLeft } from "lucide-react";
import { useCharacter } from "@/hooks/useCharacter";
import { LoadingDots } from "./LoadingDots";
import LevelIndicator from "./LevelIndicator";
import AnimatedSprite, { AnimationType, MobType } from "./AnimatedSprite";
import { ScrollArea } from "@/ui/elements/scroll-area";
import { useEffect, useState } from "react";

interface NFTStreamingCardProps {
  tokenId: string;
  onBack: () => void;
}

interface NFTEvent {
  timestamp: string;
  action: string;
}

export const NFTStreamingCard = ({
  tokenId,
  onBack,
}: NFTStreamingCardProps) => {
  const { character } = useCharacter(tokenId);
  const [events, setEvents] = useState<NFTEvent[]>([]);

  // Simuler la récupération des événements en temps réel
  useEffect(() => {
    // Ajouter un événement initial
    setEvents([
      {
        timestamp: new Date().toLocaleTimeString(),
        action: "Started streaming session",
      },
    ]);

    // Simuler des nouveaux événements toutes les 5 secondes
    const interval = setInterval(() => {
      const actions = [
        "Mined 5 rocks",
        "Chopped 3 wood",
        "Gathered 2 food",
        "Level up! Mining reached level 2",
        "Found rare resource",
      ];

      setEvents((prev) => [
        {
          timestamp: new Date().toLocaleTimeString(),
          action: actions[Math.floor(Math.random() * actions.length)],
        },
        ...prev,
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!character) {
    return (
      <Card className="w-[350px] bg-gray-800 text-white shadow-xl border border-gray-600">
        <CardContent className="p-4 text-center">
          <span>
            Loading NFT details <LoadingDots />
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[350px] bg-gray-800 text-white shadow-xl border border-gray-600">
      <CardContent className="p-4">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="w-8" />
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-1 text-sm items-center h-42 relative">
            {/* Combat Stats */}
            <div className="space-y-2 flex flex-col z-10">
              <div>Health: {100}</div>
              <div>Attack: {5}</div>
              <div>Critical: {5}%</div>
            </div>

            {/* Character Animation */}
            <div className="flex justify-center z-0">
              <div>
                <AnimatedSprite
                  width={192}
                  height={140}
                  scale={1}
                  fps={10}
                  currentAnimation={AnimationType.Idle}
                  mobType={
                    Object.values(MobType)[parseInt(character.token_id) % 3]
                  }
                />
              </div>
            </div>

            {/* Resource Levels */}
            <div className="space-y-2 w-full z-10">
              <div className="text-sm flex items-center justify-between">
                <span className="font-medium">Chop lvl</span>
                <LevelIndicator currentXP={character?.woodProgress ?? 0} />
              </div>
              <div className="text-sm flex items-center justify-between">
                <span className="font-medium">Mine lvl</span>
                <LevelIndicator currentXP={character?.rockProgress ?? 0} />
              </div>
              <div className="text-sm flex items-center justify-between">
                <span className="font-medium">Food lvl</span>
                <LevelIndicator currentXP={character?.foodProgress ?? 0} />
              </div>
            </div>
          </div>

          {/* Live Events Log */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">Live Activity</h3>
            <ScrollArea className="h-[200px] w-full rounded-md border border-gray-700">
              <div className="p-4 space-y-2">
                {events.map((event, index) => (
                  <div
                    key={index}
                    className="text-sm bg-gray-700/30 p-2 rounded flex justify-between items-center"
                  >
                    <span className="text-gray-300">{event.action}</span>
                    <span className="text-xs text-gray-500">
                      {event.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NFTStreamingCard;
