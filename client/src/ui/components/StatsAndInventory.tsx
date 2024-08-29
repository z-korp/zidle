import React, { useState } from "react";
import { Button } from "../elements/button";
import LevelIndicator from "./LevelIndicator";
import AnimatedSprite from "./AnimatedSprite";
import { Character } from "@/hooks/useCharacter";
import { Dialog } from "@/ui/elements/dialog";
import AddressDisplay from "./AddressDisplay";
import { WalletIcon } from "lucide-react";
import Wallet from "./Wallet";

interface StatsAndInventoryProps {
  character: Character;
  health: number;
  attack: number;
  critical: number;
  setIsInInventory: (isInInventory: boolean) => void;
}

const StatsAndInventory: React.FC<StatsAndInventoryProps> = ({
  character,
  health,
  attack,
  critical,
  setIsInInventory,
}) => {
  const [currentAnimation, setCurrentAnimation] = useState("idle");
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="space-y-1">
        <AddressDisplay address={character.walletAddress || ""} />
        <div className="grid grid-cols-3 gap-1 text-sm items-center h-42">
          <div className="space-y-2 flex flex-col">
            <div>Health: {health}</div>
            <div>Attack: {attack}</div>
            <div>Critical: {critical}%</div>
          </div>
          <div className="flex justify-center">
            <div style={{ transform: `translate(-5%, -0%)` }}>
              <AnimatedSprite
                width={192}
                height={192}
                scale={1}
                fps={10}
                currentAnimation={currentAnimation}
              />
            </div>
          </div>
          <div className="space-y-2 w-full ">
            <div className="text-sm flex items-center justify-between">
              <span className="font-medium">Chop:</span>
              <LevelIndicator currentXP={character?.woodProgress ?? 0} />
            </div>
            <div className="text-sm flex items-center justify-between">
              <span className="font-medium">Mine:</span>
              <LevelIndicator currentXP={character?.rockProgress ?? 0} />
            </div>
            <div className="text-sm flex items-center justify-between">
              <span className="font-medium">Food:</span>
              <LevelIndicator currentXP={character?.foodProgress ?? 0} />
            </div>
          </div>
        </div>
        <div className="text-sm flex items-center justify-between">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setOpenModal(true)}
          >
            <span className="font-medium">Gold :</span>
            <span>{character?.gold ?? 0}</span>
            <WalletIcon />
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

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <Wallet character={character} setOpenModal={setOpenModal} />
      </Dialog>
    </>
  );
};

export default StatsAndInventory;
