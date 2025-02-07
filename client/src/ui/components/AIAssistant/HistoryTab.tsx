import { MessagesList } from "./MessageList";
import { Cloud } from "lucide-react";
import { motion } from "framer-motion";

export const HistoryTab = () => {
  return (
    <div className="space-y-4">
      {/* Cloud thinking animation */}
      <div className="flex justify-center items-center gap-4 py-2">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Cloud className="w-8 h-8 text-gray-400" />
        </motion.div>

        {/* Bouncing dots */}
        <div className="flex gap-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-1.5 h-1.5 rounded-full bg-gray-400"
              animate={{ y: [4, 0, 4] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Messages list */}
      <div className="overflow-auto pr-2">
        <MessagesList />
      </div>
    </div>
  );
};
