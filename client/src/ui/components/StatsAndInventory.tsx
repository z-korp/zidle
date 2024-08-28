import { Button } from "../elements/button";
import LevelIndicator from "./LevelIndicator";
import AnimatedSprite from "./AnimatedSprite";
import React from "react";
import { useCharacter } from "@/hooks/useCharacter";
import useAccountCustom from "@/hooks/useAccountCustom";

const StatsAndInventory = ({
  health,
  attack,
  critical,
  setIsInInventory,
}: {
  health: number;
  attack: number;
  critical: number;
  woodCut: number;
  rockMine: number;
  forging: number;
  playerXp: number;
  playerGold: number;
  setIsInInventory: (state: boolean) => void;
}) => {
  const [currentAnimation, setCurrentAnimation] = React.useState("idle");
  const { account } = useAccountCustom();

  const { character} = useCharacter(account?.address);

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-3 gap-1 text-sm items-center h-42">
        <div className="space-y-2">
          <div>Health: {health}</div>
          <div>Attack: {attack}</div>
          <div>Critical: {critical}%</div>
        </div>
        <div className="flex justify-center">
          <div style={{ transform: `translate(-5%, -0%)` }}>
            <AnimatedSprite
              width={192} // Largeur d'un seul frame
              height={192} // Hauteur d'un seul frame
              scale={1} // Agrandir l'image si nécessaire
              fps={10}
              currentAnimation={currentAnimation}
            />
          </div>
        </div>
        <div className="space-y-2 w-full ">
          <div className="text-sm flex items-center justify-between">
            <span className="font-medium">Chop:</span>
            <LevelIndicator currentXP={character?.woodProgress ?? 0} />
          </div>
          <div className="text-sm flex items-center justify-between">
            <span className="font-medium">Mine:</span>
            <LevelIndicator currentXP={character?.rockProgress ?? 0} />
          </div>
          <div className="text-sm flex items-center justify-between">
            <span className="font-medium">Food:</span>
            <LevelIndicator currentXP={character?.foodProgress ?? 0} />
          </div>
        </div>
      </div>
      {/* <div className="text-sm">lvl {level}</div> */}
      <div className="text-sm flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-medium">Gold :</span>
          <span>{character?.gold ?? 0}</span>
        </div>
      </div>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setIsInInventory(true)}
      >
        Inventory
      </Button>
    </div>
  );
};

export default StatsAndInventory;
