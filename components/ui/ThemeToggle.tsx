"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  dark: boolean;
  toggle: () => void;
}

interface Sparkle {
  id: number;
  angle: number;
  color: string;
}

export function ThemeToggle({ dark, toggle }: ThemeToggleProps) {
  const [pulling, setPulling] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const handlePull = () => {
    if (pulling) return;
    setPulling(true);

    setTimeout(() => {
      toggle();
      setFlashing(true);
      const colors = ["#C9A84C", "#A78BFA", "#93C5FD", "#F5EDD8", "#E8C46A"];
      const newSparkles: Sparkle[] = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        angle: (i / 8) * 360,
        color: colors[i % colors.length],
      }));
      setSparkles(newSparkles);
      setTimeout(() => { setFlashing(false); setSparkles([]); }, 500);
    }, 180);

    setTimeout(() => setPulling(false), 520);
  };

  return (
    <>
      {/* Full-screen flash */}
      <AnimatePresence>
        {flashing && (
          <motion.div
            className="fixed inset-0 z-[999] pointer-events-none"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ background: dark ? "#F5EDD8" : "#0A0812" }}
          />
        )}
      </AnimatePresence>

      {/* Pull cord */}
      <div className="flex flex-col items-center relative" style={{ width: 28 }}>
        {/* Sparkles flying out */}
        <AnimatePresence>
          {sparkles.map((sp) => (
            <motion.div
              key={sp.id}
              className="absolute rounded-full pointer-events-none z-50"
              style={{
                width: 4, height: 4,
                background: sp.color,
                boxShadow: `0 0 4px ${sp.color}`,
                top: 32, left: "50%",
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((sp.angle * Math.PI) / 180) * 22,
                y: Math.sin((sp.angle * Math.PI) / 180) * 22,
                opacity: 0,
                scale: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>

        <button
          onClick={handlePull}
          className="flex flex-col items-center cursor-pointer select-none"
          aria-label="Changer le thème"
        >
          {/* Cord */}
          <motion.div
            style={{
              width: 1,
              height: 18,
              background: "linear-gradient(180deg, rgba(201,168,76,0.3), rgba(201,168,76,0.7))",
              borderRadius: 999,
              originY: "top",
            }}
            animate={{ scaleY: pulling ? 1.45 : 1 }}
            transition={{ type: "spring", stiffness: 700, damping: 18 }}
          />

          {/* Knob */}
          <motion.div
            animate={{ y: pulling ? 16 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 16 }}
            className="relative"
          >
            {/* Glow ring */}
            <motion.div
              className="absolute rounded-full"
              style={{
                inset: -4,
                background: dark ? "#C9A84C" : "#7C3AED",
                filter: "blur(6px)",
              }}
              animate={{ opacity: pulling ? 0.7 : 0.2 }}
              transition={{ duration: 0.2 }}
            />
            {/* Knob itself */}
            <motion.div
              whileHover={{ scale: 1.15 }}
              className="relative w-6 h-6 rounded-full flex items-center justify-center border"
              style={{
                background: dark
                  ? "linear-gradient(135deg, #A07835, #C9A84C, #E8C46A)"
                  : "linear-gradient(135deg, #2E1065, #5B21B6, #7C3AED)",
                borderColor: dark ? "rgba(232,196,106,0.6)" : "rgba(124,58,237,0.6)",
                boxShadow: dark
                  ? "0 2px 10px rgba(201,168,76,0.5), inset 0 1px 0 rgba(255,255,255,0.3)"
                  : "0 2px 10px rgba(91,33,182,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              {dark
                ? <Sun className="w-3 h-3 text-[#2C1810]" />
                : <Moon className="w-3 h-3 text-[#F5EDD8]" />
              }
            </motion.div>
          </motion.div>
        </button>
      </div>
    </>
  );
}
