import React, { useState } from "react";
import { Header } from "@/ui/containers/Header";
import { useDojo } from "@/dojo/useDojo";
import { useQuerySync } from "@dojoengine/react";
import MainMenuCard from "../components/MainMenuCard";
import { Card, CardHeader, CardTitle, CardContent } from "../elements/card";
import CharacterList from "../components/CharacterList";
import { ArrowLeft } from "lucide-react";

export const Home = () => {
  const {
    setup: { toriiClient, contractComponents },
  } = useDojo();

  useQuerySync(toriiClient, contractComponents as any, []);

  const [selectedNft, setSelectedNft] = useState<string | null>(null);

  return (
    <div className="relative flex flex-col h-screen">
      <Header />
      <div className="relative flex flex-col gap-8 grow items-center justify-start">
        <div className="absolute flex flex-col items-center gap-4 w-full p-2 max-w-4xl mt-4">
          {selectedNft == null ? (
            <Card className="w-[350px] bg-gray-800 text-white shadow-xl">
              <CardHeader className="p-3"></CardHeader>
              <CardContent>
                <CharacterList onCharacterSelect={setSelectedNft} />
              </CardContent>
            </Card>
          ) : (
            <MainMenuCard
              tokenId={selectedNft}
              resetSelectedNft={() => setSelectedNft(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
