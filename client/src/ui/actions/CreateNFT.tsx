import { useDojo } from "@/dojo/useDojo";
import { useCallback, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/ui/elements/dialog";
import { Button } from "@/ui/elements/button";
import { Input } from "@/ui/elements/input";
import { Account } from "starknet";
import { MAX_CHAR_PSEUDO } from "../constants";
import useAccountCustom from "@/hooks/useAccountCustom";

export const CreateNFT = () => {
  const [characterName, setPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { account } = useAccountCustom();
  const {
    master,
    setup: {
      systemCalls: { createCharacter },
    },
  } = useDojo();

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    try {
      await createCharacter({
        account: account as Account,
        name: characterName,
      });
    } finally {
      setIsLoading(false);
    }
  }, [account, characterName]);

  const disabled = useMemo(() => {
    return !account || !master || account === master;
  }, [account, master]);

  if (disabled) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button isLoading={isLoading} disabled={isLoading} className="text-xl">
          Create a Character
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new character</DialogTitle>
          <DialogDescription>Choose a name.</DialogDescription>
        </DialogHeader>

        <Input
          className="w-full"
          placeholder="Character Name"
          type="text"
          value={characterName}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHAR_PSEUDO) {
              setPlayerName(e.target.value);
            }
          }}
        />

        <DialogClose asChild>
          <Button
            disabled={!characterName || isLoading}
            isLoading={isLoading}
            onClick={handleClick}
          >
            Create character
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
