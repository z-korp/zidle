import React, { useState } from "react";
import { ScrollArea, ScrollBar } from "@/ui/elements/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/ui/elements/card";

interface Chest {
  id: string;
  type: "common" | "rare" | "epic" | "legendary";
  color: string;
}

interface ChestReward {
  id: string;
  name: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  quantity: number;
  image: string;
}

const chests: Chest[] = [
  { id: "1", type: "common", color: "text-gray-400" },
  { id: "2", type: "rare", color: "text-blue-400" },
  { id: "3", type: "epic", color: "text-purple-400" },
  { id: "4", type: "legendary", color: "text-yellow-400" },
  // Add more chests as needed
];

export const ChestScrollArea: React.FC = () => {
  const [selectedChest, setSelectedChest] = useState<Chest | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [rewards, setRewards] = useState<ChestReward[]>([]);

  const handleChestClick = async (chest: Chest) => {
    setSelectedChest(chest);
    setIsOpening(true);

    // Simulate chest opening delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Example rewards (replace with actual rewards logic)
    const newRewards: ChestReward[] = [
      {
        id: "1",
        name: "Gold",
        rarity: "common",
        quantity: 100,
        image: "/gold.png",
      },
      {
        id: "2",
        name: "Diamond",
        rarity: "rare",
        quantity: 1,
        image: "/diamond.png",
      },
    ];

    setRewards(newRewards);
    setIsOpening(false);
  };

  return (
    <Card className="bg-gray-800/50">
      <CardContent className="p-4">
        <div className="relative">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-4 pb-4">
              {chests.map((chest) => (
                <motion.div
                  key={chest.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block shrink-0"
                >
                  <div
                    onClick={() => handleChestClick(chest)}
                    className={`
                      w-[200px] p-6 rounded-lg border-2 border-gray-700 cursor-pointer
                      hover:bg-gray-700/50 transition-colors
                      ${chest.color} flex flex-col items-center gap-2
                    `}
                  >
                    <Package className="w-12 h-12" />
                    <span className="capitalize">{chest.type} Chest</span>
                    <div className="text-sm text-gray-400">Click to open</div>
                  </div>
                </motion.div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Chest Opening Animation */}
        <AnimatePresence>
          {selectedChest && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="bg-gray-800 p-8 rounded-lg max-w-md w-full mx-4"
              >
                {isOpening ? (
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                      }}
                    >
                      <Package className={`w-24 h-24 ${selectedChest.color}`} />
                    </motion.div>
                    <motion.div
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="mt-4 text-lg"
                    >
                      Opening chest...
                    </motion.div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">Rewards</h3>
                      <p className="text-gray-400">
                        Here's what you got from the {selectedChest.type} chest!
                      </p>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      {rewards.map((reward, index) => (
                        <motion.div
                          key={reward.id}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            transition: { delay: index * 0.2 },
                          }}
                          className={`
                            p-4 rounded-lg border border-gray-700
                            bg-gray-700/50 flex flex-col items-center gap-2
                          `}
                        >
                          <Sparkles
                            className={`w-8 h-8 ${getColorByRarity(reward.rarity)}`}
                          />
                          <span className="font-medium">{reward.name}</span>
                          <span className="text-sm text-gray-400">
                            x{reward.quantity}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>

                    <div className="flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedChest(null)}
                        className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Close
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

const getColorByRarity = (rarity: ChestReward["rarity"]) => {
  switch (rarity) {
    case "legendary":
      return "text-yellow-400";
    case "epic":
      return "text-purple-400";
    case "rare":
      return "text-blue-400";
    default:
      return "text-gray-400";
  }
};
