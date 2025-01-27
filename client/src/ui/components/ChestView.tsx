import React from "react";
import { Character } from "@/dojo/game/types";

interface ChestViewProps {
  character: Character;
}

export const ChestView: React.FC<ChestViewProps> = ({ character }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-center mb-4">Chest Opening</h2>
      <div className="grid gap-4">
        {/* Contenu à implémenter */}
        <p className="text-center text-gray-400">Coming soon...</p>
      </div>
    </div>
  );
};
