import { SpriteAnimator } from "react-sprite-animator";
import { Button } from "../elements/button";
import warriorBlue from "/assets/Warrior_Blue.png";
import LevelIndicator from "./LevelIndicator";

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
}) => (
  <div className="space-y-1">
    <div className="grid grid-cols-3 gap-1 text-sm items-center h-42">
      <div className="space-y-2">
        <div>Health: {health}</div>
        <div>Attack: {attack}</div>
        <div>Critical: {critical}%</div>
      </div>
      <div className="flex justify-center">
        <div style={{ transform: `translate(-5%, -0%)` }}>
          <SpriteAnimator
            sprite={warriorBlue}
            width={192}
            height={192}
            scale={1}
            fps={10}
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
    <div className="text-sm flex items-center space-x-2">
      <span className="font-medium self-center">lvl</span>
      <LevelIndicator currentXP={3000} />
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

export default StatsAndInventory;
