import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "../elements/button";
import { FoodType } from "@/dojo/game/elements/resources/food";
import { MineralType } from "@/dojo/game/elements/resources/mineral";
import { WoodType } from "@/dojo/game/elements/resources/wood";
import { ResourceType, Resource } from "@/dojo/game/types/resource";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/ui/elements/dropdown-menu";

interface ActionsProps {
  setIsActing: (value: boolean) => void;
  playerLevel: number;
  selectedResource: SelectedResource | null;
  setSelectedResource: (resource: SelectedResource | null) => void;
}

export type SelectedResource = {
  type: ResourceType;
  value: WoodType | MineralType | FoodType | null;
};

const Actions: React.FC<ActionsProps> = ({ setIsActing, playerLevel,selectedResource, setSelectedResource }) => {

  const handleSelect = (
    resourceType: ResourceType,
    value: WoodType | MineralType | FoodType,
  ) => {
    setSelectedResource({ type: resourceType, value });
  };

  const renderResourceDropdown = (
    resourceType: ResourceType,
    options: typeof WoodType | typeof MineralType | typeof FoodType,
  ) => {
    const isSelected = selectedResource?.type === resourceType;
    const selectedValue = isSelected ? selectedResource.value : null;
    const resource = selectedValue
      ? new Resource(resourceType, selectedValue)
      : null;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span>{`Gather ${resourceType}`}</span>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {selectedValue || `Select ${resourceType}`}{" "}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.values(options)
                  .filter((value) => value !== "None")
                  .map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onSelect={() => handleSelect(resourceType, type)}
                    >
                      {type}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="sm"
              onClick={() => setIsActing(true)}
              disabled={!isSelected}
            >
              Go
            </Button>
          </div>
        </div>
        {resource && (
          <div className="text-sm">
            <p>
              Time per unit:{" "}
              {resource.calculateGatheringSpeed(playerLevel).toFixed(2)} seconds
            </p>
            <p>XP gained: {resource.calculateXp(playerLevel)} XP</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderResourceDropdown(ResourceType.Wood, WoodType)}
      {renderResourceDropdown(ResourceType.Mineral, MineralType)}
      {renderResourceDropdown(ResourceType.Food, FoodType)}
    </div>
  );
};

export default Actions;