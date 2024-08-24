import React from "react";
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

const MainMenuCard = ({
  playerLevel = 5,
  health = 50,
  woodCut = 1,
  attack = 5,
  rockMine = 1,
  critical = 1,
  forging = 1,
  level = 1,
  woodProgress = 33,
  rockProgress = 0,
}) => {
  const [isActing, setIsActing] = React.useState(false);
  const [isInInventory, setIsInInventory] = React.useState(false);
  const [selectedResource, setSelectedResource] = React.useState<SelectedResource | null>(null);
  

  const testInventoryItems: InventoryItem[] = [
    { id: "1", name: "Wood", quantity: 50, type: "wood" },
    { id: "2", name: "Rock", quantity: 30, type: "rock" },
    { id: "3", name: "Oak Wood", quantity: 15, type: "wood" },
    { id: "4", name: "Granite", quantity: 25, type: "rock" },
    { id: "5", name: "Pine Wood", quantity: 40, type: "wood" },
    { id: "6", name: "Marble", quantity: 10, type: "rock" },
    { id: "7", name: "Birch Wood", quantity: 20, type: "wood" },
    { id: "8", name: "Sandstone", quantity: 35, type: "rock" },
  ];
  const selectedValue = selectedResource?.value ?? null;
  const resource = selectedValue
    ? new Resource(selectedResource?.type as ResourceType, selectedValue)
    : null;

  const renderContent = () => {
    if (isInInventory) {
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
          resourceName={resource?.getSubresourceName() ??''}
          secondsPerResource={resource?.calculateGatheringSpeed(playerLevel) ?? 0}
          xpPerResource={resource?.calculateXp(playerLevel) ?? 0}
        />
      );
    } else {
      return (
        <Actions
          setIsActing={setIsActing}
          playerLevel={5}
          selectedResource={selectedResource}
          setSelectedResource={setSelectedResource}
        />
      );
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-center">ZIdle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <StatsAndInventory
            health={health}
            attack={attack}
            critical={critical}
            woodCut={woodCut}
            rockMine={rockMine}
            forging={forging}
            level={level}
            setIsInInventory={setIsInInventory}
          />
          {renderContent()}
        </div>
      </CardContent>
    </Card>
  );
};

export default MainMenuCard;