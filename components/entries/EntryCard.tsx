"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, HelpCircle, MoreVertical, Trash2, Pencil, ChevronDown } from "lucide-react";
import { Entry, Tag } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDateRelative } from "@/lib/utils";
import { deleteEntry } from "@/lib/firestore";

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
  const glowColor = isQuestion ? "rgba(37,99,235,0.35)" : "rgba(91,33,182,0.35)";

  const hasExtra = entry.content.length > 80 || (entry.examples && entry.examples.length > 0) || !!entry.source;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: (index ?? 0) * 0.06, ease: [0.34, 1.56, 0.64, 1] }}
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 20 } }}
      className="relative rounded-xl overflow-visible flex flex-col glass-card"
      style={{ boxShadow: `0 2px 16px rgba(44,24,16,0.1), inset 0 1px 0 rgba(201,168,76,0.2)`, transition: "box-shadow 0.25s ease" }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${glowColor}, 0 2px 8px rgba(44,24,16,0.08), inset 0 1px 0 rgba(201,168,76,0.3)`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 2px 16px rgba(44,24,16,0.1), inset 0 1px 0 rgba(201,168,76,0.2)`; }}
    >
      {/* Gold top stripe */}
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl shimmer-gold" />

      {/* Header band */}
      <div className={`relative w-full h-[76px] overflow-hidden flex-shrink-0 mt-[3px] ${isQuestion ? "enigme-header" : "specimen-header"}`}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)" }} />
        {entry.imageUrl && <img src={entry.imageUrl} alt={entry.title} className="w-full h-full object-cover opacity-40 mix-blend-overlay" />}
        <div className="absolute top-2 left-2.5">
          <span className="text-[8px] font-bold text-white/40 tracking-[0.2em] uppercase" style={{ fontFamily: "Georgia, serif" }}>N° {specimenNum}</span>
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
          <button onClick={() => setMenuOpen(!menuOpen)} className="w-7 h-7 flex items-center justify-center rounded-md bg-black/20 text-white hover:bg-black/35 border border-white/15 transition-colors">
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dropdown */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => { setMenuOpen(false); setConfirmDelete(false); }} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="absolute right-2 top-[72px] z-20 rounded-xl shadow-2xl py-1 min-w-[175px] glass-card">
            {confirmDelete ? (
              <div className="px-4 py-3 flex flex-col gap-2">
                <p className="text-[10px] leading-snug" style={{ color: "var(--foreground)", fontFamily: "Georgia, serif" }}>
                  Retirer cette pièce du cabinet ?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 py-1.5 rounded-lg text-[9px] font-bold tracking-widest uppercase border transition-colors"
                    style={{ fontFamily: "Georgia, serif", color: "var(--muted)", borderColor: "var(--border)", background: "transparent" }}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={async () => { await deleteEntry(entry.id); setMenuOpen(false); }}
                    className="flex-1 py-1.5 rounded-lg text-[9px] font-bold tracking-widest uppercase transition-colors"
                    style={{ fontFamily: "Georgia, serif", color: "#fff", background: "rgba(185,28,28,0.8)" }}
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button onClick={() => { onEdit(entry); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-xs hover:bg-[rgba(201,168,76,0.08)] transition-colors" style={{ color: "var(--foreground)", fontFamily: "Georgia, serif" }}>
                  <Pencil className="w-3.5 h-3.5 text-[#C9A84C]" /> Modifier
                </button>
                <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-red-600 dark:text-red-400 hover:bg-[rgba(185,28,28,0.06)] transition-colors" style={{ fontFamily: "Georgia, serif" }}>
                  <Trash2 className="w-3.5 h-3.5" /> Supprimer
                </button>
              </>
            )}
          </motion.div>
        </>
      )}

      {/* Main content */}
      <div className="p-3 flex flex-col gap-2 overflow-hidden">
        <div>
          <h3 className="font-bold leading-snug line-clamp-2" style={{ fontFamily: "var(--font-crimson, Georgia, serif)", fontSize: "0.9rem", color: "var(--foreground)" }}>
            {entry.title}
          </h3>
          <p className="text-[9px] mt-0.5 tracking-widest uppercase" style={{ color: "var(--text-subtle)" }}>{formatDateRelative(entry.createdAt)}</p>
        </div>

        <div className="gold-divider" />

        <p className="text-xs leading-relaxed italic break-words line-clamp-2" style={{ color: "var(--text-body)", fontFamily: "var(--font-crimson, Georgia, serif)", fontSize: "0.8rem" }}>
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
          className="flex items-center justify-center gap-1 w-full py-1.5 transition-colors"
          style={{
            borderTop: `1px solid ${expanded ? `${accentColor}33` : "rgba(212,184,150,0.25)"}`,
            background: expanded
              ? isQuestion ? "rgba(37,99,235,0.06)" : "rgba(91,33,182,0.06)"
              : "rgba(201,168,76,0.03)",
          }}
        >
          <span className="text-[8px] font-bold tracking-[0.18em] uppercase" style={{ color: expanded ? accentColor : "#C9A84C", fontFamily: "Georgia, serif" }}>
            {expanded ? "Fermer" : "Ouvrir"}
          </span>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-3 h-3" style={{ color: expanded ? accentColor : "#C9A84C" }} />
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
              className="overflow-hidden"
              style={{
                borderTop: "3px solid rgba(60,30,8,0.35)",
                boxShadow: "inset 0 4px 8px rgba(44,24,16,0.12)",
              }}
            >
              <div className="p-3 flex flex-col gap-2" style={{ background: "linear-gradient(180deg, rgba(44,24,16,0.06), rgba(44,24,16,0.02))" }}>
                <p className="text-xs leading-relaxed italic break-words" style={{ color: "var(--text-body)", fontFamily: "var(--font-crimson, Georgia, serif)", fontSize: "0.8rem" }}>{entry.content}</p>
                {entry.examples && entry.examples.length > 0 && (
                  <div className="space-y-1 mt-1">
                    {entry.examples.map((ex, i) => (
                      <p key={i} className="text-[11px] pl-2.5 border-l-2 italic break-words" style={{ color: "var(--text-body)", fontFamily: "var(--font-crimson, Georgia, serif)", borderLeftColor: "rgba(91,33,182,0.5)" }}>{ex}</p>
                    ))}
                  </div>
                )}
                {entry.source && <a href={entry.source} target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold tracking-widest uppercase hover:underline" style={{ color: "#C9A84C" }}>Source →</a>}
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
              className="overflow-hidden"
              style={{
                borderTop: "1px solid rgba(201,168,76,0.35)",
                background: "linear-gradient(180deg, rgba(201,120,30,0.08), rgba(201,168,76,0.04))",
              }}
            >
              {/* Parchment top curl hint */}
              <div style={{ height: 3, background: "linear-gradient(180deg, rgba(201,168,76,0.18), transparent)" }} />
              <div className="px-3 pb-3 pt-1 flex flex-col gap-2">
                <p className="text-xs leading-relaxed italic break-words" style={{ color: "var(--text-body)", fontFamily: "var(--font-crimson, Georgia, serif)", fontSize: "0.8rem" }}>{entry.content}</p>
                {entry.examples && entry.examples.length > 0 && (
                  <div className="space-y-1 mt-1">
                    {entry.examples.map((ex, i) => (
                      <p key={i} className="text-[11px] pl-2.5 border-l-2 italic break-words" style={{ color: "var(--text-body)", fontFamily: "var(--font-crimson, Georgia, serif)", borderLeftColor: "rgba(37,99,235,0.5)" }}>{ex}</p>
                    ))}
                  </div>
                )}
                {entry.source && <a href={entry.source} target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold tracking-widest uppercase hover:underline" style={{ color: "#C9A84C" }}>Source →</a>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}
