import { Card, CardContent } from "../elements/card";
import { Button } from "../elements/button";
import { ArrowLeft } from "lucide-react";
import { useCharacter } from "@/hooks/useCharacter";
import { LoadingDots } from "./LoadingDots";
import LevelIndicator from "./LevelIndicator";
import AnimatedSprite, { AnimationType, MobType } from "./AnimatedSprite";
import { ScrollArea } from "@/ui/elements/scroll-area";
import { useEventsStore } from "@/stores/useEventsStore";
import { DateTime } from "luxon";
import { timestamp } from "rxjs";
import { eventToString } from "@/utils/events";

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

  const { events } = useEventsStore();

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
                {events
                  .sort((e1, e2) => e1.timestamp - e2.timestamp)
                  .map((event, index) => (
                    <div
                      key={index}
                      className="text-sm bg-gray-700/30 p-2 rounded flex justify-between items-center"
                    >
                      <span className="text-gray-300">
                        {eventToString(event)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {DateTime.fromMillis(event.timestamp * 1000).toFormat(
                          "HH:mm:ss",
                        )}
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
