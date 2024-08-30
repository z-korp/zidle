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
import { getLevelFromXp } from "@/utils/level";
import { useDojo } from "@/dojo/useDojo";
import { Account } from "starknet";

interface ActionsProps {
  tokenId: string;
  miners: Miner[];
  setSelectedResource: (value: Resource | null) => void;
}

const Actions: React.FC<ActionsProps> = ({
  tokenId,
  miners,
  setSelectedResource,
}) => {
  const [localSelections, setLocalSelections] = useState<{
    [key in ResourceType]?: Resource | null;
  }>({
    [ResourceType.Wood]: null,
    [ResourceType.Mineral]: null,
    [ResourceType.Food]: null,
  });

  const {
    setup: {
      systemCalls: { mine },
    },
  } = useDojo();
  const { account } = useAccountCustom();

  const { character } = useCharacter(tokenId);

  const handleSelect = (resourceType: ResourceType, resource: Resource) => {
    setLocalSelections((prev) => ({
      ...prev,
      [resourceType]: resource,
      // Désélectionner les autres types de ressources
      ...Object.values(ResourceType).reduce(
        (acc, type) => {
          if (type !== resourceType) {
            acc[type] = null;
          }
          return acc;
        },
        {} as { [key in ResourceType]?: Resource | null },
      ),
    }));
  };

  const handleGo = async (resourceType: ResourceType) => {
    const selectedResource = localSelections[resourceType];
    if (selectedResource) {
      setSelectedResource(selectedResource);
    }

    if (!character?.token_id) return;

    await mine({
      account: account as Account,
      token_id: tokenId,
      rcs_type: selectedResource?.into() ?? 0,
      rcs_sub_type: selectedResource?.getSubresource().into() ?? 0,
    });
  };
  const getLevelForResourceType = (resourceType: ResourceType): number => {
    if (!character) return 0;
    switch (resourceType) {
      case ResourceType.Wood:
        return getLevelFromXp(character.woodProgress);
      case ResourceType.Mineral:
        return getLevelFromXp(character.rockProgress);
      case ResourceType.Food:
        return getLevelFromXp(character.foodProgress);
      default:
        return 0;
    }
  };
  const renderMinerDropdown = (resourceType: ResourceType) => {
    const filteredMiners = miners.filter(
      (miner) => miner.resource.value === resourceType,
    );
    const actionText =
      resourceType === ResourceType.Wood
        ? "Chop wood"
        : resourceType === ResourceType.Mineral
          ? "Mine rock"
          : "Hunt for food";

    const resourceItems = filteredMiners.flatMap(
      (miner) =>
        miner.inventory
          ?.filter((item) => item.rcs.value === resourceType)
          .map((item, index) => ({
            id: `${miner.id}-${index}`,
            resource: item.rcs,
          })) || [],
    );

    const localSelectedResource = localSelections[resourceType];
    const currentLevel = getLevelForResourceType(resourceType);

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span>{actionText}</span>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                className="w-[136px] flex justify-between items-center"
              >
                <Button variant="outline" size="sm">
                  {localSelectedResource
                    ? localSelectedResource.getSubresourceName()
                    : `Select resource`}{" "}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {resourceItems.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onSelect={() => handleSelect(resourceType, item.resource)}
                    className="flex justify-between items-center"
                    disabled={currentLevel < item.resource.minLevel()}
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
            <div className="flex justify-between">
              <p>XP: {localSelectedResource.baseXp()}</p>
              <p>
                Time per unit:{" "}
                {localSelectedResource
                  .calculateGatheringDurationPerUnit(
                    getLevelFromXp(
                      resourceType === ResourceType.Wood
                        ? character.woodProgress
                        : resourceType === ResourceType.Mineral
                          ? character.rockProgress
                          : character.foodProgress,
                    ),
                  )
                  .toFixed(2)}{" "}
                seconds
              </p>
            </div>
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
