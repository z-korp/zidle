import { Card, CardContent } from "../elements/card";
import { Button } from "../elements/button";
import {
  ArrowLeft,
  Radio,
  Sword,
  Star,
  Coins,
  Plus,
  MessageSquare,
  Shovel,
} from "lucide-react";
import { useCharacter } from "@/hooks/useCharacter";
import { LoadingDots } from "./LoadingDots";
import LevelIndicator from "./LevelIndicator";
import AnimatedSprite, { AnimationType, MobType } from "./AnimatedSprite";
import { ScrollArea } from "@/ui/elements/scroll-area";
import { useEventsStore } from "@/stores/useEventsStore";
import { DateTime } from "luxon";
import { useRef, useEffect, useState } from "react";
import { eventToString } from "@/utils/events";
import GoldImg from "./GoldImg";
import { Resource } from "@/dojo/game/types/resource";
import WorkingDiv from "./WorkingDiv";
import { GoalsSection } from "./Goals/GoalsSection";

interface NFTStreamingCardProps {
  tokenId: number;
  onBack: () => void;
}

export const NFTStreamingCard = ({
  tokenId,
  onBack,
}: NFTStreamingCardProps) => {
  const { character } = useCharacter(tokenId.toString());

  useEffect(() => {
    console.log("character", character);
  }, [character]);

  const { events } = useEventsStore();

  const scrollRef = useRef<HTMLDivElement>(null);

  const [isPulsing, setIsPulsing] = useState(false);

  const latestEvent = events
    .sort((e1, e2) => e2.timestamp - e1.timestamp)
    .at(0);

  const selectedResource = latestEvent
    ? Resource.from(latestEvent.rcsType, latestEvent.rcsSubType)
    : null;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing((prev) => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (text: string) => {
    if (text.toLowerCase().includes("stream")) {
      return <Radio className="w-4 h-4 text-green-400" />;
    }
    if (
      text.toLowerCase().includes("battle") ||
      text.toLowerCase().includes("fight")
    ) {
      return <Sword className="w-4 h-4 text-red-400" />;
    }
    if (
      text.toLowerCase().includes("level") ||
      text.toLowerCase().includes("xp")
    ) {
      return <Star className="w-4 h-4 text-yellow-400" />;
    }
    if (
      text.toLowerCase().includes("trade") ||
      text.toLowerCase().includes("sold") ||
      text.toLowerCase().includes("bought")
    ) {
      return <Coins className="w-4 h-4 text-purple-400" />;
    }
    if (
      text.toLowerCase().includes("mint") ||
      text.toLowerCase().includes("created")
    ) {
      return <Plus className="w-4 h-4 text-pink-400" />;
    }
    if (text.toLowerCase().includes("mining")) {
      return <Shovel className="w-4 h-4 text-blue-400" />;
    }
    return <MessageSquare className="w-4 h-4 text-blue-400" />;
  };

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
          <div>{character.name}</div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{character?.gold ?? 0}</span>
            <GoldImg className="h-8 w-8" />
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-1 text-sm items-center h-42 relative">
            <div className="space-y-2 flex flex-col z-10">
              <div>Health: {100}</div>
              <div>Attack: {5}</div>
              <div>Critical: {5}%</div>
            </div>

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

          <div className="mt-4">
            <GoalsSection />
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">Ongoing Activity</h3>
            {selectedResource && character ? (
              <WorkingDiv
                selectedResource={selectedResource}
                character={character}
                isStreaming={true}
              />
            ) : (
              <div className="bg-gray-700/50 p-3 rounded-md mb-4 text-gray-400 text-sm text-center">
                No activity yet
              </div>
            )}
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2">Activity History</h3>
            <ScrollArea className="h-[200px] w-full rounded-md border border-gray-700">
              <div ref={scrollRef} className="p-4 space-y-2">
                {events
                  .sort((e1, e2) => e2.timestamp - e1.timestamp)
                  .map((event, index) => (
                    <div
                      key={index}
                      className="text-sm bg-gray-700/30 p-2 rounded flex items-center gap-2"
                    >
                      <div className="flex-shrink-0">
                        {getActivityIcon(eventToString(event))}
                      </div>
                      <span className="text-gray-300 flex-grow">
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
