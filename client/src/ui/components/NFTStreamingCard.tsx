import { Card, CardContent } from "../elements/card";
import { Button } from "../elements/button";
import {
  ArrowLeft,
  Radio,
  Sword,
  Star,
  Coins,
  Plus,
  MessageSquare,
  Shovel,
  ChevronDown,
  Goal,
} from "lucide-react";
import { useCharacter } from "@/hooks/useCharacter";
import { LoadingDots } from "./LoadingDots";
import LevelIndicator from "./LevelIndicator";
import AnimatedSprite, { AnimationType, MobType } from "./AnimatedSprite";
import { ScrollArea } from "@/ui/elements/scroll-area";
import { useEventsStore } from "@/stores/useEventsStore";
import { DateTime } from "luxon";
import { useRef, useEffect, useState } from "react";
import { eventToString } from "@/utils/events";
import GoldImg from "./GoldImg";
import { Resource } from "@/dojo/game/types/resource";
import WorkingDiv from "./WorkingDiv";
import { GoalsSection } from "./Goals/GoalsSection";
import { motion, AnimatePresence } from "framer-motion";
import Draggable from "react-draggable";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { InventoryItem } from "@/dojo/game/models/miner";
import { getResourceImage } from "@/utils/resource";
import AddressDisplay from "./AddressDisplay";

interface NFTStreamingCardProps {
  tokenId: number;
  onBack: () => void;
}

// Composant pour une section triable
const SortableSection = ({
  section,
  children,
}: {
  section: { id: string; title: string };
  children: React.ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        {...attributes}
        {...listeners}
        className="cursor-move mb-2 flex items-center gap-2"
      >
        <div className="w-1 h-4 bg-gray-600 rounded" />
        <span className="text-xs text-gray-400">Drag to reorder</span>
      </div>
      {children}
    </div>
  );
};

export const NFTStreamingCard = ({
  tokenId,
  onBack,
}: NFTStreamingCardProps) => {
  const { character } = useCharacter(tokenId.toString());

  useEffect(() => {
    console.log("character", character);
  }, [character]);

  const { events } = useEventsStore();

  const scrollRef = useRef<HTMLDivElement>(null);

  const [isPulsing, setIsPulsing] = useState(false);
  const [isOngoingExpanded, setIsOngoingExpanded] = useState(true);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);
  const [isInventoryExpanded, setIsInventoryExpanded] = useState(true);

  const latestEvent = events
    .sort((e1, e2) => e2.timestamp - e1.timestamp)
    .at(0);

  const selectedResource =
    latestEvent && "rcsType" in latestEvent
      ? Resource.from(latestEvent.rcsType, latestEvent.rcsSubType)
      : null;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing((prev) => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (text: string) => {
    if (text.toLowerCase().includes("stream")) {
      return <Radio className="w-4 h-4 text-green-400" />;
    }
    if (
      text.toLowerCase().includes("battle") ||
      text.toLowerCase().includes("fight")
    ) {
      return <Sword className="w-4 h-4 text-red-400" />;
    }
    if (
      text.toLowerCase().includes("level") ||
      text.toLowerCase().includes("xp")
    ) {
      return <Star className="w-4 h-4 text-purple-400" />;
    }
    if (
      text.toLowerCase().includes("trade") ||
      text.toLowerCase().includes("sold") ||
      text.toLowerCase().includes("bought")
    ) {
      return <Coins className="w-4 h-4 text-yellow-400" />;
    }
    if (
      text.toLowerCase().includes("mint") ||
      text.toLowerCase().includes("created")
    ) {
      return <Plus className="w-4 h-4 text-pink-400" />;
    }
    if (text.toLowerCase().includes("mining")) {
      return <Shovel className="w-4 h-4 text-blue-400" />;
    }
    if (text.toLocaleLowerCase().includes("goal")) {
      return <Goal className="w-4 h-4 text-red-500" />;
    }
    return <MessageSquare className="w-4 h-4 text-blue-400" />;
  };

  const [position, setPosition] = useState({ x: 0, y: 0 });

  // State pour l'ordre des sections
  const [sections, setSections] = useState([
    { id: "goals", title: "Player Goals", component: "goals" },
    { id: "inventory", title: "Inventory", component: "inventory" },
    { id: "ongoing", title: "Ongoing Activity", component: "ongoing" },
    { id: "history", title: "Activity History", component: "history" },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSections((sections) => {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      return arrayMove(sections, oldIndex, newIndex);
    });
  };

  const renderSection = (section: (typeof sections)[0]) => {
    switch (section.component) {
      case "goals":
        return <GoalsSection tokenId={character.token_id} />;
      case "inventory":
        return (
          <Card className="bg-gray-800/50">
            <CardContent className="p-4 space-y-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsInventoryExpanded(!isInventoryExpanded)}
              >
                <h3 className="text-sm font-semibold text-white">Inventory</h3>
                <motion.div
                  animate={{ rotate: isInventoryExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </motion.div>
              </div>

              <AnimatePresence initial={false}>
                {isInventoryExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 overflow-hidden"
                  >
                    {character?.miners ? (
                      <div className="grid grid-cols-2 gap-4">
                        {character.miners
                          .flatMap((miner) => miner.inventory)
                          .filter((item: InventoryItem) => item.quantity > 0)
                          .map((item: InventoryItem, index: number) => (
                            <div
                              key={index}
                              className="bg-gray-700/30 p-3 rounded-md flex items-center gap-2"
                            >
                              <div className="p-2 bg-gray-600/50 rounded-md relative">
                                <img
                                  src={getResourceImage(item.rcs.value)}
                                  alt={item.rcs.getSubresourceName()}
                                  className="w-6 h-6 pixelated-image object-cover"
                                />
                                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                  {item.quantity}
                                </span>
                              </div>
                              <div>
                                <div className="text-xs text-gray-400">
                                  {item.rcs.getSubresourceName()}
                                </div>
                                <div className="text-sm font-medium">
                                  {item.quantity}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="col-span-2 bg-gray-700/50 p-3 rounded-md text-gray-400 text-sm text-center">
                        No items in inventory
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        );
      case "ongoing":
        return (
          <Card className="bg-gray-800/50">
            <CardContent className="p-4 space-y-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsOngoingExpanded(!isOngoingExpanded)}
              >
                <h3 className="text-sm font-semibold text-white">
                  Ongoing Activity
                </h3>
                <motion.div
                  animate={{ rotate: isOngoingExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </motion.div>
              </div>

              <AnimatePresence initial={false}>
                {isOngoingExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 overflow-hidden"
                  >
                    {selectedResource && character ? (
                      <WorkingDiv
                        selectedResource={selectedResource}
                        character={character}
                        isStreaming={true}
                      />
                    ) : (
                      <div className="bg-gray-700/50 p-3 rounded-md text-gray-400 text-sm text-center">
                        No activity yet
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        );
      case "history":
        return (
          <Card className="bg-gray-800/50">
            <CardContent className="p-4 space-y-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
              >
                <h3 className="text-sm font-semibold text-white">
                  Activity History
                </h3>
                <motion.div
                  animate={{ rotate: isHistoryExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </motion.div>
              </div>

              <AnimatePresence initial={false}>
                {isHistoryExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <ScrollArea className="h-[200px] w-full rounded-md border border-gray-700">
                      <div ref={scrollRef} className="p-4 space-y-2">
                        {events
                          .sort((e1, e2) => e2.timestamp - e1.timestamp)
                          .map((event, index) => (
                            <div
                              key={index}
                              className="text-sm bg-gray-700/30 p-2 rounded flex items-center gap-2"
                            >
                              <div className="flex-shrink-0">
                                {getActivityIcon(eventToString(event))}
                              </div>
                              <span className="text-gray-300 flex-grow">
                                {eventToString(event)}
                              </span>
                              <span className="text-xs text-gray-500">
                                {DateTime.fromMillis(
                                  event.timestamp * 1000,
                                ).toFormat("HH:mm:ss")}
                              </span>
                            </div>
                          ))}
                      </div>
                    </ScrollArea>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        );
    }
  };

  if (!character) {
    return (
      <Card className="w-[350px] bg-gray-800 text-white shadow-xl border border-gray-600">
        <CardContent className="p-4 text-center">
          <span>
            Loading NFT details <LoadingDots />
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Draggable
      handle=".drag-handle"
      position={position}
      onStop={(e, data) => {
        setPosition({ x: data.x, y: data.y });
      }}
      bounds="parent"
    >
      <div>
        <Card className="w-[350px] h-[800px] flex flex-col bg-gray-800 text-white shadow-xl border border-gray-600">
          <CardContent className="p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 drag-handle cursor-move">
              <Button
                variant="outline"
                size="icon"
                onClick={onBack}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>{character.name}</div>
              <AddressDisplay address={character?.walletAddress || ""} />
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">
                  {character?.gold ?? 0}
                </span>
                <GoldImg className="h-8 w-8" />
              </div>
            </div>

            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-1 text-sm items-center h-42 relative">
                  <div className="space-y-2 flex flex-col z-10">
                    <div>Health: {100}</div>
                    <div>Attack: {5}</div>
                    <div>Critical: {5}%</div>
                  </div>

                  <div className="flex justify-center z-0">
                    <div>
                      <AnimatedSprite
                        width={192}
                        height={140}
                        scale={1}
                        fps={10}
                        currentAnimation={AnimationType.Idle}
                        mobType={
                          Object.values(MobType)[
                            parseInt(character.token_id) % 3
                          ]
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2 w-full z-10">
                    <div className="text-sm flex items-center justify-between">
                      <span className="font-medium">Chop lvl</span>
                      <LevelIndicator
                        currentXP={character?.woodProgress ?? 0}
                      />
                    </div>
                    <div className="text-sm flex items-center justify-between">
                      <span className="font-medium">Mine lvl</span>
                      <LevelIndicator
                        currentXP={character?.rockProgress ?? 0}
                      />
                    </div>
                    <div className="text-sm flex items-center justify-between">
                      <span className="font-medium">Food lvl</span>
                      <LevelIndicator
                        currentXP={character?.foodProgress ?? 0}
                      />
                    </div>
                  </div>
                </div>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={sections.map((s) => s.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {sections.map((section) => (
                        <SortableSection key={section.id} section={section}>
                          {renderSection(section)}
                        </SortableSection>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </Draggable>
  );
};

export default NFTStreamingCard;
