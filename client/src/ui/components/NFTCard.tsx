import { useCharacter } from "@/hooks/useCharacter";
import AnimatedSprite, { AnimationType, MobType } from "./AnimatedSprite";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../elements/card";
import gold from "/assets/gold.png";

interface NFTCardProps {
  tokenId: string;
  onSelect: (tokenId: string) => void;
}

const NFTCard: React.FC<NFTCardProps> = ({ tokenId, onSelect }) => {
  const { character } = useCharacter(tokenId);
  if (!character) return null;

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={() => onSelect(tokenId)}
    >
      <CardHeader>
        <div className="flex justify-center items-center">
          <CardTitle>{character.name}</CardTitle>
          <div className="text-right">
          
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <AnimatedSprite
          width={192}
          height={192}
          scale={2}
          fps={10}
          currentAnimation={AnimationType.Idle}
          mobType={Object.values(MobType)[parseInt(character.token_id) % 3]}
        />
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="flex justify-aroun">
          <img src={gold} alt="Gold" className="w-8 h-8 pixelated-image" />
          <span className="text-lg">{character?.gold ?? 0}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NFTCard;
