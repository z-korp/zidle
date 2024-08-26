import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Progress } from "@radix-ui/react-progress";
import { Button } from "../elements/button";
import { Card, CardHeader, CardTitle, CardContent } from "../elements/card";
import { SpriteAnimator } from "react-sprite-animator";
import StatsAndInventory from "./StatsAndInventory";
import Actions, { SelectedResource } from "./Actions";
import WorkingDiv from "./WorkingDiv";
import InventoryDiv, { InventoryItem } from "./InventoryDiv";
import { FoodType } from "@/dojo/game/elements/resources/food";
import { MineralType } from "@/dojo/game/elements/resources/mineral";
import { WoodType } from "@/dojo/game/elements/resources/wood";
import { Resource, ResourceType } from "@/dojo/game/types/resource";
import ReconnectionSummary from "./ReconnectionSummary";
import { Character, ReconnectionData } from "@/types/types";

const MainMenuCard = ({ character }: { character: Character }) => {
  const [isActing, setIsActing] = useState(false);
  const [isInInventory, setIsInInventory] = useState(false);
  const [selectedResource, setSelectedResource] =
    useState<SelectedResource | null>(null);
  const [showSummary, setShowSummary] = useState(true);

  const [isReconnecting, setIsReconnecting] = useState(false);
  const [reconnectionData, setReconnectionData] =
    useState<ReconnectionData | null>(null);

  const testInventoryItems: InventoryItem[] = [
    { id: "1", name: "Wood", quantity: 50, type: "wood", unitPrice: 1 },
    { id: "2", name: "Rock", quantity: 30, type: "rock", unitPrice: 2 },
    { id: "3", name: "Oak Wood", quantity: 15, type: "wood", unitPrice: 3 },
    { id: "4", name: "Granite", quantity: 25, type: "rock", unitPrice: 4 },
    { id: "5", name: "Pine Wood", quantity: 40, type: "wood", unitPrice: 5 },
    { id: "6", name: "Marble", quantity: 10, type: "rock", unitPrice: 6 },
    { id: "7", name: "Birch Wood", quantity: 20, type: "wood", unitPrice: 7 },
    { id: "8", name: "Sandstone", quantity: 35, type: "rock", unitPrice: 8 },
  ];

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
            setIsReconnecting(false);
          }}
        />
      );
    } else if (isInInventory) {
      return (
        <InventoryDiv
          items={testInventoryItems}
          setIsInInventory={setIsInInventory}
        />
      );
    } else if (isActing && selectedResource) {
      return (
        <WorkingDiv
          setIsActing={setIsActing}
          resourceName={resource?.getSubresourceName() ?? ""}
          secondsPerResource={
            resource?.calculateGatheringSpeed(character.playerLevel) ?? 0
          }
          xpPerResource={resource?.calculateXp(character.playerLevel) ?? 0}
        />
      );
    } else {
      return (
        <Actions
          setIsActing={setIsActing}
          playerLevel={character.playerLevel}
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
        <Button onClick={() => setShowSummary(true)}>
          View Character Summary
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <StatsAndInventory
            health={character.health}
            attack={character.attack}
            critical={character.critical}
            woodCut={character.woodCut}
            rockMine={character.rockMine}
            forging={character.forging}
            level={character.level}
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
