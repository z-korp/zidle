import { Card, CardContent } from "@/ui/elements/card";
import { Character } from "@/hooks/useCharacter";
import { ChestScrollArea } from "../ChestScrollArea";

interface ChestViewProps {
  character: Character;
}

export const ChestView: React.FC<ChestViewProps> = ({ character }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Available Chests</h2>
          <span className="text-sm text-gray-400">Scroll to see more →</span>
        </div>

        <ChestScrollArea />

        <div className="text-sm text-gray-400 bg-gray-900/30 p-4 rounded">
          <p>Open chests to receive random rewards including:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Resources and Materials</li>
            <li>Special Items</li>
            <li>Experience Points</li>
            <li>Gold</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
