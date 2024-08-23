import React from "react";
import { ChevronDown } from "lucide-react";
import { Progress } from "@radix-ui/react-progress";
import { Button } from "../elements/button";
import { Card, CardHeader, CardTitle, CardContent } from "../elements/card";
import { SpriteAnimator } from "react-sprite-animator";
import warriorBlue from "/assets/Warrior_Blue.png";

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
  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle className="text-center">ZIdle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-sm items-center">
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

          {/* Level */}
          <div className="text-sm">lvl {level}</div>

          {/* Inventory Button */}
          <Button variant="outline" className="w-full">
            Inventory
          </Button>

          {/* Actions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Cut Wood</span>
              <div className="flex items-center">
                <Button variant="outline" size="sm">
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button size="sm" className="ml-2">
                  Go
                </Button>
              </div>
            </div>
            <Progress value={woodProgress} className="h-2" />

            <div className="flex items-center justify-between">
              <span>Mine rock</span>
              <div className="flex items-center">
                <Button variant="outline" size="sm">
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button size="sm" className="ml-2">
                  Go
                </Button>
              </div>
            </div>
            <Progress value={rockProgress} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MainMenuCard;
