import { Character } from "@/hooks/useCharacter";
import { Shield, Pentagon } from "lucide-react";

interface EquipmentViewProps {
  character: Character;
}

/**
 * EquipmentView component - Displays character's equipment slots
 * Shows a pentacle with 5 equipment slots arranged in a circle
 */
export const EquipmentView: React.FC<EquipmentViewProps> = ({ character }) => {
  // Equipment slots positions in the pentacle with adjusted positions
  const slots = [
    { position: "top", className: "top-2 left-1/2 -translate-x-1/2" },
    { position: "topRight", className: "top-[30%] right-3" },
    { position: "bottomRight", className: "bottom-[10%] right-8" },
    { position: "bottomLeft", className: "bottom-[10%] left-8" },
    { position: "topLeft", className: "top-[30%] left-3" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Equipment</h2>

      {/* Pentacle container with adjusted width */}
      <div className="relative w-[280px] h-[300px] mx-auto">
        {/* Pentagon background */}
        <Pentagon className="absolute inset-0 w-full h-full text-gray-600 stroke-1 opacity-50" />

        {/* Equipment slots */}
        {slots.map((slot, index) => (
          <div
            key={slot.position}
            className={`absolute ${slot.className} w-16 h-16 rounded-lg bg-gray-700/80 border-2 border-gray-600 flex items-center justify-center transition-colors hover:bg-gray-600/80`}
          >
            <Shield className="w-8 h-8 text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
};
