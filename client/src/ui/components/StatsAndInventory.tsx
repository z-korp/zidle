import React, { useState } from "react";
import { Button } from "../elements/button";
import LevelIndicator from "./LevelIndicator";
import AnimatedSprite, { AnimationType, MobType } from "./AnimatedSprite";
import { Character } from "@/hooks/useCharacter";
import { Dialog } from "@/ui/elements/dialog";
import AddressDisplay from "./AddressDisplay";
import { ArrowLeft, WalletIcon } from "lucide-react";
import Wallet from "./Wallet";
import gold from "/assets/gold.png";
import { InventoryItem } from "@/dojo/game/models/miner";

interface StatsAndInventoryProps {
  character: Character;
  health: number;
  attack: number;
  critical: number;
  setIsInInventory: (isInInventory: boolean) => void;
  inventory: InventoryItem[];
  resetSelectedNft: () => void;
}

const StatsAndInventory: React.FC<StatsAndInventoryProps> = ({
  character,
  health,
  attack,
  critical,
  setIsInInventory,
  inventory,
  resetSelectedNft,
}) => {
  const [currentAnimation, setCurrentAnimation] = useState(AnimationType.Idle);
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            className="absolute top-4 left-4 p-1"
            onClick={resetSelectedNft}
          >
            <ArrowLeft />
          </Button>
          <div className="ml-9">
            <AddressDisplay address={character.walletAddress || ""} />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{character?.gold ?? 0}</span>
            <img src={gold} alt="Gold" className="w-8 h-8 pixelated-image" />
            <WalletIcon
              className="w-8 h-8 border border-gray-300 rounded-md p-1 hover:bg-gray-100 cursor-pointer"
              onClick={() => setOpenModal(true)}
            />
          </div>
        </div>
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
                mobType={
                  Object.values(MobType)[parseInt(character.token_id) % 3]
                }
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
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsInInventory(true)}
        >
          Inventory ({inventory.reduce((sum, item) => sum + item.quantity, 0)})
        </Button>
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <Wallet character={character} setOpenModal={setOpenModal} />
      </Dialog>
    </>
  );
};

export default StatsAndInventory;
