"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(useGSAP);
import {
  Plus,
  Search,
  BookOpen,
  HelpCircle,
  X,
  Tag as TagIcon,
  LogOut,
  User,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useEntries } from "@/hooks/useEntries";
import { useTheme } from "@/hooks/useTheme";
import { EntryCard } from "@/components/entries/EntryCard";
import { EntryForm } from "@/components/entries/EntryForm";
import { BottomNav } from "@/components/layout/BottomNav";
import { Badge } from "@/components/ui/badge";
import { Starfield } from "@/components/ui/Starfield";
import { Entry, EntryType, TAG_COLORS } from "@/types";
import { deleteTag, updateTag } from "@/lib/firestore";
import { useRouter } from "next/navigation";

function ColumnDecor() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{
          width: 14,
          height: 4,
          background: "rgba(201,168,76,0.7)",
          borderRadius: "2px 2px 0 0",
        }}
      />
      <div
        style={{ width: 10, height: 2, background: "rgba(201,168,76,0.5)" }}
      />
      <div
        style={{
          width: 8,
          height: 60,
          background:
            "linear-gradient(90deg, rgba(201,168,76,0.05), rgba(201,168,76,0.18) 30%, rgba(255,255,255,0.03) 50%, rgba(201,168,76,0.18) 70%, rgba(201,168,76,0.05))",
          border: "1px solid rgba(201,168,76,0.22)",
        }}
      />
      <div
        style={{ width: 10, height: 2, background: "rgba(201,168,76,0.5)" }}
      />
      <div
        style={{
          width: 14,
          height: 4,
          background: "rgba(201,168,76,0.7)",
          borderRadius: "0 0 2px 2px",
        }}
      />
    </div>
  );
}

function GlobeArtifact() {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 32% 32%, #60A5FA, #1E3A8A, #080D2E)",
          border: "1px solid rgba(201,168,76,0.5)",
          boxShadow: "0 0 14px rgba(59,130,246,0.35)",
          position: "relative",
          overflow: "hidden",
          margin: "0 auto",
        }}
      >
        {[30, 52, 72].map((t) => (
          <div
            key={t}
            style={{
              position: "absolute",
              top: `${t}%`,
              left: 0,
              right: 0,
              height: 1,
              background: "rgba(201,168,76,0.28)",
            }}
          />
        ))}
        {[25, 50, 75].map((l) => (
          <div
            key={l}
            style={{
              position: "absolute",
              left: `${l}%`,
              top: 0,
              bottom: 0,
              width: 1,
              background: "rgba(201,168,76,0.2)",
            }}
          />
        ))}
      </div>
      <div
        style={{
          width: 4,
          height: 5,
          background: "rgba(201,168,76,0.45)",
          margin: "0 auto",
        }}
      />
      <div
        style={{
          width: 18,
          height: 3,
          background: "rgba(201,168,76,0.55)",
          margin: "0 auto",
          borderRadius: 1,
        }}
      />
      <p
        style={{
          fontSize: 6,
          color: "rgba(201,168,76,0.5)",
          fontFamily: "Georgia, serif",
          marginTop: 2,
          letterSpacing: "0.08em",
        }}
      >
        Sphère
      </p>
    </div>
  );
}

function ScrollArtifact() {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: 28,
          height: 46,
          background: "linear-gradient(180deg, #E8C46A, #D4A84C)",
          borderRadius: 3,
          border: "1px solid rgba(139,88,25,0.5)",
          position: "relative",
          overflow: "hidden",
          margin: "0 auto",
          boxShadow:
            "2px 2px 8px rgba(0,0,0,0.35), inset 1px 0 0 rgba(255,255,255,0.25)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -3,
            left: -2,
            right: -2,
            height: 7,
            background: "linear-gradient(180deg, #F5D87A, #C9A030)",
            borderRadius: "3px 3px 0 0",
            border: "1px solid rgba(139,88,25,0.4)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -3,
            left: -2,
            right: -2,
            height: 7,
            background: "linear-gradient(180deg, #C9A030, #8B6820)",
            borderRadius: "0 0 3px 3px",
            border: "1px solid rgba(139,88,25,0.4)",
          }}
        />
        {[8, 14, 20, 28, 34].map((y) => (
          <div
            key={y}
            style={{
              position: "absolute",
              top: y,
              left: 5,
              right: 5,
              height: 1,
              background: "rgba(100,60,10,0.25)",
              borderRadius: 1,
            }}
          />
        ))}
      </div>
      <p
        style={{
          fontSize: 6,
          color: "rgba(201,168,76,0.5)",
          fontFamily: "Georgia, serif",
          marginTop: 6,
          letterSpacing: "0.08em",
        }}
      >
        Parchemin
      </p>
    </div>
  );
}

function HourglassArtifact() {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: 28, margin: "0 auto" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: 3,
            background: "rgba(201,168,76,0.55)",
            borderRadius: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: 3,
            background: "rgba(201,168,76,0.55)",
            borderRadius: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: -2,
            right: -2,
            height: 3,
            background: "rgba(201,168,76,0.65)",
            borderRadius: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: -2,
            right: -2,
            height: 3,
            background: "rgba(201,168,76,0.65)",
            borderRadius: 1,
          }}
        />
        <div
          style={{
            height: 22,
            background:
              "linear-gradient(180deg, rgba(147,51,234,0.6), rgba(147,51,234,0.1))",
            clipPath: "polygon(5% 0%, 95% 0%, 55% 100%, 45% 100%)",
          }}
        />
        <div
          style={{
            height: 4,
            background: "rgba(201,168,76,0.3)",
            margin: "0 6px",
          }}
        />
        <div
          style={{
            height: 22,
            background:
              "linear-gradient(180deg, rgba(201,168,76,0.15), rgba(147,51,234,0.55))",
            clipPath: "polygon(45% 0%, 55% 0%, 95% 100%, 5% 100%)",
          }}
        />
      </div>
      <p
        style={{
          fontSize: 6,
          color: "rgba(201,168,76,0.5)",
          fontFamily: "Georgia, serif",
          marginTop: 4,
          letterSpacing: "0.08em",
        }}
      >
        Sablier
      </p>
    </div>
  );
}

function CabinetHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative mb-5 rounded-2xl overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #12032A 0%, #1E0842 50%, #2D0A47 100%)",
        border: "1px solid rgba(201,168,76,0.35)",
        boxShadow:
          "0 8px 32px rgba(91,33,182,0.35), inset 0 1px 0 rgba(201,168,76,0.25)",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] shimmer-gold" />
      {/* Arch */}
      <div
        style={{
          position: "absolute",
          top: -20,
          left: "18%",
          right: "18%",
          height: 50,
          border: "1px solid rgba(201,168,76,0.22)",
          borderRadius: "50% 50% 0 0",
          borderBottom: "none",
        }}
      />
      {/* Left column */}
      <div
        style={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <ColumnDecor />
      </div>
      {/* Right column */}
      <div
        style={{
          position: "absolute",
          right: 14,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <ColumnDecor />
      </div>
      {/* Content */}
      <div
        style={{ padding: "22px 60px 18px", position: "relative", zIndex: 1 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: 20,
            marginBottom: 14,
          }}
        >
          <ScrollArtifact />
          <GlobeArtifact />
          <HourglassArtifact />
        </div>
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(201,168,76,0.55), transparent)",
            marginBottom: 8,
          }}
        />
        <p
          style={{
            textAlign: "center",
            fontSize: 9,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "rgba(201,168,76,0.85)",
            fontFamily: "Georgia, serif",
          }}
        >
          ✦ &nbsp;Cabinet de Curiosités&nbsp; ✦
        </p>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)",
        }}
      />
    </motion.div>
  );
}

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex flex-col items-center" style={{ opacity: 0.6 }}>
        <div
          style={{
            width: 8,
            height: 3,
            background: "#C9A84C",
            borderRadius: 1,
          }}
        />
        <div
          style={{ width: 2, height: 14, background: "rgba(201,168,76,0.5)" }}
        />
        <div
          style={{
            width: 5,
            height: 2,
            background: "#C9A84C",
            borderRadius: 1,
          }}
        />
      </div>
      <div
        className="flex-1 h-px"
        style={{
          background:
            "linear-gradient(90deg, rgba(201,168,76,0.3), rgba(201,168,76,0.7))",
        }}
      />
      <span
        className="text-[9px] font-bold tracking-[0.28em] uppercase whitespace-nowrap"
        style={{ color: "#C9A84C", fontFamily: "Georgia, serif" }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-px"
        style={{
          background:
            "linear-gradient(90deg, rgba(201,168,76,0.7), rgba(201,168,76,0.3))",
        }}
      />
      <div className="flex flex-col items-center" style={{ opacity: 0.6 }}>
        <div
          style={{
            width: 8,
            height: 3,
            background: "#C9A84C",
            borderRadius: 1,
          }}
        />
        <div
          style={{ width: 2, height: 14, background: "rgba(201,168,76,0.5)" }}
        />
        <div
          style={{
            width: 5,
            height: 2,
            background: "#C9A84C",
            borderRadius: 1,
          }}
        />
      </div>
    </div>
  );
}

const SHELF_BOOKS = [
  {
    h: 54,
    w: 13,
    bg: "linear-gradient(180deg,#3B0764,#7C3AED)",
    border: "#9333EA",
  },
  {
    h: 43,
    w: 10,
    bg: "linear-gradient(180deg,#1E3A8A,#3B82F6)",
    border: "#60A5FA",
  },
  {
    h: 61,
    w: 15,
    bg: "linear-gradient(180deg,#4C1D95,#8B5CF6)",
    border: "#A78BFA",
  },
  {
    h: 47,
    w: 11,
    bg: "linear-gradient(180deg,#92400E,#C9A84C)",
    border: "#E8C46A",
  },
  {
    h: 58,
    w: 14,
    bg: "linear-gradient(180deg,#0F172A,#1E3A8A)",
    border: "#2563EB",
  },
  {
    h: 40,
    w: 10,
    bg: "linear-gradient(180deg,#6B21A8,#A855F7)",
    border: "#C084FC",
  },
  {
    h: 65,
    w: 16,
    bg: "linear-gradient(180deg,#1E0842,#5B21B6)",
    border: "#7C3AED",
  },
  {
    h: 44,
    w: 11,
    bg: "linear-gradient(180deg,#78350F,#D97706)",
    border: "#FCD34D",
  },
  {
    h: 52,
    w: 13,
    bg: "linear-gradient(180deg,#0C4A6E,#0284C7)",
    border: "#38BDF8",
  },
  {
    h: 38,
    w: 9,
    bg: "linear-gradient(180deg,#4A044E,#9333EA)",
    border: "#E879F9",
  },
];
const SHELF_LABELS = [
  "De Rerum",
  "Natura",
  "Curiosa",
  "Aurum",
  "Historia",
  "Mysteria",
  "Scientia",
  "Opera",
  "Alchimia",
  "Arcana",
];

function BookShelf() {
  return (
    <div className="mb-5 -mx-1">
      <div className="flex items-end gap-[2px] justify-center px-2">
        {SHELF_BOOKS.map((book, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.04,
              duration: 0.4,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="relative flex items-center justify-center select-none"
            style={{
              width: book.w,
              height: book.h,
              background: book.bg,
              borderRadius: "2px 2px 0 0",
              borderLeft: `1px solid ${book.border}44`,
              borderTop: `1px solid ${book.border}66`,
              borderRight: "1px solid rgba(0,0,0,0.35)",
              boxShadow:
                "2px 0 5px rgba(0,0,0,0.3), inset 1px 0 0 rgba(255,255,255,0.08)",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                fontSize: 5,
                color: "rgba(255,255,255,0.5)",
                fontFamily: "Georgia, serif",
                letterSpacing: "0.06em",
                transform: "rotate(180deg)",
                userSelect: "none",
              }}
            >
              {SHELF_LABELS[i]}
            </span>
          </motion.div>
        ))}
      </div>
      <div
        style={{
          height: 7,
          background: "linear-gradient(180deg,#7B4A1E,#5A3210)",
          margin: "0 8px",
          borderRadius: "0 0 3px 3px",
          boxShadow: "0 4px 10px rgba(44,24,16,0.4)",
        }}
      />
      <div
        style={{
          height: 3,
          background: "rgba(44,24,16,0.12)",
          margin: "0 20px",
          borderRadius: "0 0 3px 3px",
          filter: "blur(3px)",
        }}
      />
    </div>
  );
}

const pageTex = [
  "radial-gradient(ellipse 90% 70% at 10% 15%, rgba(140,80,10,0.10) 0%, transparent 65%)",
  "radial-gradient(ellipse 70% 90% at 90% 80%, rgba(100,55,8,0.09) 0%, transparent 65%)",
  "radial-gradient(ellipse 50% 50% at 55% 45%, rgba(180,130,40,0.05) 0%, transparent 55%)",
  "linear-gradient(180deg, rgba(50,20,4,0.07) 0%, transparent 18%, transparent 80%, rgba(50,20,4,0.09) 100%)",
].join(", ");

const BOOK_PAGES = [
  { base: [205, 170, 85] as [number, number, number], initY: 0 },
  { base: [210, 176, 92] as [number, number, number], initY: 8 },
  { base: [215, 182, 98] as [number, number, number], initY: 16 },
  { base: [218, 186, 102] as [number, number, number], initY: 24 },
  { base: [220, 190, 106] as [number, number, number], initY: 32 },
];

function BookFlipEffect({ trigger }: { trigger: number }) {
  const [active, setActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trigger === 0) return;
    setActive(true);
    const t = setTimeout(() => setActive(false), 700);
    return () => clearTimeout(t);
  }, [trigger]);

  useGSAP(
    () => {
      if (!active || !containerRef.current) return;

      const leftPages =
        containerRef.current.querySelectorAll<HTMLElement>(".book-left-page");
      const rightPages =
        containerRef.current.querySelectorAll<HTMLElement>(".book-right-page");

      // Explicit initial states — GSAP needs to own the transform
      gsap.set(leftPages, { rotationY: 180, transformOrigin: "right center" });
      rightPages.forEach((el, i) =>
        gsap.set(el, {
          rotationY: BOOK_PAGES[i].initY,
          transformOrigin: "left center",
        }),
      );

      const tl = gsap.timeline({ defaults: { duration: 0.2 } });

      // Right pages flip over spine (initY → -180), power3.in = fast at end
      tl.to(
        rightPages,
        {
          rotationY: -180,
          ease: "power3.in",
          stagger: 0.05,
        },
        0,
      );

      // Left pages land from spine (180 → 0), back.out = natural settle
      tl.to(
        leftPages,
        {
          rotationY: 0,
          ease: "back.out(1.2)",
          stagger: 0.05,
        },
        0.05,
      );
    },
    {
      dependencies: [trigger, active],
      scope: containerRef,
      revertOnUpdate: true,
    },
  );

  if (!active) return null;

  const leatherBg =
    "linear-gradient(160deg, #2a0e03 0%, #4a1a06 25%, #6b2a0c 50%, #4a1a06 75%, #2a0e03 100%)";

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 56,
        left: 0,
        right: 0,
        bottom: 64,
        zIndex: 50,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(8,4,0,0.55)",
      }}
    >
      {/* THE BOOK — floating centered */}
      <div
        style={{
          position: "relative",
          width: "98%",
          maxWidth: 540,
          height: "60%",
          borderRadius: 6,
          background: leatherBg,
          boxShadow:
            "0 8px 48px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
          overflow: "hidden",
        }}
      >
        {/* OUTER gold border */}
        <div
          style={{
            position: "absolute",
            inset: 5,
            border: "1.5px solid rgba(201,168,76,0.65)",
            borderRadius: 3,
            pointerEvents: "none",
            zIndex: 30,
          }}
        />
        {/* INNER gold border */}
        <div
          style={{
            position: "absolute",
            inset: 9,
            border: "1px solid rgba(201,168,76,0.30)",
            borderRadius: 2,
            pointerEvents: "none",
            zIndex: 30,
          }}
        />

        {/* Corner ornaments */}
        {(
          [
            ["top", "left"],
            ["top", "right"],
            ["bottom", "left"],
            ["bottom", "right"],
          ] as const
        ).map(([v, h], idx) => (
          <div
            key={idx}
            style={{
              position: "absolute",
              zIndex: 31,
              [v]: 14,
              [h]: 14,
              width: 22,
              height: 22,
              borderTop:
                v === "top" ? "2px solid rgba(201,168,76,0.8)" : "none",
              borderBottom:
                v === "bottom" ? "2px solid rgba(201,168,76,0.8)" : "none",
              borderLeft:
                h === "left" ? "2px solid rgba(201,168,76,0.8)" : "none",
              borderRight:
                h === "right" ? "2px solid rgba(201,168,76,0.8)" : "none",
            }}
          />
        ))}

        {/* Cover inner content — left panel */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            bottom: 14,
            width: "calc(50% - 20px)",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 22,
                color: "rgba(201,168,76,0.6)",
                marginBottom: 6,
              }}
            >
              ◆
            </div>
            <div
              style={{
                width: 1,
                height: 40,
                background:
                  "linear-gradient(180deg,transparent,rgba(201,168,76,0.4),transparent)",
                margin: "0 auto 6px",
              }}
            />
            <div style={{ fontSize: 22, color: "rgba(201,168,76,0.6)" }}>◆</div>
          </div>
        </div>

        {/* SPINE */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "calc(50% - 7px)",
            width: 14,
            zIndex: 20,
            background:
              "linear-gradient(90deg, #0a0200, #2a0d03, #140601, #2a0d03, #0a0200)",
            boxShadow: "0 0 16px rgba(0,0,0,0.8)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "20%",
              bottom: "20%",
              left: 5,
              right: 5,
              background:
                "linear-gradient(180deg,transparent,rgba(201,168,76,0.4),transparent)",
              borderRadius: 2,
            }}
          />
        </div>

        {/* LEFT PAGES — land from spine, rotationY 180→0 */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            right: "calc(50% + 7px)",
            bottom: 14,
            perspective: "600px",
            perspectiveOrigin: "right center",
            zIndex: 10,
          }}
        >
          {BOOK_PAGES.map(({ base: [r, g, b] }, i) => (
            <div
              key={i}
              className="book-left-page"
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: `rgba(${r},${g},${b},${0.97 - i * 0.05})`,
                backgroundImage: pageTex,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: 28,
                  background:
                    "linear-gradient(270deg,rgba(20,8,1,0.3),transparent)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "48%",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  fontSize: 10,
                  color: "rgba(100,60,10,0.25)",
                }}
              >
                ✦
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT PAGES — flip over spine */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: "calc(50% + 7px)",
            right: 14,
            bottom: 14,
            perspective: "600px",
            perspectiveOrigin: "left center",
            zIndex: 10,
          }}
        >
          {BOOK_PAGES.map(({ base: [r, g, b] }, i) => (
            <div
              key={i}
              className="book-right-page"
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: `rgba(${r},${g},${b},${0.97 - i * 0.05})`,
                backgroundImage: pageTex,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 28,
                  background:
                    "linear-gradient(90deg,rgba(20,8,1,0.3),transparent)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "48%",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  fontSize: 10,
                  color: "rgba(100,60,10,0.25)",
                }}
              >
                ✦
              </div>
            </div>
          ))}
        </div>

        {/* Cover texture overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            backgroundImage:
              "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 60%), radial-gradient(ellipse 100% 60% at 50% 100%, rgba(0,0,0,0.2) 0%, transparent 80%)",
          }}
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { entries, tags, loading } = useEntries();
  const { dark, toggle: toggleTheme } = useTheme();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("home");
  const [flipTrigger, setFlipTrigger] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editEntry, setEditEntry] = useState<Entry | null>(null);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTagName, setEditingTagName] = useState("");
  const [editingTagColor, setEditingTagColor] = useState("");
  const [confirmDeleteTagId, setConfirmDeleteTagId] = useState<string | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<EntryType | "all">("all");
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "az" | "za">(
    "newest",
  );

  const handleLogout = async () => {
    await logout();
    router.push("/auth");
  };
  const handleTabChange = (tab: string) => {
    setFlipTrigger((n) => n + 1);
    setActiveTab(tab);
  };

  const rank =
    entries.length >= 200
      ? { title: "Maître du Cabinet", level: 5 }
      : entries.length >= 100
        ? { title: "Grand Érudit", level: 4 }
        : entries.length >= 50
          ? { title: "Érudit", level: 3 }
          : entries.length >= 20
            ? { title: "Collectionneur", level: 2 }
            : entries.length >= 5
              ? { title: "Apprenti", level: 1 }
              : {
                  title: `Cabinet de ${user?.displayName?.split(" ")[0] || "curiosités"}`,
                  level: 0,
                };

  const SORT_CYCLE = ["newest", "oldest", "az", "za"] as const;
  const SORT_LABELS: Record<string, string> = {
    newest: "Récent ↓",
    oldest: "Ancien ↑",
    az: "A → Z",
    za: "Z → A",
  };
  const cycleSort = () => {
    const idx = SORT_CYCLE.indexOf(sortBy);
    setSortBy(SORT_CYCLE[(idx + 1) % SORT_CYCLE.length]);
  };

  const entryIndexMap = useMemo(() => {
    const sorted = [...entries].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );
    return new Map(sorted.map((e, i) => [e.id, i]));
  }, [entries]);

  const filtered = useMemo(() => {
    const base = entries.filter((e) => {
      const matchSearch =
        !search ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.content.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "all" || e.type === filterType;
      const matchTags =
        filterTags.length === 0 || filterTags.every((t) => e.tags.includes(t));
      return matchSearch && matchType && matchTags;
    });
    return [...base].sort((a, b) => {
      if (sortBy === "newest")
        return b.createdAt.getTime() - a.createdAt.getTime();
      if (sortBy === "oldest")
        return a.createdAt.getTime() - b.createdAt.getTime();
      if (sortBy === "az") return a.title.localeCompare(b.title, "fr");
      if (sortBy === "za") return b.title.localeCompare(a.title, "fr");
      return 0;
    });
  }, [entries, search, filterType, filterTags, sortBy]);

  const toggleFilterTag = (id: string) =>
    setFilterTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  const specimenCount = entries.filter((e) => e.type === "word").length;
  const enigmeCount = entries.filter((e) => e.type === "question").length;
  const openEdit = (entry: Entry) => {
    setEditEntry(entry);
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setEditEntry(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          <p
            className="text-xs text-[var(--muted)] tracking-widest uppercase"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Ouverture du cabinet...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Starfield active={dark} />

      {/* ── BACKGROUND ROOM DECOR ── fixed, z-index 1, behind content */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 1 }}
      >
        {/* Double ornamental frame around the viewport */}
        <div
          style={{
            position: "absolute",
            inset: "52px 6px 64px 6px",
            border: "1.5px solid rgba(201,168,76,0.18)",
            borderRadius: 16,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "57px 11px 69px 11px",
            border: "1px solid rgba(201,168,76,0.08)",
            borderRadius: 14,
          }}
        />

        {/* TOP arch pediment */}
        <div
          style={{
            position: "absolute",
            top: 52,
            left: "12%",
            right: "12%",
            height: 36,
            border: "1px solid rgba(201,168,76,0.16)",
            borderRadius: "50% 50% 0 0",
            borderBottom: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 58,
            left: "20%",
            right: "20%",
            height: 28,
            border: "1px solid rgba(201,168,76,0.09)",
            borderRadius: "50% 50% 0 0",
            borderBottom: "none",
          }}
        />

        {/* BOTTOM decorative shelf line */}
        <div
          style={{
            position: "absolute",
            bottom: 64,
            left: 6,
            right: 6,
            height: 6,
            background:
              "linear-gradient(180deg, rgba(201,168,76,0.12), rgba(201,168,76,0.22))",
            borderRadius: "2px 2px 0 0",
            boxShadow: "0 3px 8px rgba(44,24,16,0.15)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 63,
            left: 20,
            right: 20,
            height: 2,
            background: "rgba(201,168,76,0.12)",
            filter: "blur(2px)",
          }}
        />

        {/* Corner ornaments — bigger */}
        {(["tl", "tr", "bl", "br"] as const).map((pos) => (
          <div
            key={pos}
            style={{
              position: "absolute",
              top: pos.startsWith("t") ? 52 : "auto",
              bottom: pos.startsWith("b") ? 64 : "auto",
              left: pos.endsWith("l") ? 6 : "auto",
              right: pos.endsWith("r") ? 6 : "auto",
              width: 20,
              height: 20,
              borderTop: pos.startsWith("t")
                ? "2px solid rgba(201,168,76,0.5)"
                : "none",
              borderBottom: pos.startsWith("b")
                ? "2px solid rgba(201,168,76,0.5)"
                : "none",
              borderLeft: pos.endsWith("l")
                ? "2px solid rgba(201,168,76,0.5)"
                : "none",
              borderRight: pos.endsWith("r")
                ? "2px solid rgba(201,168,76,0.5)"
                : "none",
              borderRadius:
                pos === "tl"
                  ? "6px 0 0 0"
                  : pos === "tr"
                    ? "0 6px 0 0"
                    : pos === "bl"
                      ? "0 0 0 6px"
                      : "0 0 6px 0",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header
        className="sticky top-0 z-30"
        style={{
          background: "var(--card)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
          boxShadow:
            "0 2px 20px rgba(44,24,16,0.08), inset 0 -1px 0 rgba(201,168,76,0.12)",
        }}
      >
        {/* Gold bottom stripe on header */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)",
          }}
        />
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Crest logo */}
              <div
                className="w-10 h-10 specimen-header rounded-lg flex items-center justify-center border border-[#7C3AED]/50 relative"
                style={{
                  boxShadow:
                    rank.level >= 3
                      ? `0 0 ${8 + rank.level * 4}px rgba(201,168,76,${0.2 + rank.level * 0.08}), 0 4px 12px rgba(91,33,182,0.3)`
                      : "0 4px 12px rgba(91,33,182,0.3)",
                }}
              >
                <BookOpen className="w-5 h-5 text-[#F5EDD8]" />
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(201,168,76,0.15), transparent)",
                  }}
                />
              </div>
              <div>
                <h1
                  className="font-bold text-[#2C1810] dark:text-[#F5EDD8] leading-tight"
                  style={{
                    fontFamily: "var(--font-crimson, Georgia, serif)",
                    fontSize: "1.1rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  MonSavoir
                </h1>
                <p
                  className="text-[9px] leading-tight tracking-[0.12em] uppercase"
                  style={{
                    color: rank.level >= 2 ? "#C9A84C" : "#8B6F4E",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {rank.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activeTab !== "profile" && entries.length > 0 && (
                <span
                  className={`text-[9px] font-bold px-2.5 py-1 rounded-md tracking-widest uppercase ${rank.level >= 4 ? "shimmer-gold" : ""}`}
                  style={{
                    background:
                      rank.level >= 3
                        ? "linear-gradient(135deg, rgba(201,168,76,0.22), rgba(232,196,106,0.15))"
                        : "rgba(201,168,76,0.12)",
                    color: rank.level >= 3 ? "#E8C46A" : "#C9A84C",
                    border: `1px solid rgba(201,168,76,${0.2 + rank.level * 0.1})`,
                    fontFamily: "Georgia, serif",
                    boxShadow:
                      rank.level >= 3
                        ? `0 0 ${rank.level * 4}px rgba(201,168,76,${rank.level * 0.07})`
                        : "none",
                  }}
                >
                  {entries.length} pièce{entries.length !== 1 ? "s" : ""}
                </span>
              )}
              <ThemeToggle dark={dark} toggle={toggleTheme} />
            </div>
          </div>
        </div>
      </header>

      <main
        className="max-w-lg mx-auto px-4 pb-32 pt-4"
        style={{ perspective: "700px", perspectiveOrigin: "50% 40%" }}
      >
        <AnimatePresence mode="wait">
          {/* HOME TAB */}
          {activeTab === "home" && (
            <motion.div
              key="home"
              style={{
                transformOrigin: "left center",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
              initial={{ rotateY: 90, opacity: 0.6, scale: 0.98 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: -90, opacity: 0.6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <>
                <SectionHeading label="Collection Personnelle" />

                {/* Stats */}
                {entries.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <button
                      onClick={() =>
                        setFilterType(filterType === "word" ? "all" : "word")
                      }
                      className="specimen-header rounded-xl p-4 text-left active:scale-95 transition-transform duration-150 relative overflow-hidden border border-[#7C3AED]/40 card-ornate"
                      style={{
                        boxShadow:
                          "0 4px 20px rgba(91,33,182,0.4), inset 0 1px 0 rgba(201,168,76,0.25)",
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(45deg, rgba(201,168,76,0.3) 0, rgba(201,168,76,0.3) 1px, transparent 0, transparent 50%)",
                          backgroundSize: "8px 8px",
                        }}
                      />
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 bg-white/15 rounded-md flex items-center justify-center border border-white/25">
                            <BookOpen className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span
                            className="text-2xl font-bold text-white"
                            style={{
                              fontFamily: "var(--font-crimson, Georgia, serif)",
                            }}
                          >
                            <AnimatedCounter to={specimenCount} />
                          </span>
                        </div>
                        <p className="text-[9px] text-white/60 tracking-[0.15em] uppercase font-bold">
                          Artefacts
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={() =>
                        setFilterType(
                          filterType === "question" ? "all" : "question",
                        )
                      }
                      className="enigme-header rounded-xl p-4 text-left active:scale-95 transition-transform duration-150 relative overflow-hidden border border-[#2563EB]/40 card-ornate"
                      style={{
                        boxShadow:
                          "0 4px 20px rgba(30,58,138,0.4), inset 0 1px 0 rgba(201,168,76,0.25)",
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(45deg, rgba(201,168,76,0.3) 0, rgba(201,168,76,0.3) 1px, transparent 0, transparent 50%)",
                          backgroundSize: "8px 8px",
                        }}
                      />
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 bg-white/15 rounded-md flex items-center justify-center border border-white/25">
                            <HelpCircle className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span
                            className="text-2xl font-bold text-white"
                            style={{
                              fontFamily: "var(--font-crimson, Georgia, serif)",
                            }}
                          >
                            <AnimatedCounter to={enigmeCount} />
                          </span>
                        </div>
                        <p className="text-[9px] text-white/60 tracking-[0.15em] uppercase font-bold">
                          Mystères
                        </p>
                      </div>
                    </button>
                  </div>
                )}

                {/* Decorative bookshelf */}
                <BookShelf />

                {/* Filter + Sort */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
                    {(["all", "word", "question"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setFilterType(t)}
                        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200 tracking-widest uppercase border"
                        style={
                          t === "all" && filterType === "all"
                            ? {
                                background: "#2C1810",
                                color: "#F5EDD8",
                                borderColor: "#2C1810",
                              }
                            : t === "word" && filterType === "word"
                              ? {
                                  background:
                                    "linear-gradient(135deg, #2E1065, #5B21B6)",
                                  color: "#F5EDD8",
                                  borderColor: "#7C3AED",
                                }
                              : t === "question" && filterType === "question"
                                ? {
                                    background:
                                      "linear-gradient(135deg, #0F172A, #1E3A8A)",
                                    color: "#F5EDD8",
                                    borderColor: "#2563EB",
                                  }
                                : {
                                    background: "var(--card)",
                                    color: "#8B6F4E",
                                    borderColor: "var(--border)",
                                  }
                        }
                      >
                        {t === "all" ? (
                          "Tout"
                        ) : t === "word" ? (
                          <>
                            <BookOpen className="w-3 h-3" />
                            Artefacts
                          </>
                        ) : (
                          <>
                            <HelpCircle className="w-3 h-3" />
                            Mystères
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                  <motion.button
                    onClick={cycleSort}
                    whileTap={{ scale: 0.88, rotate: 12 }}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors tracking-widest uppercase"
                    style={
                      sortBy !== "newest"
                        ? {
                            background:
                              "linear-gradient(135deg, #C9A84C, #E8C46A)",
                            color: "#2C1810",
                            borderColor: "#C9A84C",
                            boxShadow: "0 2px 8px rgba(201,168,76,0.35)",
                          }
                        : {
                            background: "var(--card)",
                            color: "#8B6F4E",
                            borderColor: "var(--border)",
                          }
                    }
                  >
                    <span style={{ fontSize: 12 }}>🪄</span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={sortBy}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                      >
                        {SORT_LABELS[sortBy]}
                      </motion.span>
                    </AnimatePresence>
                  </motion.button>
                </div>

                {/* Entries grid */}
                {entries.length === 0 ? (
                  <EmptyState
                    onAdd={() => setShowForm(true)}
                    filterType={filterType}
                  />
                ) : filtered.length === 0 ? (
                  <EmptyState
                    onAdd={() => setShowForm(true)}
                    filterType={filterType}
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-3 items-start">
                    {filtered.map((entry, i) => (
                      <EntryCard
                        key={entry.id}
                        entry={entry}
                        tags={tags}
                        onEdit={openEdit}
                        index={entryIndexMap.get(entry.id) ?? i}
                      />
                    ))}
                  </div>
                )}
              </>
            </motion.div>
          )}

          {/* SEARCH TAB */}
          {activeTab === "search" && (
            <motion.div
              key="search"
              style={{
                transformOrigin: "left center",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
              initial={{ rotateY: 90, opacity: 0.6, scale: 0.98 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: -90, opacity: 0.6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="space-y-4">
                <SectionHeading label="Consulter les Archives" />
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Chercher dans ta collection..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 rounded-lg border text-sm placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                    style={{
                      background: "var(--card)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                      fontFamily: "Georgia, serif",
                    }}
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  {(["all", "word", "question"] as const).map((t) => {
                    const label =
                      t === "all"
                        ? "Tout"
                        : t === "word"
                          ? "Artefacts"
                          : "Mystères";
                    const active = filterType === t;
                    const accent =
                      t === "word"
                        ? "#7C3AED"
                        : t === "question"
                          ? "#2563EB"
                          : "#C9A84C";
                    return (
                      <button
                        key={t}
                        onClick={() => setFilterType(t)}
                        className="flex-1 py-2 rounded-lg text-[9px] font-bold tracking-[0.15em] uppercase transition-all border"
                        style={{
                          fontFamily: "Georgia, serif",
                          background: active ? `${accent}18` : "var(--card)",
                          borderColor: active ? accent : "var(--border)",
                          color: active ? accent : "var(--muted)",
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => toggleFilterTag(tag.id)}
                      >
                        <Badge
                          color={tag.color}
                          className={
                            filterTags.includes(tag.id)
                              ? "opacity-100"
                              : "opacity-40"
                          }
                        >
                          {tag.name}
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}
                {search || filterTags.length > 0 ? (
                  filtered.length > 0 ? (
                    <div className="space-y-3">
                      <p
                        className="text-[9px] text-[var(--muted)] tracking-widest uppercase"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        {filtered.length} résultat
                        {filtered.length !== 1 ? "s" : ""}
                      </p>
                      <div className="grid grid-cols-2 gap-3 items-start">
                        {filtered.map((entry, i) => (
                          <EntryCard
                            key={entry.id}
                            entry={entry}
                            tags={tags}
                            onEdit={openEdit}
                            index={entryIndexMap.get(entry.id) ?? i}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <p
                        className="text-sm text-[var(--muted)]"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        Aucune pièce pour &ldquo;{search}&rdquo;
                      </p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-16">
                    <div
                      className="text-4xl mb-3"
                      style={{ filter: "grayscale(0.4) opacity(0.5)" }}
                    >
                      📜
                    </div>
                    <p
                      className="text-xs tracking-widest uppercase mb-1"
                      style={{
                        color: "var(--muted)",
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      Interroge les archives
                    </p>
                    <p
                      className="text-[10px]"
                      style={{
                        color: "var(--muted)",
                        fontFamily: "Georgia, serif",
                        opacity: 0.6,
                      }}
                    >
                      Cherche par titre, contenu ou famille
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAGS TAB */}
          {activeTab === "tags" && (
            <motion.div
              key="tags"
              style={{
                transformOrigin: "left center",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
              initial={{ rotateY: 90, opacity: 0.6, scale: 0.98 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: -90, opacity: 0.6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="space-y-4">
                <SectionHeading label="Familles & Classifications" />
                {tags.length === 0 ? (
                  <div className="text-center py-16">
                    <TagIcon
                      className="w-10 h-10 mx-auto mb-3 text-[#D4B896]"
                      strokeWidth={1}
                    />
                    <p
                      className="text-xs text-[var(--muted)] tracking-widest uppercase"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Aucune classification
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tags.map((tag) => {
                      const count = entries.filter((e) =>
                        e.tags.includes(tag.id),
                      ).length;
                      const isEditing = editingTagId === tag.id;
                      const isConfirmDelete = confirmDeleteTagId === tag.id;
                      return (
                        <div
                          key={tag.id}
                          className="rounded-xl px-4 py-3 border flex items-center justify-between gap-2"
                          style={{
                            background: isConfirmDelete
                              ? "rgba(185,28,28,0.04)"
                              : "var(--card)",
                            borderColor: isEditing
                              ? "#C9A84C"
                              : isConfirmDelete
                                ? "rgba(185,28,28,0.3)"
                                : "var(--border)",
                            boxShadow: isEditing
                              ? "0 0 0 1px rgba(201,168,76,0.3), inset 0 1px 0 rgba(201,168,76,0.15)"
                              : "inset 0 1px 0 rgba(201,168,76,0.1)",
                            minHeight: 52,
                          }}
                        >
                          {isConfirmDelete ? (
                            <>
                              <p
                                className="flex-1 text-xs"
                                style={{
                                  color: "var(--foreground)",
                                  fontFamily: "Georgia, serif",
                                }}
                              >
                                Retirer{" "}
                                <span style={{ color: "#C9A84C" }}>
                                  {tag.name}
                                </span>{" "}
                                du cabinet ?
                              </p>
                              <div className="flex gap-2 flex-shrink-0">
                                <button
                                  onClick={() => setConfirmDeleteTagId(null)}
                                  className="px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-widest uppercase border transition-colors"
                                  style={{
                                    fontFamily: "Georgia, serif",
                                    color: "var(--muted)",
                                    borderColor: "var(--border)",
                                    background: "var(--card)",
                                  }}
                                >
                                  Annuler
                                </button>
                                <button
                                  onClick={async () => {
                                    await deleteTag(tag.id);
                                    setConfirmDeleteTagId(null);
                                  }}
                                  className="px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-widest uppercase transition-colors"
                                  style={{
                                    fontFamily: "Georgia, serif",
                                    color: "#fff",
                                    background: "rgba(185,28,28,0.8)",
                                  }}
                                >
                                  Retirer
                                </button>
                              </div>
                            </>
                          ) : isEditing ? (
                            <>
                              <div className="flex-1 flex flex-col gap-2">
                                <input
                                  autoFocus
                                  value={editingTagName}
                                  onChange={(e) =>
                                    setEditingTagName(e.target.value)
                                  }
                                  onKeyDown={async (e) => {
                                    if (e.key === "Enter") {
                                      await updateTag(tag.id, {
                                        name: editingTagName.trim() || tag.name,
                                        color: editingTagColor,
                                      });
                                      setEditingTagId(null);
                                    }
                                    if (e.key === "Escape")
                                      setEditingTagId(null);
                                  }}
                                  className="bg-transparent text-sm focus:outline-none border-b pb-1"
                                  style={{
                                    color: "var(--foreground)",
                                    fontFamily: "Georgia, serif",
                                    borderColor: "rgba(201,168,76,0.4)",
                                  }}
                                />

                                <div className="flex gap-1.5 flex-wrap">
                                  {TAG_COLORS.map((c) => (
                                    <button
                                      key={c.name}
                                      type="button"
                                      onClick={async () => {
                                        await updateTag(tag.id, {
                                          name:
                                            editingTagName.trim() || tag.name,
                                          color: c.name,
                                        });
                                        setEditingTagId(null);
                                      }}
                                      className={`w-5 h-5 rounded-full transition-all ${c.dot} ${editingTagColor === c.name ? "ring-2 ring-offset-1 ring-[#C9A84C] scale-110" : "opacity-70 hover:opacity-100"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <button
                                onClick={() => setEditingTagId(null)}
                                className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg transition-colors"
                                style={{ color: "var(--muted)" }}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="flex items-center gap-3 flex-1 text-left"
                                onClick={() => {
                                  setEditingTagId(tag.id);
                                  setEditingTagName(tag.name);
                                  setEditingTagColor(tag.color);
                                }}
                              >
                                <Badge color={tag.color}>{tag.name}</Badge>
                                <span
                                  className="text-[9px] text-[var(--muted)] tracking-widest uppercase"
                                  style={{ fontFamily: "Georgia, serif" }}
                                >
                                  {count} pièce{count !== 1 ? "s" : ""}
                                </span>
                              </button>
                              <button
                                onClick={() => setConfirmDeleteTagId(tag.id)}
                                className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-lg text-[#D4B896] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              style={{
                transformOrigin: "left center",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
              initial={{ rotateY: 90, opacity: 0.6, scale: 0.98 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: -90, opacity: 0.6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="space-y-4">
                <SectionHeading label="Collectionneur" />
                <div
                  className="rounded-xl p-6 border text-center relative overflow-hidden"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                    boxShadow: "inset 0 1px 0 rgba(201,168,76,0.2)",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{
                      background:
                        "linear-gradient(90deg, #A07835, #C9A84C, #E8C46A, #C9A84C, #A07835)",
                    }}
                  />
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-3 border border-[#C9A84C]/30"
                    style={{ background: "rgba(201,168,76,0.1)" }}
                  >
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="avatar"
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                    ) : (
                      <User className="w-7 h-7 text-[#C9A84C]" />
                    )}
                  </div>
                  <h3
                    className="font-bold text-[#2C1810] dark:text-[#F5EDD8]"
                    style={{
                      fontFamily: "var(--font-crimson, Georgia, serif)",
                      fontSize: "1.1rem",
                    }}
                  >
                    {user?.displayName || "Collectionneur"}
                  </h3>
                  <p className="text-xs text-[var(--muted)]">{user?.email}</p>
                </div>

                <div
                  className="rounded-xl border overflow-hidden"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                    boxShadow: "inset 0 1px 0 rgba(201,168,76,0.1)",
                  }}
                >
                  <div
                    className="grid grid-cols-3 divide-x"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {[
                      { value: entries.length, label: "Total" },
                      {
                        value: specimenCount,
                        label: "Artefacts",
                        color: "#7C3AED",
                      },
                      {
                        value: enigmeCount,
                        label: "Mystères",
                        color: "#2563EB",
                      },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="p-4 text-center border-[#D4B896] dark:border-[#3A2810]"
                      >
                        <p
                          className="text-2xl font-bold"
                          style={{
                            fontFamily: "var(--font-crimson, Georgia, serif)",
                            color: stat.color || "var(--foreground)",
                          }}
                        >
                          <AnimatedCounter to={stat.value} />
                        </p>
                        <p
                          className="text-[9px] text-[var(--muted)] mt-0.5 tracking-widest uppercase"
                          style={{ fontFamily: "Georgia, serif" }}
                        >
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rank card */}
                <div
                  className="rounded-xl p-4 border relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, rgba(${rank.level >= 3 ? "91,33,182" : "44,24,16"},0.08), rgba(201,168,76,0.05))`,
                    borderColor: `rgba(201,168,76,${0.2 + rank.level * 0.1})`,
                    boxShadow:
                      rank.level >= 2
                        ? `inset 0 1px 0 rgba(201,168,76,0.2), 0 0 ${rank.level * 6}px rgba(201,168,76,0.08)`
                        : "inset 0 1px 0 rgba(201,168,76,0.1)",
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] shimmer-gold opacity-60" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-[8px] font-bold tracking-[0.2em] uppercase mb-1"
                        style={{
                          color: "var(--muted)",
                          fontFamily: "Georgia, serif",
                        }}
                      >
                        Rang du collectionneur
                      </p>
                      <p
                        className="font-bold text-sm"
                        style={{
                          fontFamily: "var(--font-crimson, Georgia, serif)",
                          color:
                            rank.level >= 2 ? "#C9A84C" : "var(--foreground)",
                        }}
                      >
                        {rank.title}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((l) => (
                          <div
                            key={l}
                            className="w-2 h-2 rounded-full"
                            style={{
                              background:
                                l <= rank.level
                                  ? "#C9A84C"
                                  : "rgba(201,168,76,0.15)",
                              boxShadow:
                                l <= rank.level && rank.level >= 4
                                  ? "0 0 4px rgba(201,168,76,0.6)"
                                  : "none",
                            }}
                          />
                        ))}
                      </div>
                      <p
                        className="text-[8px] tracking-widest uppercase"
                        style={{
                          color: "var(--muted)",
                          fontFamily: "Georgia, serif",
                        }}
                      >
                        {rank.level < 5
                          ? `${entries.length} pièce${entries.length !== 1 ? "s" : ""}`
                          : "Cabinet complet"}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs text-red-700 dark:text-red-400 transition-colors border tracking-widest uppercase"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                    fontFamily: "Georgia, serif",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(185,28,28,0.06)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "var(--card)")
                  }
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Quitter le cabinet
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FAB */}
      {(activeTab === "home" || activeTab === "search") && (
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setShowForm(true)}
          className="fab-pulse w-14 h-14 rounded-xl shadow-xl flex items-center justify-center text-[#F5EDD8] border"
          style={{
            position: "fixed",
            bottom: 500,
            left: -20,
            zIndex: 40,
            ...(filterType === "question"
              ? {
                  background: "linear-gradient(135deg,#0F172A,#1E3A8A)",
                  borderColor: "#2563EB",
                  boxShadow: "0 4px 20px rgba(30,58,138,0.4)",
                }
              : {
                  background: "linear-gradient(135deg,#2E1065,#5B21B6)",
                  borderColor: "#7C3AED",
                  boxShadow: "0 4px 20px rgba(91,33,182,0.4)",
                }),
          }}
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      )}

      <BookFlipEffect trigger={flipTrigger} />
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      <AnimatePresence>
        {showForm && (
          <EntryForm
            onClose={closeForm}
            tags={tags}
            editEntry={editEntry}
            defaultType={filterType !== "all" ? filterType : "word"}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AnimatedCounter({ to }: { to: number }) {
  const [display, setDisplay] = useState(0);
  const obj = useRef({ val: 0 });

  useGSAP(
    () => {
      gsap.to(obj.current, {
        val: to,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: () => setDisplay(Math.round(obj.current.val)),
      });
    },
    { dependencies: [to], revertOnUpdate: true },
  );

  return <>{display}</>;
}

function EmptyState({
  onAdd,
  filterType,
}: {
  onAdd: () => void;
  filterType: string;
}) {
  const isQuestion = filterType === "question";
  const isFiltered = filterType !== "all";

  const emptySlots = [
    {
      w: 13,
      h: 54,
      bg: "rgba(91,33,182,0.08)",
      border: "rgba(124,58,237,0.2)",
      delay: 0,
    },
    {
      w: 10,
      h: 43,
      bg: "rgba(30,58,138,0.08)",
      border: "rgba(37,99,235,0.2)",
      delay: 0.05,
    },
    {
      w: 15,
      h: 62,
      bg: "rgba(91,33,182,0.06)",
      border: "rgba(124,58,237,0.15)",
      delay: 0.1,
    },
    {
      w: 11,
      h: 47,
      bg: "rgba(201,168,76,0.06)",
      border: "rgba(201,168,76,0.18)",
      delay: 0.15,
    },
    {
      w: 14,
      h: 58,
      bg: "rgba(30,58,138,0.07)",
      border: "rgba(37,99,235,0.15)",
      delay: 0.2,
    },
    {
      w: 10,
      h: 39,
      bg: "rgba(91,33,182,0.05)",
      border: "rgba(124,58,237,0.12)",
      delay: 0.25,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-10"
    >
      {/* Ghost vitrine — étagère vide avec silhouettes */}
      <div className="mb-8 relative">
        {/* Étagère */}
        <div className="flex items-end justify-center gap-[3px] px-8">
          {emptySlots.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: s.delay,
                duration: 0.4,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              style={{
                width: s.w,
                height: s.h,
                background: s.bg,
                border: `1px dashed ${s.border}`,
                borderRadius: "2px 2px 0 0",
                flexShrink: 0,
              }}
            />
          ))}
        </div>
        {/* Planche */}
        <div
          style={{
            height: 5,
            background:
              "linear-gradient(180deg, rgba(201,168,76,0.2), rgba(201,168,76,0.08))",
            margin: "0 24px",
            borderRadius: "0 0 3px 3px",
          }}
        />
        {/* Ombre */}
        <div
          style={{
            height: 2,
            background: "rgba(44,24,16,0.06)",
            margin: "0 40px",
            filter: "blur(2px)",
          }}
        />

        {/* Label centré sur étagère */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ paddingBottom: 8 }}
        >
          <p
            className="text-[8px] tracking-[0.35em] uppercase"
            style={{
              color: "rgba(201,168,76,0.4)",
              fontFamily: "Georgia, serif",
            }}
          >
            En attente de pièces
          </p>
        </div>
      </div>

      {/* Texte */}
      <div className="text-center px-4">
        <div className="gold-divider-ornate mb-5 mx-8" />
        <h3
          className="font-bold text-[#2C1810] dark:text-[#F5EDD8] mb-2"
          style={{
            fontFamily: "var(--font-crimson, Georgia, serif)",
            fontSize: "1.25rem",
          }}
        >
          {isFiltered
            ? isQuestion
              ? "Aucun mystère catalogué"
              : "Aucun artefact épinglé"
            : "Ton cabinet t'attend"}
        </h3>
        <p
          className="text-xs text-[var(--muted)] max-w-[200px] mx-auto mb-7 leading-relaxed italic"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {isFiltered
            ? "Cette section est encore vide."
            : "Chaque chose apprise mérite une place dans ta collection."}
        </p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onAdd}
          className="inline-flex items-center gap-2 text-[#F5EDD8] px-7 py-3.5 rounded-xl text-xs font-bold border tracking-widest uppercase"
          style={
            isQuestion
              ? {
                  background: "linear-gradient(135deg, #0F172A, #1E3A8A)",
                  borderColor: "#2563EB",
                  boxShadow: "0 4px 16px rgba(30,58,138,0.4)",
                }
              : {
                  background: "linear-gradient(135deg, #2E1065, #5B21B6)",
                  borderColor: "#7C3AED",
                  boxShadow: "0 4px 16px rgba(91,33,182,0.4)",
                }
          }
        >
          <Plus className="w-3.5 h-3.5" />
          {isQuestion ? "Cataloguer un mystère" : "Épingler un artefact"}
        </motion.button>
      </div>
    </motion.div>
  );
}
