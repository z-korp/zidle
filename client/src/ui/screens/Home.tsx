import React, { useState, useEffect } from "react";
import { Header } from "@/ui/containers/Header";
import { usePlayer } from "@/hooks/usePlayer";
import { useDojo } from "@/dojo/useDojo";
import { useQuerySync } from "@dojoengine/react";
import useAccountCustom from "@/hooks/useAccountCustom";
import ReconnectionSummary from "../components/ReconnectionSummary";
import MainMenuCard from "../components/MainMenuCard";
import { Card, CardHeader, CardTitle, CardContent } from "../elements/card";
import { Character, ReconnectionData } from "@/types/types";
import CharacterList from "../components/CharacterList";

export const Home = () => {
  const {
    setup: { toriiClient, contractComponents },
  } = useDojo();

  useQuerySync(toriiClient, contractComponents as any, []);

  const { account } = useAccountCustom();
  const { player } = usePlayer({ playerId: account?.address });
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null,
  );

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
  };

  return (
    <div className="relative flex flex-col h-screen">
      <Header />
      <div className="relative flex flex-col gap-8 grow items-center justify-start">
        <div className="absolute flex flex-col items-center gap-4 w-full p-2 max-w-4xl mt-4">
          {selectedCharacter == null ? (
            <Card className="w-[350px] bg-gray-800 text-white shadow-xl">
              <CardHeader>
                <CardTitle className="text-center text-2xl">ZIdle</CardTitle>
              </CardHeader>
              <CardContent>
                <CharacterList onCharacterSelect={handleCharacterSelect} />
              </CardContent>
            </Card>
          ) : (
            <MainMenuCard character={selectedCharacter as Character} />
          )}
        </div>
      </div>
    </div>
  );
};
