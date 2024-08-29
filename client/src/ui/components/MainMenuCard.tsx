import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../elements/card";
import StatsAndInventory from "./StatsAndInventory";
import Actions from "./Actions";
import WorkingDiv from "./WorkingDiv";
import InventoryDiv from "./InventoryDiv";
import { Resource } from "@/dojo/game/types/resource";
import ReconnectionSummary from "./ReconnectionSummary";
import { ReconnectionData } from "@/types/types";
import { InventoryItem } from "@/dojo/game/models/miner";
import { useCharacter } from "@/hooks/useCharacter";
import { ArrowLeft } from "lucide-react";
import { Button } from "../elements/button";

interface MainMenuCardProps {
  tokenId: string;
  resetSelectedNft: () => void;
}

const MainMenuCard: React.FC<MainMenuCardProps> = ({
  tokenId,
  resetSelectedNft,
}) => {
  const { character } = useCharacter(tokenId);
  const [isActing, setIsActing] = useState(false);
  const [isInInventory, setIsInInventory] = useState(false);

  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    character?.miningRessource ?? null,
  );
  const [showSummary, setShowSummary] = useState(true);

  const [reconnectionData, setReconnectionData] =
    useState<ReconnectionData | null>({
      timePassed: "10 minutes",
      resourcesGained: [
        { name: "resource1", quantity: 10 },
        { name: "resource2", quantity: 20 },
      ],
    });

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
  }, [character?.miners]);

  useEffect(() => {
    if (character) {
      setSelectedResource(character.miningRessource);
    }
  }, [character]);

  const renderContent = () => {
    if (!character) {
      return <div>No character data available</div>;
    }

    if (showSummary) {
      return (
        <ReconnectionSummary
          data={reconnectionData ?? { timePassed: "", resourcesGained: [] }}
          onContinue={() => {
            console.log("Continuing from reconnection...");
            setShowSummary(false);
          }}
        />
      );
    } else if (isInInventory) {
      return (
        <InventoryDiv
          tokenId={character.token_id}
          items={inventory}
          setIsInInventory={setIsInInventory}
        />
      );
    } else if (selectedResource) {
      return (
        <WorkingDiv
          setIsActing={setIsActing}
          selectedResource={selectedResource}
          character={character}
        />
      );
    } else {
      return (
        <Actions
          tokenId={character.token_id}
          setIsActing={setIsActing}
          setSelectedResource={setSelectedResource}
          miners={character.miners}
        />
      );
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader className="flex">
        <Button
          variant="outline"
          className="absolute top-4 left-4 p-1"
          onClick={resetSelectedNft}
        >
          <ArrowLeft />
        </Button>

        <CardTitle className="text-center mt-0">zIdle</CardTitle>
      </CardHeader>
      {!character ? (
        <CardContent>
          <div>No character data available. Please select a character.</div>
        </CardContent>
      ) : (
        <>
          <CardContent>
            <div className="space-y-4">
              <StatsAndInventory
                character={character}
                health={100}
                attack={10}
                critical={5}
                setIsInInventory={setIsInInventory}
              />
              {renderContent()}
            </div>
          </CardContent>
          {showSummary && (
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
