"use client";

import { SquaresFour, MagnifyingGlass, Tag, User } from "@phosphor-icons/react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "home",    icon: SquaresFour,      label: "Cabinet"  },
  { id: "search",  icon: MagnifyingGlass,  label: "Archives" },
  { id: "tags",    icon: Tag,              label: "Familles" },
  { id: "profile", icon: User,             label: "Profil"   },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        background: "linear-gradient(180deg, rgba(18,3,42,0.97), rgba(30,8,66,0.99))",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(201,168,76,0.25)",
        boxShadow: "0 -8px 32px rgba(91,33,182,0.2), 0 -1px 0 rgba(201,168,76,0.15)",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] shimmer-gold" />

      <div className="flex items-center max-w-lg mx-auto px-1 pt-2 pb-2">
        {tabs.map(({ id, icon: Icon, label }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="flex-1 flex flex-col items-center gap-0.5 py-1.5 min-h-[52px] justify-center relative"
              style={{
                background: active
                  ? "linear-gradient(135deg, rgba(91,33,182,0.22), rgba(201,168,76,0.08))"
                  : "transparent",
                borderRadius: 12,
                border: active ? "1px solid rgba(201,168,76,0.22)" : "1px solid transparent",
                transition: "background 0.2s, border-color 0.2s",
              }}
            >
              <Icon
                size={22}
                weight={active ? "fill" : "thin"}
                color={active ? "#E8C46A" : "rgba(201,168,76,0.35)"}
                style={{ transition: "color 0.2s" }}
              />
              <span
                className="text-[9px] font-bold tracking-[0.1em] uppercase transition-colors duration-200"
                style={{
                  color: active ? "#C9A84C" : "rgba(201,168,76,0.3)",
                  fontFamily: "Georgia, serif",
                }}
              >
                {label}
              </span>
              {active && (
                <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#C9A84C", position: "absolute", bottom: 3 }} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
