import { Card, CardContent } from "@/ui/elements/card";
import { Button } from "@/ui/elements/button";
import { monsters } from "@/data/monsters";
import { Character } from "@/hooks/useCharacter";

interface CombatViewProps {
  character: Character;
}

/**
 * CombatView component - Displays available monsters to fight
 * Shows monster stats, rewards, and level requirements
 */
export const CombatView: React.FC<CombatViewProps> = ({ character }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {monsters.map((monster) => (
        <Card key={monster.id} className="bg-gray-800/50">
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white">{monster.name}</h3>
                <p className="text-sm text-gray-400">{monster.description}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">
                  Level {monster.level}
                </span>
                <span className="text-xs text-gray-400">
                  {monster.category}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm bg-gray-900/50 p-2 rounded">
                <span className="text-gray-400">Health: </span>
                <span className="text-gray-300">{monster.health}</span>
              </div>
              <div className="text-sm bg-gray-900/50 p-2 rounded">
                <span className="text-gray-400">Attack: </span>
                <span className="text-gray-300">{monster.attack}</span>
              </div>
            </div>

            <div className="flex justify-between text-sm text-gray-400 bg-gray-900/30 p-2 rounded">
              <span>Gold: +{monster.rewards.gold}</span>
              <span>XP: +{monster.rewards.experience}</span>
            </div>

            <Button
              className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300"
              variant="outline"
              disabled={
                monster.requiredLevel && character.level < monster.requiredLevel
              }
            >
              {monster.requiredLevel && character.level < monster.requiredLevel
                ? `Requires Level ${monster.requiredLevel}`
                : "Fight"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
