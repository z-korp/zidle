import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "../elements/button";
import { Progress } from "../elements/ui/progress";

interface WorkingDivProps {
  setIsActing: (value: boolean) => void;
  resourceName: string;
  secondsPerResource: number;
  xpPerResource: number;
  // totalTime: number; // Temps total en secondes
}

const WorkingDiv: React.FC<WorkingDivProps> = ({
  setIsActing,
  resourceName,
  secondsPerResource,
  xpPerResource,
  // totalTime,
}) => {
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prevTime) => {
        const newTime = prevTime + 1;
        if (newTime >= secondsPerResource) {
          clearInterval(timer);
          return secondsPerResource;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsPerResource]);

  useEffect(() => {
    setProgress((elapsedTime / secondsPerResource) * 100);
  }, [elapsedTime, secondsPerResource]);

  const resourcesProduced = Math.floor(elapsedTime / secondsPerResource);
  const totalXP = resourcesProduced * xpPerResource;

  return (
    <div className="space-y-2 border-4 border-grey-600 shadow-lg rounded-xl p-4">
      <div className="flex items-center justify-between">
        <span>{`Chop ${resourceName}`}</span>
        <div className="flex items-center">
          <Button variant="outline" size="sm">
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button size="sm" className="ml-2" onClick={() => setIsActing(false)}>
            Harvest
          </Button>
        </div>
      </div>
      <div className="flex items-center">
        <Progress value={progress} />
      </div>
      <div className="flex flex-col items-center border-4 border-grey-600 shadow-lg rounded-xl p-4">
        <span className="">{"Claimable:"}</span>
        <span>{`${resourcesProduced} ${resourceName}`}</span>
        <span>{`${totalXP} XP`}</span>
      </div>
    </div>
  );
};

export default WorkingDiv;
