import { useCharacter } from "@/hooks/useCharacter";
import AnimatedSprite from "./AnimatedSprite";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../elements/card";

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
        <CardTitle>{character.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <AnimatedSprite
          width={192}
          height={192}
          scale={1}
          fps={10}
          currentAnimation="idle"
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <p>Gold: {character.gold}</p>
      </CardFooter>
    </Card>
  );
};

export default NFTCard;
