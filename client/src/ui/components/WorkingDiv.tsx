import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { Button } from "../elements/button";
import { Progress } from "../elements/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

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
  const [showSparkle, setShowSparkle] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      const currentTime = Date.now();
      const elapsedTime = (currentTime - startTimeRef.current) / 1000;
      const newProgress =
        ((elapsedTime % secondsPerResource) / secondsPerResource) * 100;
      const newResourcesProduced = Math.floor(elapsedTime / secondsPerResource);

      if (newProgress === 100) {
        setProgress(0); // Reset instantaneously when progress reaches 100%
        setShowSparkle(true);
        setTimeout(() => setShowSparkle(false), 1000);
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

  const groupedResources = useMemo(() => {
    const grouped = {};
    if (resourcesProduced > 0) {
      grouped[resourceName] = resourcesProduced;
    }
    return grouped;
  }, [resourceName, resourcesProduced]);

  return (
    <div className="space-y-2 border-4 border-grey-600 shadow-lg rounded-xl p-4">
      <div className="flex items-center justify-between">
        <span>{`Chop ${resourceName}`}</span>
        <div className="flex items-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              className="ml-2"
              onClick={() => setIsActing(false)}
            >
              Harvest
            </Button>
          </motion.div>
        </div>
      </div>
      <div className="flex items-center relative">
        <Progress value={progress} />
        <AnimatePresence>
          {showSparkle && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
              className="absolute right-0 top-0"
            >
              <Sparkles className="text-yellow-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.div className="flex flex-col items-center border-4 border-grey-600 shadow-lg rounded-xl p-4">
        <span className="">{"Claimable:"}</span>
        {Object.entries(groupedResources).map(([name, quantity]) => (
          <motion.span
            key={name}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >{`${quantity} ${name}`}</motion.span>
        ))}
        <motion.span
          key={totalXP}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >{`${totalXP} XP`}</motion.span>
      </motion.div>
    </div>
  );
};

export default WorkingDiv;
