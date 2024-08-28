import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "../elements/button";
import { ResourceType, Resource } from "@/dojo/game/types/resource";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/ui/elements/dropdown-menu";
import { Miner } from "@/dojo/game/models/miner";
import { useCharacter } from "@/hooks/useCharacter";
import useAccountCustom from "@/hooks/useAccountCustom";

interface ActionsProps {
  setIsActing: (value: boolean) => void;
  miners: Miner[];
  setSelectedResource: (value: Resource | null) => void;
}

const Actions: React.FC<ActionsProps> = ({
  setIsActing,
  miners,
  setSelectedResource
}) => {
  const [localSelections, setLocalSelections] = useState<{
    [key in ResourceType]?: Resource | null
  }>({
    [ResourceType.Wood]: null,
    [ResourceType.Mineral]: null,
    [ResourceType.Food]: null,
  });
  const { account } = useAccountCustom();

  const { character} = useCharacter(account?.address);


  

  const handleSelect = (resourceType: ResourceType, resource: Resource) => {
    setLocalSelections(prev => ({
      ...prev,
      [resourceType]: resource,
      // Désélectionner les autres types de ressources
      ...Object.values(ResourceType).reduce((acc, type) => {
        if (type !== resourceType) {
          acc[type] = null;
        }
        return acc;
      }, {} as { [key in ResourceType]?: Resource | null })
    }));
  };

  const handleGo = (resourceType: ResourceType) => {
    const selectedResource = localSelections[resourceType];
    if (selectedResource) {
      setSelectedResource(selectedResource);
      setIsActing(true);
    }
  };

  const renderMinerDropdown = (resourceType: ResourceType) => {
    console.log("miners", miners);
    const filteredMiners = miners.filter(miner => miner.resource.value === resourceType);
   
    const actionText = resourceType === ResourceType.Wood ? 'Chop wood' :
                       resourceType === ResourceType.Mineral ? 'Mine rock' :
                       'Hunt for food';

                       console.log("type", resourceType);
                       console.log("filteredMiners", filteredMiners);
    const resourceItems = filteredMiners.flatMap((miner) => 
      miner.inventory?.filter(item => item.rcs.value === resourceType).map((item, index) => ({
        id: `${miner.id}-${index}`,
        resource: item.rcs
      })) || []
    );

    const localSelectedResource = localSelections[resourceType];

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span>{actionText}</span>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {localSelectedResource ? localSelectedResource.getSubresourceName() : `Select resource`}{" "}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {resourceItems.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onSelect={() => handleSelect(resourceType, item.resource)}
                    className="flex justify-between items-center"
                  >
                    <span>{item.resource.getSubresourceName()}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      Lvl : {item.resource.minLevel()}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="sm"
              onClick={() => handleGo(resourceType)}
              disabled={!localSelectedResource}
            >
              Go
            </Button>
          </div>
        </div>
        {localSelectedResource && character && (
  <div className="text-sm">
    <p>Resource: {localSelectedResource.getSubresourceName()}</p>
    <p>XP: {localSelectedResource.baseXp()}</p>
    <p>
      Time per unit:{" "}
      {localSelectedResource.calculateGatheringSpeed(
        resourceType === ResourceType.Wood ? character.woodProgress :
        resourceType === ResourceType.Mineral ? character.rockProgress :
        character.foodProgress
      ).toFixed(2)} seconds
    </p>
    <p>XP gained: {localSelectedResource.calculateXp(
      resourceType === ResourceType.Wood ? character.woodProgress :
      resourceType === ResourceType.Mineral ? character.rockProgress :
      character.foodProgress
    )} XP</p>
  </div>
)}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderMinerDropdown(ResourceType.Wood)}
      {renderMinerDropdown(ResourceType.Mineral)}
      {renderMinerDropdown(ResourceType.Food)}
    </div>
  );
};

export default Actions;