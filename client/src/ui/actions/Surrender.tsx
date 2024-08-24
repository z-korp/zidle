import { useDojo } from "@/dojo/useDojo";
import { useCallback, useMemo, useState } from "react";
import { Account } from "starknet";
import { Button } from "@/ui/elements/button";
import { usePlayer } from "@/hooks/usePlayer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/ui/elements/dialog";
import useAccountCustom from "@/hooks/useAccountCustom";

export const Surrender = () => {
  const { account } = useAccountCustom();
  const {
    master,
    setup: {
      systemCalls: { surrender },
    },
  } = useDojo();
  const { player } = usePlayer({ playerId: account?.address });

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    try {
      await surrender({ account: account as Account });
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  const disabled = useMemo(() => {
    return !account || !master || account === master || !player;
  }, [account, master, player]);

  if (disabled) return null;

  return (
    <div className="flex gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            disabled={isLoading}
            isLoading={isLoading}
            className="text-xl"
          >
            Surrender
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Surrender Game?</DialogTitle>
          </DialogHeader>

          <div className="flex gap-2 w-full">
            <DialogClose asChild className="w-1/2">
              <Button>No, Continue Playing</Button>
            </DialogClose>
            <DialogClose asChild className="w-1/2">
              <Button
                variant="destructive"
                disabled={isLoading}
                isLoading={isLoading}
                onClick={handleClick}
              >
                Yes, Surrender
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
