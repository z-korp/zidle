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
      className="border border-gray-600 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out hover:bg-slate-600"
      onClick={() => onSelect(tokenId)}
    >
      <CardHeader>
        <div className="flex justify-center items-center">
          <CardTitle>{character.name}</CardTitle>
          <div className="text-right"></div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <AnimatedSprite
          width={192}
          height={140}
          scale={1}
          fps={10}
          currentAnimation={AnimationType.Idle}
          mobType={Object.values(MobType)[parseInt(character.token_id) % 3]}
        />
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="flex gap-1">
          <span className="text-lg">{character?.gold ?? 0}</span>
          <GoldImg />
        </div>
      </CardFooter>
    </Card>
  );
};

export default NFTCard;
