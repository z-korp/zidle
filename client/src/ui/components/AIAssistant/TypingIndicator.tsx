import { motion } from "framer-motion";

export const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-700 rounded-lg px-4 py-3 shadow-sm">
        <div className="flex gap-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-1.5 h-1.5 rounded-full bg-gray-400"
              animate={{ y: [0, -4, 0] }}
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
  );
};
