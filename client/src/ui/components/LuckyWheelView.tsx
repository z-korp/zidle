import { Character } from "@/hooks/useCharacter";
import { CircleDashed } from "lucide-react";
import { useState } from "react";
import { Button } from "@/ui/elements/button";

interface LuckyWheelViewProps {
  character: Character;
}

/**
 * LuckyWheelView component - Displays a spinning wheel of fortune
 * Allows players to try their luck by spinning the wheel
 */
export const LuckyWheelView: React.FC<LuckyWheelViewProps> = ({
  character,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    const spins = 5 + Math.random() * 5; // Between 5-10 full rotations
    const finalRotation = rotation + spins * 360 + Math.random() * 360;

    // Animate the wheel
    const wheel = document.getElementById("lucky-wheel");
    if (wheel) {
      wheel.style.transition = "transform 5s cubic-bezier(0.2, 0, 0.2, 1)";
      wheel.style.transform = `rotate(${finalRotation}deg)`;
    }

    // Reset after animation
    setTimeout(() => {
      setIsSpinning(false);
      setRotation(finalRotation % 360);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Wheel of Fortune</h2>

      {/* Wheel container */}
      <div className="relative w-[280px] h-[280px] mx-auto">
        {/* Spinning wheel */}
        <div
          id="lucky-wheel"
          className="absolute inset-0 flex items-center justify-center"
        >
          <CircleDashed className="w-full h-full text-gray-600" />

          {/* Wheel segments */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-full"
              style={{
                transform: `rotate(${i * 45}deg)`,
              }}
            >
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-sm font-bold">
                {i + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Center pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4">
          <div className="w-4 h-4 bg-red-500 rotate-45 transform origin-bottom" />
        </div>
      </div>

      {/* Spin button */}
      <Button
        onClick={spinWheel}
        disabled={isSpinning}
        className="w-full"
        variant="outline"
      >
        {isSpinning ? "Spinning..." : "Spin the Wheel!"}
      </Button>
    </div>
  );
};
