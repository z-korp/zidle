import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../elements/card";
import StatsAndInventory from "./StatsAndInventory";
import Actions from "./Actions";
import WorkingDiv from "./WorkingDiv";
import InventoryDiv from "./InventoryDiv";
import { Resource } from "@/dojo/game/types/resource";
import ReconnectionSummary from "./ReconnectionSummary";
import { Character, ReconnectionData } from "@/types/types";
import { useMiners } from "@/hooks/useMiners";
import useAccountCustom from "@/hooks/useAccountCustom";
import { usePlayer } from "@/hooks/usePlayer";
import { InventoryItem } from "@/dojo/game/models/miner";

const MainMenuCard = ({ character }: { character: Character }) => {
  const [isActing, setIsActing] = useState(false);
  const [isInInventory, setIsInInventory] = useState(false);
  const [selectedResource, setSelectedRessource] =
    useState<Resource | null>(null);
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

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  console.log("character", character);
  useEffect(() => {
    if (miners.length > 0) {
      const array = [
        ...miners[0].inventory,
        ...miners[1].inventory,
        ...miners[2].inventory,
      ];
      setInventory(array);
    }
  }, [miners]);


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
          resourceName={selectedResource?.getSubresourceName() ?? ""}
          secondsPerResource={
            selectedResource?.calculateGatheringSpeed(character.playerXp) ?? 0
          }
          xpPerResource={selectedResource?.calculateXp(character.playerXp) ?? 0}
        />
      );
    } else {
      return (
        <Actions
          setIsActing={setIsActing}
          setSelectedResource={setSelectedRessource}
          miners={miners}
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
