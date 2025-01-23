import { useCharacter } from "@/hooks/useCharacter";
import AnimatedSprite, { AnimationType, MobType } from "./AnimatedSprite";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../elements/card";
import GoldImg from "./GoldImg";

interface NFTCardProps {
  tokenId: string;
  onSelect: (tokenId: string) => void;
}

const NFTCard: React.FC<NFTCardProps> = ({ tokenId, onSelect }) => {
  const { character } = useCharacter(tokenId);
  if (!character) return null;

  return (
    <Card
      className="bg-gray-800/80 border-gray-700 overflow-hidden hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={() => onSelect(tokenId)}
    >
      <CardHeader className="p-3 pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold text-white">
            {character.name}
          </CardTitle>
          <div className="flex items-center gap-2 text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
            <span>Lvl 1</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 flex justify-center items-center mt-2">
        <div className="flex justify-center items-center">
          <AnimatedSprite
            width={192}
            height={140}
            scale={1}
            fps={10}
            currentAnimation={AnimationType.Idle}
            mobType={Object.values(MobType)[parseInt(character.token_id) % 3]}
          />
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-1 text-yellow-400">
          <span className="font-medium">{character.gold}</span>
          <GoldImg className="w-5 h-5" />
        </div>
        <div className="flex gap-2 text-xs text-gray-400">
          <span>#{tokenId}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NFTCard;
