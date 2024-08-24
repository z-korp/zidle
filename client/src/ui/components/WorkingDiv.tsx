import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "../elements/button";
import { Progress } from "../elements/ui/progress";

interface WorkingDivProps {
  setIsActing: (value: boolean) => void;
  resourceName: string;
  secondsPerResource: number;
  xpPerResource: number;
}

const WorkingDiv: React.FC<WorkingDivProps> = ({
  setIsActing,
  resourceName,
  secondsPerResource,
  xpPerResource,
}) => {
  const [progress, setProgress] = useState(0);
  const [resourcesProduced, setResourcesProduced] = useState(0);
  const startTimeRef = useRef(Date.now());
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const updateProgress = () => {
      const currentTime = Date.now();
      const elapsedTime = (currentTime - startTimeRef.current) / 1000;
      const newProgress =
        ((elapsedTime % secondsPerResource) / secondsPerResource) * 100;
      const newResourcesProduced = Math.floor(elapsedTime / secondsPerResource);

      if (newProgress === 100) {
        setProgress(0); // Reset instantaneously when progress reaches 100%
      } else {
        setProgress(newProgress);
      }

      setResourcesProduced(newResourcesProduced);

      animationFrameRef.current = requestAnimationFrame(updateProgress);
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [secondsPerResource]);

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
