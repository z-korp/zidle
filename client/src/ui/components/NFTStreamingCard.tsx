import { Card, CardContent } from "../elements/card";
import { Button } from "../elements/button";
import { ArrowLeft } from "lucide-react";
import { useCharacter } from "@/hooks/useCharacter";
import { LoadingDots } from "./LoadingDots";
import LevelIndicator from "./LevelIndicator";
import AnimatedSprite, { AnimationType, MobType } from "./AnimatedSprite";

interface NFTDetailsCardProps {
  tokenId: string;
  onBack: () => void;
}

export const NFTDetailsCard = ({ tokenId, onBack }: NFTDetailsCardProps) => {
  const { character } = useCharacter(tokenId);

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
        </div>
      </CardContent>
    </Card>
  );
};

export default NFTDetailsCard;
