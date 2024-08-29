import { useDojo } from "@/dojo/useDojo";
import { useCallback, useMemo, useState } from "react";
import { Account } from "starknet";
import { Button } from "@/ui/elements/button";
import useAccountCustom from "@/hooks/useAccountCustom";

interface SellProps {
  tokenId: string;
  rcs_type?: number;
  rcs_sub_type?: number;
  amount: number;
  afterSellCallback: () => void;
}

export const Sell: React.FC<SellProps> = ({
  tokenId,
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

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (rcs_sub_type === undefined || rcs_type === undefined) return;

    setIsLoading(true);
    try {
      await sell({
        account: account as Account,
        token_id: tokenId,
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
    return !account || !master || account === master;
  }, [account, master]);

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
