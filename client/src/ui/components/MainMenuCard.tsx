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
import { Hammer, Sword, Menu, WalletIcon, Home } from "lucide-react";
import { blueprints } from "@/data/blueprints";
import { ScrollArea } from "@/ui/elements/scroll-area";
import { monsters, MonsterCategory } from "@/data/monsters";

interface MainMenuCardProps {
  tokenId: string;
  resetSelectedNft: () => void;
}

const MainMenuCard: React.FC<MainMenuCardProps> = ({
  tokenId,
  resetSelectedNft,
}) => {
  const { character } = useCharacter(tokenId);
  const [isInInventory, setIsInInventory] = useState(false);
  const [isInBlueprints, setIsInBlueprints] = useState(false);
  const [isInCombat, setIsInCombat] = useState(false);

  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    character?.miningRessource ?? null,
  );
  const [showSummary, setShowSummary] = useState(true);

  const reconnectionData = useReconnectionData(tokenId);

  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const [showMenu, setShowMenu] = useState(false);

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

  const renderMenu = () => (
    <>
      {showMenu && (
        <div className="fixed inset-0 z-50" onClick={() => setShowMenu(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="absolute right-4 top-16 flex flex-col gap-2 p-2 bg-gray-800 rounded-lg border border-gray-700 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
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

  const renderHeader = () => (
    <CardHeader className="p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">NFT #{tokenId}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 p-0 flex items-center justify-center hover:bg-gray-700"
          onClick={() => setShowMenu(!showMenu)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );

  const renderContent = () => {
    if (!character) {
      return <div>No character data available</div>;
    }

    if (isInCombat) {
      return (
        <>
          {renderHeader()}
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-1 gap-4">
                {monsters.map((monster) => (
                  <Card key={monster.id} className="bg-gray-800/50">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {monster.name}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {monster.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">
                            Level {monster.level}
                          </span>
                          <span className="text-xs text-gray-400">
                            {monster.category}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm bg-gray-900/50 p-2 rounded">
                          <span className="text-gray-400">Health: </span>
                          <span className="text-gray-300">
                            {monster.health}
                          </span>
                        </div>
                        <div className="text-sm bg-gray-900/50 p-2 rounded">
                          <span className="text-gray-400">Attack: </span>
                          <span className="text-gray-300">
                            {monster.attack}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between text-sm text-gray-400 bg-gray-900/30 p-2 rounded">
                        <span>Gold: +{monster.rewards.gold}</span>
                        <span>XP: +{monster.rewards.experience}</span>
                      </div>

                      <Button
                        className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300"
                        variant="outline"
                        disabled={
                          monster.requiredLevel &&
                          character.level < monster.requiredLevel
                        }
                      >
                        {monster.requiredLevel &&
                        character.level < monster.requiredLevel
                          ? `Requires Level ${monster.requiredLevel}`
                          : "Fight"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </>
      );
    }

    if (isInBlueprints) {
      return (
        <>
          {renderHeader()}
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-1 gap-4">
                {blueprints.map((blueprint) => (
                  <Card key={blueprint.id} className="bg-gray-800/50">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {blueprint.name}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {blueprint.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                            Level {blueprint.level}
                          </span>
                          <span className="text-xs text-gray-400">
                            {blueprint.category}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-300">
                          Required Resources:
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {blueprint.resources.map((resource) => (
                            <div
                              key={resource.type}
                              className="flex justify-between text-sm bg-gray-900/50 p-2 rounded"
                            >
                              <span className="capitalize text-gray-400">
                                {resource.type}
                              </span>
                              <span className="text-gray-300">
                                {resource.amount}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between text-sm text-gray-400 bg-gray-900/30 p-2 rounded">
                        <span>Crafting Time: {blueprint.craftingTime}s</span>
                        <span>XP: +{blueprint.experienceReward}</span>
                      </div>

                      <Button
                        className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300"
                        variant="outline"
                      >
                        Craft
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </>
      );
    }

    return (
      <>
        {renderHeader()}
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
      {renderContent()}
      {renderMenu()}
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
