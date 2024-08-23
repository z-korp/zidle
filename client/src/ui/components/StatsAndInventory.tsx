import { SpriteAnimator } from "react-sprite-animator";
import { Button } from "../elements/button";
import warriorBlue from "/assets/Warrior_Blue.png";

const StatsAndInventory = ({
  health,
  attack,
  critical,
  woodCut,
  rockMine,
  forging,
  level,
}: {
  health: number;
  attack: number;
  critical: number;
  woodCut: number;
  rockMine: number;
  forging: number;
  level: number;
}) => (
  <div className="space-y-1">
    <div className="grid grid-cols-3 gap-1 text-sm items-center">
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
      <div className="space-y-2">
        <div>Wood cut: {woodCut}</div>
        <div>Rock mine: {rockMine}</div>
        <div>Forging: {forging}</div>
      </div>
    </div>
    <div className="text-sm">lvl {level}</div>
    <Button variant="outline" className="w-full">
      Inventory
    </Button>
  </div>
);

export default StatsAndInventory;
