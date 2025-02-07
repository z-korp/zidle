import { MessagesList } from "./MessageList";
import { Cloud } from "lucide-react";
import { motion } from "framer-motion";

export const HistoryTab = () => {
  return (
    <div className="space-y-4">
      {/* Cloud thinking animation */}
      <div className="flex justify-center py-2">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
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
      </div>

      {/* Messages list */}
      <div className="overflow-auto pr-2">
        <MessagesList />
      </div>
    </div>
  );
};
