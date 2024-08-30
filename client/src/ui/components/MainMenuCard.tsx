import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../elements/card";
import StatsAndInventory from "./StatsAndInventory";
import Actions from "./Actions";
import WorkingDiv from "./WorkingDiv";
import InventoryDiv from "./InventoryDiv";
import { Resource } from "@/dojo/game/types/resource";
import ReconnectionSummary from "./ReconnectionSummary";
import { InventoryItem } from "@/dojo/game/models/miner";
import { useCharacter } from "@/hooks/useCharacter";
import { useReconnectionData } from "@/hooks/useReconnectionData";

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

  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    character?.miningRessource ?? null,
  );
  const [showSummary, setShowSummary] = useState(true);

  const reconnectionData = useReconnectionData(tokenId);

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  useEffect(() => {
    if (!reconnectionData) {
      setShowSummary(false);
    }
  }, [reconnectionData]);
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

  const renderContent = () => {
    if (!character) {
      return <div>No character data available</div>;
    }
    if (isInInventory) {
      return (
        <InventoryDiv
          tokenId={character.token_id}
          items={inventory}
          setIsInInventory={setIsInInventory}
        />
      );
    } else if (selectedResource) {
      return (
        <WorkingDiv selectedResource={selectedResource} character={character} />
      );
    } else {
      return (
        <Actions
          tokenId={character.token_id}
          setSelectedResource={setSelectedResource}
          miners={character.miners}
        />
      );
    }
  };

  return (
    <Card className="w-[350px]">
      {!character ? (
        <CardContent>
          <div>No character data available. Please select a character.</div>
        </CardContent>
      ) : (
        <>
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
              />
              {renderContent()}
            </div>
          </CardContent>
          {showSummary && reconnectionData && (
            <ReconnectionSummary
              data={reconnectionData ?? { timePassed: "", resourcesGained: [] }}
              onContinue={() => {
                console.log("Continuing from reconnection...");
                setShowSummary(false);
              }}
            />
          )}
        </>
      )}
    </Card>
  );
};

export default MainMenuCard;
