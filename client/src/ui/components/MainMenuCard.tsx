import React from "react";
import { ChevronDown } from "lucide-react";
import { Progress } from "@radix-ui/react-progress";
import { Button } from "../elements/button";
import { Card, CardHeader, CardTitle, CardContent } from "../elements/card";
import { SpriteAnimator } from "react-sprite-animator";
import StatsAndInventory from "./StatsAndInventory";
import Actions from "./Actions";
import WorkingDiv from "./WorkingDiv";

const MainMenuCard = ({
  health = 50,
  woodCut = 1,
  attack = 5,
  rockMine = 1,
  critical = 1,
  forging = 1,
  level = 1,
  woodProgress = 33,
  rockProgress = 0,
}) => {
  const [isActing, setIsActing] = React.useState(false);

  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle className="text-center">ZIdle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <StatsAndInventory
            health={health}
            attack={attack}
            critical={critical}
            woodCut={woodCut}
            rockMine={rockMine}
            forging={forging}
            level={level}
          />
          {isActing ? (
            <WorkingDiv
              setIsActing={setIsActing}
              resourceName="Wood"
              secondsPerResource={10}
              xpPerResource={5}
            />
          ) : (
            <Actions setIsActing={setIsActing} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MainMenuCard;
