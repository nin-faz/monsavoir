"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { BookOpen, HelpCircle, MoreVertical, Trash2, Pencil, ChevronDown } from "lucide-react";
import { Entry, Tag } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDateRelative, haptic } from "@/lib/utils";
import { deleteEntry } from "@/lib/firestore";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface EntryCardProps {
  entry: Entry;
  tags: Tag[];
  onEdit: (entry: Entry) => void;
  index?: number;
}

export function EntryCard({ entry, tags, onEdit, index }: EntryCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const entryTags = tags.filter((t) => entry.tags.includes(t.id));
  const isQuestion = entry.type === "question";
  const specimenNum = String((index ?? 0) + 1).padStart(3, "0");

  const accentColor = isQuestion ? "#2563EB" : "#7C3AED";

  const hasExtra = entry.content.length > 80 || (entry.examples && entry.examples.length > 0) || !!entry.source;

  const ageDays = (Date.now() - entry.createdAt.getTime()) / (1000 * 60 * 60 * 24);
  const agingOpacity = Math.min(ageDays / 365, 1) * 0.35;

  const revealRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!revealRef.current) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set(revealRef.current, { opacity: 1, y: 0 });
        return;
      }
      gsap.set(revealRef.current, { opacity: 0, y: 28 });
      gsap.to(revealRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: Math.min((index ?? 0) * 0.05, 0.3),
        ease: "power2.out",
        scrollTrigger: {
          trigger: revealRef.current,
          start: "top 92%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: revealRef },
  );

  return (
    <div ref={revealRef}>
    <motion.div
      whileHover={{ y: -4, rotateX: -3, transition: { type: "spring", stiffness: 400, damping: 20 } }}
      className={`relative rounded-xl overflow-visible flex flex-col glass-card entry-card ${isQuestion ? "entry-card--mystere" : "entry-card--artefact"}`}
    >
      {/* Gold top stripe */}
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl shimmer-gold" />

      {/* Header band */}
      <div className={`relative w-full h-[76px] overflow-hidden flex-shrink-0 mt-[3px] ${isQuestion ? "enigme-header" : "specimen-header"}`}>
        <div className="absolute inset-0 pointer-events-none entry-card-header-tint" />
        {agingOpacity > 0.02 && (
          <div
            className="absolute inset-0 pointer-events-none entry-card-aging"
            title={`Pièce ancienne du cabinet (${Math.floor(ageDays)} jours)`}
            style={{ opacity: agingOpacity }}
          />
        )}
        {entry.imageUrl && <img src={entry.imageUrl} alt={entry.title} className="w-full h-full object-cover opacity-40 mix-blend-overlay" />}
        <div className="absolute top-2 left-2.5">
          <span className="text-[8px] font-bold text-white/40 tracking-[0.2em] uppercase font-georgia">N° {specimenNum}</span>
        </div>
        <div className="absolute bottom-2 left-2.5 flex items-center gap-1.5">
          <div className="w-6 h-6 bg-white/15 rounded-md flex items-center justify-center border border-white/20">
            {isQuestion ? <HelpCircle className="w-3 h-3 text-white" /> : <BookOpen className="w-3 h-3 text-white" />}
          </div>
          <span className="text-[9px] font-bold text-white/60 tracking-widest uppercase">
            {isQuestion ? "Mystère" : "Artefact"}
          </span>
        </div>
        <div className="absolute top-1 right-1">
          <DropdownMenu.Root
            open={menuOpen}
            onOpenChange={(open) => { setMenuOpen(open); if (!open) setConfirmDelete(false); }}
          >
            <DropdownMenu.Trigger asChild>
              <button aria-label="Options" className="w-7 h-7 flex items-center justify-center rounded-md bg-black/20 text-white hover:bg-black/35 border border-white/15 transition-colors">
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={4}
                className="dropdown-content z-20 rounded-xl shadow-2xl py-1 min-w-[175px] glass-card outline-none"
              >
                {confirmDelete ? (
                  <div className="px-4 py-3 flex flex-col gap-2">
                    <p className="text-[10px] leading-snug font-georgia text-[var(--foreground)]">
                      Retirer cette pièce du cabinet ?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="flex-1 py-1.5 rounded-lg text-[9px] font-bold tracking-widest uppercase border border-[var(--border)] bg-transparent text-[var(--muted)] transition-colors font-georgia"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={async () => { haptic(20); await deleteEntry(entry.id); setMenuOpen(false); }}
                        className="flex-1 py-1.5 rounded-lg text-[9px] font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-1.5 font-georgia wax-seal-btn"
                      >
                        <span className="text-[9px] opacity-85">✦</span>
                        Retirer
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <DropdownMenu.Item
                      onSelect={() => onEdit(entry)}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-xs hover:bg-[rgba(201,168,76,0.08)] transition-colors outline-none cursor-pointer text-[var(--foreground)] font-georgia"
                    >
                      <Pencil className="w-3.5 h-3.5 text-[var(--gold-ink)]" /> Modifier
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onSelect={(e) => { e.preventDefault(); setConfirmDelete(true); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-red-600 dark:text-red-400 hover:bg-[rgba(185,28,28,0.06)] transition-colors outline-none cursor-pointer font-georgia"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Supprimer
                    </DropdownMenu.Item>
                  </>
                )}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      {/* Main content */}
      <div className="p-3 flex flex-col gap-2 overflow-hidden">
        <div>
          <h3 className="font-bold leading-snug line-clamp-2 text-[0.9rem] text-[var(--foreground)] [font-family:var(--font-crimson,Georgia,serif)]">
            {entry.title}
          </h3>
          <p className="text-[9px] mt-0.5 tracking-widest uppercase text-[var(--text-subtle)]">{formatDateRelative(entry.createdAt)}</p>
        </div>

        <div className="gold-divider" />

        <p className="text-xs leading-relaxed italic break-words line-clamp-2 text-[0.8rem] text-[var(--text-body)] [font-family:var(--font-crimson,Georgia,serif)]">
          {entry.content}
        </p>

        {entryTags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1 border-t border-[rgba(212,184,150,0.3)]">
            {entryTags.map((tag) => <Badge key={tag.id} color={tag.color} className="text-[8px]">{tag.name}</Badge>)}
          </div>
        )}
      </div>

      {/* DRAWER HANDLE — always visible if has content */}
      {hasExtra && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={`flex items-center justify-center gap-1 w-full py-1.5 transition-colors entry-drawer-handle ${
            expanded ? (isQuestion ? "entry-drawer-handle--open-mystere" : "entry-drawer-handle--open-artefact") : ""
          }`}
        >
          <span className="text-[8px] font-bold tracking-[0.18em] uppercase font-georgia" style={{ color: expanded ? accentColor : "var(--gold-ink)" }}>
            {expanded ? "Fermer" : "Ouvrir"}
          </span>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-3 h-3" style={{ color: expanded ? accentColor : "var(--gold-ink)" }} />
          </motion.div>
        </button>
      )}

      {/* DRAWER (Artefact) — mécanique, linéaire, froid */}
      {!isQuestion && (
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 1 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 1 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.6, 1] }}
              className="overflow-hidden entry-drawer-artefact"
            >
              <div className="p-3 flex flex-col gap-2 entry-drawer-artefact-body">
                <p className="text-xs leading-relaxed italic break-words text-[0.8rem] text-[var(--text-body)] [font-family:var(--font-crimson,Georgia,serif)]">{entry.content}</p>
                {entry.examples && entry.examples.length > 0 && (
                  <div className="space-y-1 mt-1">
                    {entry.examples.map((ex, i) => (
                      <p key={i} className="text-[11px] pl-2.5 border-l-2 italic break-words text-[var(--text-body)] border-l-[rgba(91,33,182,0.5)] [font-family:var(--font-crimson,Georgia,serif)]">{ex}</p>
                    ))}
                  </div>
                )}
                {entry.source && <a href={entry.source} target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold tracking-widest uppercase hover:underline text-[var(--gold-ink)]">Source →</a>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* PARCHEMIN (Mystère) — vivant, rebond, chaud */}
      {isQuestion && (
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, scaleY: 0.85, opacity: 0.6, originY: 0 }}
              animate={{ height: "auto", scaleY: 1, opacity: 1 }}
              exit={{ height: 0, scaleY: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22, mass: 0.8 }}
              className="overflow-hidden entry-drawer-mystere"
            >
              {/* Parchment top curl hint */}
              <div className="entry-drawer-mystere-curl" />
              <div className="px-3 pb-3 pt-1 flex flex-col gap-2">
                <p className="text-xs leading-relaxed italic break-words text-[0.8rem] text-[var(--text-body)] [font-family:var(--font-crimson,Georgia,serif)]">{entry.content}</p>
                {entry.examples && entry.examples.length > 0 && (
                  <div className="space-y-1 mt-1">
                    {entry.examples.map((ex, i) => (
                      <p key={i} className="text-[11px] pl-2.5 border-l-2 italic break-words text-[var(--text-body)] border-l-[rgba(37,99,235,0.5)] [font-family:var(--font-crimson,Georgia,serif)]">{ex}</p>
                    ))}
                  </div>
                )}
                {entry.source && <a href={entry.source} target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold tracking-widest uppercase hover:underline text-[var(--gold-ink)]">Source →</a>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
    </div>
  );
}
