import { Card, CardContent } from "../elements/card";
import { Button } from "../elements/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play } from "lucide-react";
import { Header } from "@/ui/containers/Header";
import { ScrollArea } from "@/ui/elements/scroll-area";
import { useAllExistingTokenIds } from "@/hooks/useAllExistingTokenIds";
import { useDojo } from "@/dojo/useDojo";

/**
 * StreamingScreen component - Displays all existing NFTs with streaming options
 */
export const StreamingScreen = () => {
  const navigate = useNavigate();
  const { tokenIds, isLoading } = useAllExistingTokenIds();
  const {
    setup: { systemCalls },
  } = useDojo();

  return (
    <div className="relative flex flex-col h-screen">
      <Header />
      <div className="relative flex flex-col gap-8 grow items-center justify-start">
        <div className="absolute flex flex-col items-center gap-4 w-full p-2 max-w-4xl">
          <Card className="w-[350px] bg-gray-800 text-white shadow-xl border border-gray-600">
            <CardContent className="p-4">
              {/* Header with navigation */}
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

              {/* NFT List */}
              <ScrollArea className="h-[60vh]">
                {isLoading ? (
                  <div className="text-center py-4 text-gray-400">
                    Loading NFTs...
                  </div>
                ) : (
                  <div className="space-y-4 pr-4">
                    {tokenIds.map((tokenId) => (
                      <Card
                        key={tokenId.toString()}
                        className="bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-colors"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-bold">
                                NFT #{tokenId.toString()}
                              </h3>
                              <p className="text-sm text-gray-400">
                                Available for streaming
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-400 hover:text-green-300"
                              onClick={() => {
                                // TODO: Implement streaming action
                                console.log(`Start streaming NFT ${tokenId}`);
                              }}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Stream
                            </Button>
                          </div>

                          {/* Progress bars or additional NFT info can be added here */}
                          <div className="mt-4 space-y-2">
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500"
                                style={{ width: "50%" }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
