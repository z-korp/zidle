import { MessagesList } from "./MessageList";
import { Cloud } from "lucide-react";
import { motion } from "framer-motion";

export const DreamingHistoryTab = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Messages list - flexible height */}
      <div className="flex-1 min-h-0">
        <MessagesList />
      </div>

      {/* Cloud thinking animation - fixed height */}
      <div className="flex justify-center gap-4 py-2">
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
        <div className="flex justify-center items-center gap-4 py-2 shrink-0">
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
      </div>
    </div>
  );
};
