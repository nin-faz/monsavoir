"use client";

import { LayoutGrid, Search, Tag, User } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "home",    icon: LayoutGrid, label: "Cabinet"  },
  { id: "search",  icon: Search,     label: "Archives" },
  { id: "tags",    icon: Tag,        label: "Familles" },
  { id: "profile", icon: User,       label: "Profil"   },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      <div className="absolute top-0 left-0 right-0 h-[2px] shimmer-gold" />

      <div className="flex items-center max-w-lg mx-auto px-1 pt-2 pb-2">
        {tabs.map(({ id, icon: Icon, label }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 min-h-[52px] justify-center relative nav-tab ${active ? "nav-tab--active" : ""}`}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.25 : 1.5}
                color={active ? "var(--nav-icon-active)" : "var(--nav-icon-inactive)"}
                className="nav-tab-icon"
              />
              <span
                className="text-[11px] font-bold tracking-[0.1em] uppercase transition-colors duration-200 font-georgia"
                style={{ color: active ? "var(--nav-label-active)" : "var(--nav-icon-inactive)" }}
              >
                {label}
              </span>
              {active && (
                <span className="animate-ink absolute bottom-[1px] text-[7px] leading-none text-[var(--nav-label-active)]">
                  ✦
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
