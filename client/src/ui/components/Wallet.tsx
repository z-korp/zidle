import React, { useState, useEffect } from "react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "../elements/input";
import { Character } from "@/hooks/useCharacter";
import { TransferGold } from "../actions/TransferGold";
import { useGolds } from "@/hooks/useGolds";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../elements/dialog";

interface WalletProps {
  character: Character;
  setOpenModal: (state: boolean) => void;
}

const Wallet: React.FC<WalletProps> = ({ character, setOpenModal }) => {
  const { goldBalance } = useGolds(character.token_id);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    // Ensure amount doesn't exceed available gold
    if (Number(amount) > goldBalance) {
      setAmount(goldBalance.toString());
    }
  }, [amount, goldBalance]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ensure non-negative numbers only
    if (/^\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <DialogContent>
      <DialogTitle>
        Send Gold{" "}
        <span className="text-sm font-normal ml-2">
          Total golds: {goldBalance ?? 0}
        </span>
      </DialogTitle>
      <DialogDescription></DialogDescription>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Address</Label>
          <Input
            id="address"
            className="col-span-3"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Amount</Label>
          <Input
            id="amount"
            type="number"
            className="col-span-3"
            value={amount}
            onChange={handleAmountChange}
            min="0"
            max={goldBalance.toString()}
          />
        </div>
      </div>
      <TransferGold
        tokenId={character.token_id}
        recipient={recipient}
        amount={Number(amount)}
        onTxSuccess={() => setOpenModal(false)}
      />
    </DialogContent>
  );
};

export default Wallet;
