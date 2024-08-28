import { useDojo } from "@/dojo/useDojo";
import { useCallback, useMemo, useState } from "react";
import { Account } from "starknet";
import { Button } from "@/ui/elements/button";
import { usePlayer } from "@/hooks/usePlayer";
import useAccountCustom from "@/hooks/useAccountCustom";

interface SellProps {
  rcs_type?: number;
  rcs_sub_type?: number;
  amount: number;
  afterSellCallback: () => void;
}

export const Sell: React.FC<SellProps> = ({
  rcs_type,
  rcs_sub_type,
  amount,
  afterSellCallback,
}) => {
  const {
    master,
    setup: {
      systemCalls: { sell },
    },
  } = useDojo();

  const { account } = useAccountCustom();
  const { player } = usePlayer({ playerId: account?.address });

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (rcs_sub_type === undefined || rcs_type === undefined) return;
    setIsLoading(true);
    try {
      await sell({
        account: account as Account,
        rcs_type,
        rcs_sub_type,
        amount,
      });
    } finally {
      setIsLoading(false);
      afterSellCallback();
    }
  }, [account, rcs_type, rcs_sub_type, amount]);

  const disabled = useMemo(() => {
    return !account || !master || account === master || !player;
  }, [account, master, player]);

  if (disabled) return null;

  return (
    <Button
      disabled={isLoading}
      isLoading={isLoading}
      onClick={handleClick}
      className="text-xl w-[200px]"
    >
      {`Sell`}
    </Button>
  );
};
