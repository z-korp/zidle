import { Card, CardContent } from "@/ui/elements/card";
import { Button } from "@/ui/elements/button";
import { blueprints } from "@/data/blueprints";
import { Character } from "@/hooks/useCharacter";

interface BlueprintViewProps {
  character: Character;
}

/**
 * BlueprintView component - Displays available items to craft
 * Shows crafting requirements, time, and rewards
 */
export const BlueprintView: React.FC<BlueprintViewProps> = ({ character }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {blueprints.map((blueprint) => (
        <Card key={blueprint.id} className="bg-gray-800/50">
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {blueprint.name}
                </h3>
                <p className="text-sm text-gray-400">{blueprint.description}</p>
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
                    <span className="text-gray-300">{resource.amount}</span>
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
  );
};
