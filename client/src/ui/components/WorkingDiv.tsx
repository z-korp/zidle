import React from "react";
import { Button } from "../elements/button";
import { Progress } from "../elements/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Resource } from "@/dojo/game/types/resource";
import { useResourceProgress } from "@/hooks/useResourceProgress";
import { useResourceCalculations } from "@/hooks/useResourceCalculations";
import { Character } from "@/hooks/useCharacter";
import { useDojo } from "@/dojo/useDojo";
import useAccountCustom from "@/hooks/useAccountCustom";
import { Account } from "starknet";
import { getResourceImage } from "@/utils/resource";

interface WorkingDivProps {
  selectedResource: Resource;
  character: Character;
}

const WorkingDiv: React.FC<WorkingDivProps> = ({
  selectedResource,
  character,
}) => {
  const {
    setup: {
      systemCalls: { harvest },
    },
  } = useDojo();

  const { account } = useAccountCustom();

  const { progress, amountProduced, showSparkle } = useResourceProgress(
    selectedResource,
    character,
  );

  const { totalXP } = useResourceCalculations(
    selectedResource,
    character,
    amountProduced,
  );

  const handleStopAction = async () => {
    if (account && selectedResource) {
      await harvest({
        token_id: character.token_id,
        account: account as Account,
        rcs_sub_type: selectedResource.into(),
      });
    }
  };

  return (
    <div className="space-y-2 border-4 border-grey-600 shadow-lg rounded-xl p-4">
      <Header
        handleStopAction={handleStopAction}
        selectedResource={selectedResource}
      />
      <ProgressBar progress={progress} showSparkle={showSparkle} selectedResource={selectedResource}/>
      <ResourceInfo
        amountProduced={amountProduced}
        totalXP={totalXP}
        resourceName={selectedResource.getSubresourceName()}
      />
    </div>
  );
};

const Header: React.FC<{
  handleStopAction: () => Promise<void>;
  selectedResource: Resource;
}> = ({ handleStopAction, selectedResource }) => (
  <div className="flex items-center justify-between">
    <span>{`Chop ${selectedResource.getSubresourceName()}`}</span>
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button size="sm" className="ml-2" onClick={handleStopAction}>
        Harvest
      </Button>
    </motion.div>
  </div>
);

const ProgressBar: React.FC<{ progress: number; showSparkle: boolean , selectedResource: Resource}> = ({
  progress,
  showSparkle,
  selectedResource,
}) => {
  return(<div className="flex items-center relative">
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
          <img src={getResourceImage(selectedResource.value)} className="pixelated-image" />
        </motion.div>
      )}
    </AnimatePresence>
  </div>)
}

const ResourceInfo: React.FC<{
  amountProduced: number;
  totalXP: number;
  resourceName: string;
}> = ({ amountProduced, totalXP, resourceName }) => (
  <motion.div className="flex flex-col items-center border-4 border-grey-600 shadow-lg rounded-xl p-4">
    <span>{"Claimable:"}</span>
    <AnimatedValue value={amountProduced} label={resourceName} />
    <AnimatedValue value={totalXP} label="XP" />
  </motion.div>
);

const AnimatedValue: React.FC<{ value: number; label: string }> = ({
  value,
  label,
}) => (
  <motion.span
    key={value}
    initial={{ y: -10, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >{`${value} ${label}`}</motion.span>
);

export default WorkingDiv;
