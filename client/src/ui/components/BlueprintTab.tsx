import { useState } from "react";
import { blueprints, BlueprintCategory } from "@/data/blueprints";
import { Card, CardContent } from "../elements/card";
import { Button } from "../elements/button";
import { Tabs, TabsList, TabsTrigger } from "../elements/tabs";
import { ScrollArea } from "../elements/scroll-area";

export const BlueprintTab = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    BlueprintCategory | "all"
  >("all");

  const filteredBlueprints =
    selectedCategory === "all"
      ? blueprints
      : blueprints.filter((bp) => bp.category === selectedCategory);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all" onClick={() => setSelectedCategory("all")}>
            All
          </TabsTrigger>
          {Object.values(BlueprintCategory).map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <ScrollArea className="h-[400px] pr-4">
        <div className="grid grid-cols-1 gap-4">
          {filteredBlueprints.map((blueprint) => (
            <Card key={blueprint.id} className="bg-gray-800/50">
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {blueprint.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {blueprint.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                      Level {blueprint.level}
                    </span>
                    <span className="text-xs text-gray-400">
                      {blueprint.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-300">
                    Required Resources:
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {blueprint.resources.map((resource) => (
                      <div
                        key={resource.type}
                        className="flex justify-between text-sm bg-gray-900/50 p-2 rounded"
                      >
                        <span className="capitalize text-gray-400">
                          {resource.type}
                        </span>
                        <span className="text-gray-300">{resource.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-400 bg-gray-900/30 p-2 rounded">
                  <span>Crafting Time: {blueprint.craftingTime}s</span>
                  <span>XP: +{blueprint.experienceReward}</span>
                </div>

                <Button
                  className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300"
                  variant="outline"
                >
                  Craft
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
