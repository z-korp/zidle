import React, { useState, useEffect, useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/elements/tooltip";
import {
  getLevelFromXp,
  xpForNextLevel,
  xpProgressToNextLevel,
} from "@/utils/level";

interface LevelIndicatorProps {
  currentXP: number;
}

const LevelIndicator: React.FC<LevelIndicatorProps> = ({ currentXP }) => {
  const [displayXP, setDisplayXP] = useState(currentXP);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const animationRef = useRef<number | null>(null);
  const prevXPRef = useRef<number>(currentXP);
  const firstUpdate = useRef(true); // Ref to track the first update

  const lerp = (start: number, end: number, t: number) => {
    return start * (1 - t) + end * t;
  };

  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  const calculateLevelInfo = (xp: number): [number, number, number] => {
    const level = getLevelFromXp(xp);
    const progress = Math.floor(xpProgressToNextLevel(xp) * 100);
    const xpForNext = xpForNextLevel(xp);
    return [level, progress, xpForNext];
  };

  const [currentLevel, progress, xpForNext] = calculateLevelInfo(displayXP);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false; // Mark as not first load anymore
      return; // Skip animation on first load
    }

    if (currentXP !== prevXPRef.current) {
      setShouldAnimate(true);
      prevXPRef.current = currentXP; // Update previous XP ref to the current XP
    }
  }, [currentXP]);

  useEffect(() => {
    if (!shouldAnimate) {
      setDisplayXP(currentXP);
      return;
    }

    const animationDuration = 3000; // Animation lasts 3 seconds
    let startTime: number;

    const animate = (time: number) => {
      if (startTime === undefined) startTime = time;
      const elapsed = time - startTime;
      const rawProgress = Math.min(elapsed / animationDuration, 1);
      const easedProgress = easeOutCubic(rawProgress);

      setDisplayXP(
        Math.floor(lerp(prevXPRef.current, currentXP, easedProgress)),
      );

      if (rawProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [shouldAnimate, currentXP]);

  const strokeWidth = 4;
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="relative w-[32px] h-[32px]">
            <svg className="w-full h-full" viewBox="0 0 32 32">
              <circle
                cx="16"
                cy="16"
                r={radius}
                fill="none"
                stroke="hsl(var(--primary) / 0.2)"
                strokeWidth={strokeWidth}
              />
              <circle
                cx="16"
                cy="16"
                r={radius}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 16 16)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-background rounded-full w-[24px] h-[24px] flex items-center justify-center">
                <span className="text-xs font-bold text-foreground">
                  {currentLevel}
                </span>
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p>Level: {currentLevel}</p>
            <p>XP: {displayXP}</p>
            <p>Progress: {progress}%</p>
            <p>
              Next Level: {currentLevel < 99 ? xpForNext - displayXP : "Max"} XP
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LevelIndicator;
