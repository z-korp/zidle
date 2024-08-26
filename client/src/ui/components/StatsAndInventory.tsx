import { SpriteAnimator } from "react-sprite-animator";
import { Button } from "../elements/button";
import warriorBlue from "/assets/Warrior_Blue.png";
import LevelIndicator from "./LevelIndicator";
import AnimatedSprite from "./AnimatedSprite";
import React from "react";

const animations = {
  idle: { row: 0, frameCount: 6 },
  run: { row: 1, frameCount: 6 },
  attack: { row: 2, frameCount: 6 },
  defend: { row: 3, frameCount: 6 },
  die: { row: 4, frameCount: 6 },
  jump: { row: 5, frameCount: 6 },
  shoot: { row: 6, frameCount: 6 },
  walk: { row: 7, frameCount: 6 },
};
const StatsAndInventory = ({
  health,
  attack,
  critical,
  woodCut,
  rockMine,
  forging,
  level,
  setIsInInventory,
}: {
  health: number;
  attack: number;
  critical: number;
  woodCut: number;
  rockMine: number;
  forging: number;
  level: number;
  setIsInInventory: (state: boolean) => void;
}) => {
  const [currentAnimation, setCurrentAnimation] = React.useState("run");
  
  return(
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
          width={192}  // Largeur d'un seul frame
          height={192} // Hauteur d'un seul frame
          scale={1}   // Agrandir l'image si nécessaire
          fps={10}
          currentAnimation={currentAnimation}
        />

        </div>
      </div>
      <div className="space-y-2 w-full ">
        <div className="text-sm flex items-center justify-between">
          <span className="font-medium">Chop:</span>
          <LevelIndicator currentXP={3000} />
        </div>
        <div className="text-sm flex items-center justify-between">
          <span className="font-medium">Mine:</span>
          <LevelIndicator currentXP={3000} />
        </div>
        <div className="text-sm flex items-center justify-between">
          <span className="font-medium">Forging:</span>
          <LevelIndicator currentXP={3000} />
        </div>
      </div>
    </div>
    {/* <div className="text-sm">lvl {level}</div> */}
    <div className="text-sm flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="font-medium">lvl</span>
        <LevelIndicator currentXP={3000} />
      </div>
      <div className="flex items-center space-x-2">
        <span className="font-medium">Gold :</span>
        <span>1000</span>
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
}

export default StatsAndInventory;
