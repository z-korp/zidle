import { Card, CardContent } from "../elements/card";
import { Button } from "../elements/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play } from "lucide-react";
import { Header } from "@/ui/containers/Header";
import { ScrollArea } from "@/ui/elements/scroll-area";
import { useAllExistingTokenIds } from "@/hooks/useAllExistingTokenIds";
import { useDojo } from "@/dojo/useDojo";
import { LoadingDots } from "@/ui/components/LoadingDots";
import NFTCard from "@/ui/components/NFTCard";
import { useState } from "react";
import NFTDetailsCard from "../components/NFTStreamingCard";

/**
 * StreamingScreen component - Displays all existing NFTs with streaming options
 */
export const StreamingScreen = () => {
  const navigate = useNavigate();
  const { tokenIds, isLoading } = useAllExistingTokenIds();
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const {
    setup: { systemCalls },
  } = useDojo();

  return (
    <div className="relative flex flex-col h-screen">
      <Header />
      <div className="relative flex flex-col gap-8 grow items-center justify-start">
        <div className="absolute flex flex-col items-center gap-4 w-full p-2 max-w-4xl">
          {selectedTokenId ? (
            <NFTDetailsCard
              tokenId={selectedTokenId}
              onBack={() => setSelectedTokenId(null)}
            />
          ) : (
            <Card className="w-[350px] bg-gray-800 text-white shadow-xl border border-gray-600">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate("/")}
                    className="h-8 w-8"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <h1 className="text-xl font-bold">Available NFTs</h1>
                  <div className="w-8" />
                </div>

                <ScrollArea className="h-[60vh]">
                  {isLoading ? (
                    <div className="text-center py-4 text-gray-400">
                      <span>
                        Loading NFTs <LoadingDots />
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 pr-4">
                      {tokenIds.map((tokenId) => (
                        <div
                          key={tokenId.toString()}
                          className="flex flex-col gap-2"
                        >
                          <div
                            onClick={() =>
                              setSelectedTokenId(tokenId.toString())
                            }
                            className="cursor-pointer"
                          >
                            <NFTCard
                              tokenId={tokenId.toString()}
                              onSelect={() => {}}
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-green-400 hover:text-green-300"
                            onClick={() => {
                              // TODO: Implement streaming action
                              console.log(`Start streaming NFT ${tokenId}`);
                            }}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Stream
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
