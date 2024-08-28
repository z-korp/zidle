import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../elements/card";
import StatsAndInventory from "./StatsAndInventory";
import Actions, { SelectedResource } from "./Actions";
import WorkingDiv from "./WorkingDiv";
import InventoryDiv from "./InventoryDiv";
import { Resource, ResourceType } from "@/dojo/game/types/resource";
import ReconnectionSummary from "./ReconnectionSummary";
import { Character, ReconnectionData } from "@/types/types";
import { useMiners } from "@/hooks/useMiners";
import useAccountCustom from "@/hooks/useAccountCustom";
import { usePlayer } from "@/hooks/usePlayer";
import { InventoryItem } from "@/dojo/game/models/miner";

const MainMenuCard = ({ character }: { character: Character }) => {
  const [isActing, setIsActing] = useState(false);
  const [isInInventory, setIsInInventory] = useState(false);
  const [selectedResource, setSelectedResource] =
    useState<SelectedResource | null>(null);
  const [showSummary, setShowSummary] = useState(true);

  const { account } = useAccountCustom();
  const { player } = usePlayer({ playerId: account?.address });
  const { miners, currentMiner } = useMiners({ playerId: player?.id });
  const [reconnectionData, setReconnectionData] =
    useState<ReconnectionData | null>({
      timePassed: "10 minutes",
      resourcesGained: [
        { name: "resource1", quantity: 10 },
        { name: "resource2", quantity: 20 },
      ],
    });

  if (miners && miners[0]) {
    console.log(miners[0].resource);
    console.log(miners[0].resource_number);
    console.log(miners[0].xp);
  }

  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  /*const testInventoryItems: InventoryItem[] = [
    { id: "1", name: "Wood", quantity: 50, type: "wood", unitPrice: 1 },
    { id: "2", name: "Rock", quantity: 30, type: "rock", unitPrice: 2 },
    { id: "3", name: "Oak Wood", quantity: 15, type: "wood", unitPrice: 3 },
    { id: "4", name: "Granite", quantity: 25, type: "rock", unitPrice: 4 },
    { id: "5", name: "Pine Wood", quantity: 40, type: "wood", unitPrice: 5 },
    { id: "6", name: "Marble", quantity: 10, type: "rock", unitPrice: 6 },
    { id: "7", name: "Birch Wood", quantity: 20, type: "wood", unitPrice: 7 },
    { id: "8", name: "Sandstone", quantity: 35, type: "rock", unitPrice: 8 },
  ];*/

  useEffect(() => {
    if (miners.length > 0) {
      console.log("miners[0].inventory", miners[0].inventory);
      const array = [
        ...miners[0].inventory,
        ...miners[1].inventory,
        ...miners[2].inventory,
      ];
      setInventory(array);
    }
  }, [miners]);

  const selectedValue = selectedResource?.value ?? null;
  const resource = selectedValue
    ? new Resource(selectedResource?.type as ResourceType, selectedValue)
    : null;

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
        <InventoryDiv items={inventory} setIsInInventory={setIsInInventory} />
      );
    } else if (isActing && selectedResource) {
      return (
        <WorkingDiv
          setIsActing={setIsActing}
          resourceName={resource?.getSubresourceName() ?? ""}
          secondsPerResource={
            resource?.calculateGatheringSpeed(character.playerXp) ?? 0
          }
          xpPerResource={resource?.calculateXp(character.playerXp) ?? 0}
        />
      );
    } else {
      return (
        <Actions
          setIsActing={setIsActing}
          playerLevel={character.playerXp}
          selectedResource={selectedResource}
          setSelectedResource={setSelectedResource}
        />
      );
    }
  };

  if (!character) {
    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-center">ZIdle</CardTitle>
        </CardHeader>
        <CardContent>
          <div>No character data available. Please select a character.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-center">ZIdle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <StatsAndInventory
            health={character.health}
            attack={character.attack}
            critical={character.critical}
            woodCut={character.woodProgress}
            rockMine={character.rockProgress}
            forging={character.forgeProgress}
            playerXp={character.playerXp}
            playerGold={player?.gold ? player.gold : 0}
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
    </Card>
  );
};

export default MainMenuCard;
