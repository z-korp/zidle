import React, { useState } from "react";
import { Header } from "@/ui/containers/Header";
import { useDojo } from "@/dojo/useDojo";
import { useQuerySync } from "@dojoengine/react";
import MainMenuCard from "../components/MainMenuCard";
import { Card, CardHeader, CardContent } from "../elements/card";
import CharacterList from "../components/CharacterList";
import { Button } from "@/ui/elements/button";
import { Store, Radio } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const {
    setup: { toriiClient, contractModels },
  } = useDojo();

  useQuerySync(toriiClient, contractModels as any, []);

  const [selectedNft, setSelectedNft] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col h-screen">
      <Header />
      <div className="relative flex flex-col gap-8 grow items-center justify-start">
        <div className="absolute flex flex-col items-center gap-4 w-full p-2 max-w-4xl">
          {selectedNft == null ? (
            <Card className="w-[350px] bg-gray-800 text-white shadow-xl border border-gray-600">
              <CardHeader className="p-3">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/streaming")}
                    className="text-white"
                  >
                    <Radio className="w-4 h-4 mr-2" />
                    Streaming
                  </Button>
                </div>
              </CardHeader>
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
