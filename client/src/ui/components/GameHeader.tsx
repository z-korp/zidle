import { CardHeader } from "@/ui/elements/card";
import { Button } from "@/ui/elements/button";
import { ArrowLeft, Menu } from "lucide-react";
import AddressDisplay from "./AddressDisplay";
import GoldImg from "./GoldImg";
import { Character } from "@/hooks/useCharacter";

interface GameHeaderProps {
  tokenId: string;
  character: Character | null;
  resetSelectedNft: () => void;
  onMenuClick: () => void;
}

/**
 * GameHeader component - Displays the game header with navigation and status
 * Shows NFT ID, wallet address, gold amount, and menu button
 */
export const GameHeader: React.FC<GameHeaderProps> = ({
  tokenId,
  character,
  resetSelectedNft,
  onMenuClick,
}) => {
  return (
    <CardHeader className="p-3">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 p-0 flex items-center justify-center"
              onClick={resetSelectedNft}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">NFT #{tokenId}</span>
            <AddressDisplay address={character?.walletAddress || ""} />
          </div>
          <div className="flex items-end gap-1">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">
                {character?.gold ?? 0}
              </span>
              <GoldImg className="h-8 w-8" />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 p-0 flex items-center justify-center hover:bg-gray-700"
              onClick={onMenuClick}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </CardHeader>
  );
};
