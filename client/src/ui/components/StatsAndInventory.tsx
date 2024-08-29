import React, { useState } from "react";
import { Button } from "../elements/button";
import LevelIndicator from "./LevelIndicator";
import AnimatedSprite from "./AnimatedSprite";
import { Character, useCharacter } from "@/hooks/useCharacter";
import useAccountCustom from "@/hooks/useAccountCustom";
import { WalletIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/ui/elements/dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "../elements/input";
import AddressDisplay from "./AddressDisplay";

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
  const { account } = useAccountCustom();

  return (
    <>
      <div className="space-y-1">
        <AddressDisplay address={account?.address || ""} />
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
        <DialogContent>
          <DialogTitle>
            Send Gold{" "}
            <span className="text-sm font-normal ml-2">
              Total golds: {character?.gold ?? 0}
            </span>
          </DialogTitle>
          <DialogDescription></DialogDescription>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Adresse</Label>
              <Input 
                id="address" 
                className="col-span-3" 
                pattern="0x[a-fA-F0-9]{63,64}"
                title="Enter a valid starknet address"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Montant</Label>
              <Input 
                id="amount" 
                type="number" 
                className="col-span-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                min="0" 
                step="1"
              />
            </div>
          </div>
          <Button onClick={() => setOpenModal(false)} className="w-full">
            Send
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StatsAndInventory;
