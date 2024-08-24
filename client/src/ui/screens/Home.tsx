import { Header } from "@/ui/containers/Header";
import { Create } from "../actions/Create";
import { usePlayer } from "@/hooks/usePlayer";
import { useDojo } from "@/dojo/useDojo";
import { useQuerySync } from "@dojoengine/react";
import useAccountCustom from "@/hooks/useAccountCustom";

export const Home = () => {
  const {
    setup: { toriiClient, contractComponents },
  } = useDojo();

  useQuerySync(toriiClient, contractComponents as any, []);

  const { account } = useAccountCustom();
  const { player } = usePlayer({ playerId: account?.address });

  return (
    <div className="relative flex flex-col h-screen">
      <h1>HELLO</h1>
      <Header />
      <div className="relative flex flex-col gap-8 grow items-center justify-start">
        <div className="absolute flex flex-col items-center gap-4 w-full p-2 max-w-4xl mt-4">
          <Create />
        </div>
      </div>
    </div>
  );
};
