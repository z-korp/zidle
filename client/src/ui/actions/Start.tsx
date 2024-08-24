import { useDojo } from "@/dojo/useDojo";
import { useCallback, useMemo, useState } from "react";
import { Account } from "starknet";
import { Button } from "@/ui/elements/button";
import { usePlayer } from "@/hooks/usePlayer";
import { fetchVrfData } from "@/api/vrf";
import useAccountCustom from "@/hooks/useAccountCustom";

export const Start = () => {
  const {
    master,
    setup: {
      systemCalls: { start },
    },
  } = useDojo();

  const { account } = useAccountCustom();

  const { player } = usePlayer({ playerId: account?.address });

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        seed,
        proof_gamma_x,
        proof_gamma_y,
        proof_c,
        proof_s,
        proof_verify_hint,
        beta,
      } = await fetchVrfData();

      /*await start({
        account: account as Account,
        mode: "game",
        seed,
        x: proof_gamma_x,
        y: proof_gamma_y,
        c: proof_c,
        s: proof_s,
        sqrt_ratio_hint: proof_verify_hint,
        beta: beta,
      });*/
    } finally {
      setIsLoading(false);
    }
  }, [account]);

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
      {`Start`}
    </Button>
  );
};
