import { motion } from "framer-motion";
import React from "react";

interface TabProps {
  text: string;
  active: boolean;
}

export default function Tab({ text, active }: TabProps) {
  return (
    <div
      key={text}
      className={`w-1/2 flex justify-center p-2 rounded-md relative shadow-lg ${
        active ? "bg-primary text-black" : "text-white"
      }`}
    >
      {active && (
        <motion.div
          className="absolute inset-0 rounded-md bg-primary text-white"
          layoutId="underline"
          style={{
            transform: "none",
            transformOrigin: "50% 50% 0px",
          }}
        />
      )}
      <p className="relative font-bold">{text}</p>
    </div>
  );
}
