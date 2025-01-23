import React, { useState } from "react";
import { Button } from "../elements/button";
import LevelIndicator from "./LevelIndicator";
import AnimatedSprite, { AnimationType, MobType } from "./AnimatedSprite";
import { Character } from "@/hooks/useCharacter";
import { Dialog } from "@/ui/elements/dialog";
import AddressDisplay from "./AddressDisplay";
import { ArrowLeft, WalletIcon, Hammer, Sword, Menu } from "lucide-react";
import Wallet from "./Wallet";
import { InventoryItem } from "@/dojo/game/models/miner";
import GoldImg from "./GoldImg";

interface StatsAndInventoryProps {
  character: Character;
  health: number;
  attack: number;
  critical: number;
  setIsInInventory: (isInInventory: boolean) => void;
  setIsInBlueprints: (isInBlueprints: boolean) => void;
  setIsInCombat: (isInCombat: boolean) => void;
  inventory: InventoryItem[];
  resetSelectedNft: () => void;
}

const StatsAndInventory: React.FC<StatsAndInventoryProps> = ({
  character,
  health,
  attack,
  critical,
  setIsInInventory,
  setIsInBlueprints,
  setIsInCombat,
  inventory,
  resetSelectedNft,
}) => {
  const [currentAnimation, setCurrentAnimation] = useState(AnimationType.Idle);
  const [openModal, setOpenModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-1 text-sm items-center h-42 relative">
          <div className="space-y-2 flex flex-col z-10">
            <div>Health: {health}</div>
            <div>Attack: {attack}</div>
            <div>Critical: {critical}%</div>
          </div>
          <div className="flex justify-center z-0">
            <div>
              <AnimatedSprite
                width={192}
                height={140}
                scale={1}
                fps={10}
                currentAnimation={currentAnimation}
                mobType={
                  Object.values(MobType)[parseInt(character.token_id) % 3]
                }
              />
            </div>
          </div>
          <div className="space-y-2 w-full z-10">
            <div className="text-sm flex items-center justify-between">
              <span className="font-medium">Chop lvl</span>
              <LevelIndicator currentXP={character?.woodProgress ?? 0} />
            </div>
            <div className="text-sm flex items-center justify-between">
              <span className="font-medium">Mine lvl</span>
              <LevelIndicator currentXP={character?.rockProgress ?? 0} />
            </div>
            <div className="text-sm flex items-center justify-between">
              <span className="font-medium">Food lvl</span>
              <LevelIndicator currentXP={character?.foodProgress ?? 0} />
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full border border-gray-600"
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
