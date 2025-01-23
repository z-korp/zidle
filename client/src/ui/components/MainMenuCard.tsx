import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/ui/elements/card";
import StatsAndInventory from "./StatsAndInventory";
import Actions from "./Actions";
import WorkingDiv from "./WorkingDiv";
import InventoryDiv from "./InventoryDiv";
import { Resource } from "@/dojo/game/types/resource";
import ReconnectionSummary from "./ReconnectionSummary";
import { InventoryItem } from "@/dojo/game/models/miner";
import { useCharacter } from "@/hooks/useCharacter";
import { useReconnectionData } from "@/hooks/useReconnectionData";
import { Button } from "@/ui/elements/button";
import { Hammer, Sword, Menu, WalletIcon, Home, ArrowLeft } from "lucide-react";
import { blueprints } from "@/data/blueprints";
import { ScrollArea } from "@/ui/elements/scroll-area";
import { monsters, MonsterCategory } from "@/data/monsters";
import { CombatView } from "./CombatView";
import { BlueprintView } from "./BlueprintView";
import AddressDisplay from "./AddressDisplay";
import GoldImg from "./GoldImg";
import { GameHeader } from "./GameHeader";

interface MainMenuCardProps {
  tokenId: string;
  resetSelectedNft: () => void;
}

/**
 * MainMenuCard component - Main interface for the game
 * Handles different views (mining, combat, blueprints) and menu navigation
 */
const MainMenuCard: React.FC<MainMenuCardProps> = ({
  tokenId,
  resetSelectedNft,
}) => {
  const { character } = useCharacter(tokenId);
  const [isInInventory, setIsInInventory] = useState(false);
  const [isInBlueprints, setIsInBlueprints] = useState(false);
  const [isInCombat, setIsInCombat] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // Controls the burger menu visibility

  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    character?.miningRessource ?? null,
  );
  const [showSummary, setShowSummary] = useState(true);

  const reconnectionData = useReconnectionData(tokenId);

  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    if (character) {
      if (character.miners.length > 0) {
        const array = [
          ...character.miners[0].inventory,
          ...character.miners[1].inventory,
          ...character.miners[2].inventory,
        ];
        setInventory(array);
      }
    }
  }, [character, character?.miners]);

  useEffect(() => {
    if (character) {
      setSelectedResource(character.miningRessource);
    }
  }, [character]);

  /**
   * Renders the burger menu overlay with navigation buttons
   * Menu includes:
   * - Home: Returns to main mining view
   * - Combat: Opens combat interface
   * - Blueprints: Opens crafting interface
   */
  const renderMenu = () => (
    <>
      {showMenu && (
        <div className="fixed inset-0 z-50" onClick={() => setShowMenu(false)}>
          {/* Semi-transparent overlay */}
          <div className="absolute inset-0 bg-black/60" />

          {/* Menu container */}
          <div
            className="absolute right-4 top-16 flex flex-col gap-2 p-2 bg-gray-800 rounded-lg border border-gray-700 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Home button - Returns to main view */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 p-0 flex items-center justify-center hover:bg-gray-700"
              onClick={() => {
                setIsInCombat(false);
                setIsInBlueprints(false);
                setIsInInventory(false);
                setSelectedResource(null);
                setShowMenu(false);
              }}
            >
              <Home className="h-4 w-4" />
            </Button>

            {/* Combat button - Opens monster fighting interface */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 p-0 flex items-center justify-center hover:bg-gray-700"
              onClick={() => {
                setIsInCombat(true);
                setIsInBlueprints(false);
                setShowMenu(false);
              }}
            >
              <Sword className="h-4 w-4" />
            </Button>

            {/* Blueprints button - Opens crafting interface */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 p-0 flex items-center justify-center hover:bg-gray-700"
              onClick={() => {
                setIsInBlueprints(true);
                setIsInCombat(false);
                setShowMenu(false);
              }}
            >
              <Hammer className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );

  /**
   * Main render logic - Handles different views based on state
   * - Combat view: Shows available monsters to fight
   * - Blueprint view: Shows items that can be crafted
   * - Default view: Shows mining interface and character stats
   */
  const renderContent = () => {
    if (!character) {
      return <div>No character data available</div>;
    }

    if (isInCombat) {
      return (
        <>
          <GameHeader
            tokenId={tokenId}
            character={character}
            resetSelectedNft={resetSelectedNft}
            onMenuClick={() => setShowMenu(!showMenu)}
          />
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <CombatView character={character} />
            </ScrollArea>
          </CardContent>
        </>
      );
    }

    if (isInBlueprints) {
      return (
        <>
          <GameHeader
            tokenId={tokenId}
            character={character}
            resetSelectedNft={resetSelectedNft}
            onMenuClick={() => setShowMenu(!showMenu)}
          />
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <BlueprintView character={character} />
            </ScrollArea>
          </CardContent>
        </>
      );
    }

    // Default mining interface
    return (
      <>
        <GameHeader
          tokenId={tokenId}
          character={character}
          resetSelectedNft={resetSelectedNft}
          onMenuClick={() => setShowMenu(!showMenu)}
        />
        <CardContent>
          <div className="space-y-4 mt-4">
            <StatsAndInventory
              resetSelectedNft={resetSelectedNft}
              character={character}
              health={100}
              attack={10}
              critical={5}
              inventory={inventory}
              setIsInInventory={setIsInInventory}
              setIsInBlueprints={setIsInBlueprints}
              setIsInCombat={setIsInCombat}
            />
            {isInInventory ? (
              <InventoryDiv
                tokenId={character.token_id}
                items={inventory}
                setIsInInventory={setIsInInventory}
              />
            ) : selectedResource ? (
              <WorkingDiv
                selectedResource={selectedResource}
                character={character}
              />
            ) : (
              <Actions
                tokenId={character.token_id}
                setSelectedResource={setSelectedResource}
                miners={character.miners}
              />
            )}
          </div>
        </CardContent>
      </>
    );
  };

  return (
    <Card className="w-[350px] bg-gray-800 text-white shadow-xl border border-gray-600">
      {renderContent()} {/* Main content based on current view */}
      {renderMenu()} {/* Burger menu overlay */}
      {!isInBlueprints &&
        !isInCombat &&
        showSummary &&
        reconnectionData &&
        reconnectionData?.resourcesGained.findIndex((x) => x.quantity > 0) !==
          -1 && (
          <ReconnectionSummary
            data={reconnectionData ?? { timePassed: "", resourcesGained: [] }}
            onContinue={() => {
              setShowSummary(false);
            }}
          />
        )}
    </Card>
  );
};

export default MainMenuCard;
