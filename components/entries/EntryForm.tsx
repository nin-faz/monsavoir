"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Plus, Image as ImageIcon, BookOpen, HelpCircle, Link, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Entry, EntryType, Tag, TAG_COLORS } from "@/types";
import { createEntry, updateEntry, createTag } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

const MAX_IMAGE_WIDTH = 1600;
const JPEG_QUALITY = 0.82;

/**
 * Redimensionne et compresse une image côté client (via canvas) avant upload,
 * pour éviter d'envoyer des photos brutes de plusieurs Mo (HEIC/haute résolution
 * mobile) sur des connexions lentes. Retourne le fichier original si la
 * compression échoue ou n'apporte aucun gain.
 */
async function compressImage(
  file: File,
  maxWidth = MAX_IMAGE_WIDTH,
  quality = JPEG_QUALITY
): Promise<File> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, maxWidth / img.width);
      const width = Math.round(img.width * scale) || img.width;
      const height = Math.round(img.height * scale) || img.height;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const compressedFile = new File(
            [blob],
            file.name.replace(/\.\w+$/, "") + ".jpg",
            { type: "image/jpeg" }
          );
          resolve(compressedFile.size < file.size ? compressedFile : file);
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      // Certains navigateurs (hors Safari) ne savent pas décoder le HEIC via <img>/canvas.
      // On rejette pour que l'appelant conserve le fichier original sans casser le flux.
      reject(new Error("Impossible de décoder l'image pour compression"));
    };

    img.src = objectUrl;
  });
}

interface EntryFormProps {
  onClose: () => void;
  tags: Tag[];
  editEntry?: Entry | null;
  defaultType?: EntryType;
}

export function EntryForm({ onClose, tags, editEntry, defaultType }: EntryFormProps) {
  const { user } = useAuth();
  const [type, setType] = useState<EntryType>(editEntry?.type || defaultType || "word");
  const [title, setTitle] = useState(editEntry?.title || "");
  const [content, setContent] = useState(editEntry?.content || "");
  const [examples, setExamples] = useState<string[]>(editEntry?.examples || [""]);
  const [source, setSource] = useState(editEntry?.source || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(editEntry?.tags || []);
  const [imageUrl, setImageUrl] = useState(editEntry?.imageUrl || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(editEntry?.imageUrl || "");
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("violet");
  const [showTagForm, setShowTagForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const isQuestion = type === "question";

  const handleImageFile = (file: File) => {
    const looksLikeImage =
      file.type.startsWith("image/") || /\.(heic|heif)$/i.test(file.name);
    if (!looksLikeImage) return;

    // Preview instantané avec le fichier original (le temps que la compression tourne).
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setImageFile(file);

    // Compression/redimensionnement en tâche de fond : au moment du submit,
    // l'upload part déjà avec un fichier léger (~200-400 Ko au lieu de plusieurs Mo).
    compressImage(file)
      .then((compressed) => {
        setImageFile(compressed);
        setImagePreview((prev) => {
          if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
          return URL.createObjectURL(compressed);
        });
      })
      .catch(() => {
        // Compression impossible (ex: format non décodable par le navigateur) :
        // on garde le fichier original, le flux existant n'est pas cassé.
      });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  }, []);

  const toggleTag = (tagId: string) => setSelectedTags((prev) => prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]);
  const addExample = () => setExamples([...examples, ""]);
  const updateExample = (i: number, val: string) => { const u = [...examples]; u[i] = val; setExamples(u); };
  const removeExample = (i: number) => setExamples(examples.filter((_, idx) => idx !== i));

  const handleCreateTag = async () => {
    if (!newTagName.trim() || !user) return;
    await createTag(user.uid, { name: newTagName.trim(), color: newTagColor });
    setNewTagName("");
    setShowTagForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !content.trim()) return;
    setLoading(true);
    setError("");
    try {
      let finalImageUrl = imageUrl;
      if (imageFile) {
        const storageRef = ref(storage, `users/${user.uid}/images/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      }
      const cleanExamples = examples.filter((e) => e.trim());
      const base = {
        type, title: title.trim(), content: content.trim(), examples: cleanExamples, tags: selectedTags,
        ...(source.trim() ? { source: source.trim() } : {}),
        ...(finalImageUrl ? { imageUrl: finalImageUrl } : {}),
      };
      if (editEntry) await updateEntry(editEntry.id, base);
      else await createEntry(user.uid, base);
      setSuccess(true);
      setTimeout(onClose, 900);
    } catch (err) {
      console.error(err);
      setError("Impossible d'enregistrer cette pièce. Vérifie ta connexion et réessaie.");
    } finally { setLoading(false); }
  };

  const accentColor = isQuestion ? "#1E3A8A" : "#4C1D95";
  const headerTitle = editEntry
    ? "Modifier la pièce"
    : isQuestion ? "Consigner un Mystère" : "Épingler un Artefact";
  const submitLabel = editEntry
    ? "Enregistrer"
    : isQuestion ? "✦ Inscrire au Registre" : "✦ Épingler au Cabinet";

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal forceMount>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(44,24,16,0.65)", backdropFilter: "blur(4px)" }}
          />
        </Dialog.Overlay>
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
          <Dialog.Content asChild onOpenAutoFocus={(e) => { e.preventDefault(); titleInputRef.current?.focus(); }}>
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="pointer-events-auto w-full sm:max-w-lg rounded-t-2xl sm:rounded-xl shadow-2xl max-h-[90dvh] overflow-y-auto relative outline-none"
              style={{
                background: "var(--card)",
                border: `1px solid ${isQuestion ? "rgba(37,99,235,0.3)" : "rgba(124,58,237,0.3)"}`,
                boxShadow: `0 -4px 40px ${isQuestion ? "rgba(30,58,138,0.3)" : "rgba(91,33,182,0.3)"}, inset 0 1px 0 rgba(201,168,76,0.25)`,
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
            >
        {/* Gold top stripe */}
        <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl sm:rounded-t-xl"
          style={{ background: "linear-gradient(90deg, #A07835, #C9A84C, #E8C46A, #C9A84C, #A07835)" }} />

        {/* Handle */}
        <div className="flex justify-center pt-4 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full" style={{ background: "var(--border)" }} />
        </div>

        <div className="p-5 pb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <Dialog.Title asChild>
                <h2 className="font-bold text-[var(--foreground)]"
                  style={{ fontFamily: "var(--font-crimson, Georgia, serif)", fontSize: "1.2rem" }}>
                  {headerTitle}
                </h2>
              </Dialog.Title>
              <Dialog.Description asChild>
                <p className="text-[9px] text-[var(--muted)] tracking-[0.15em] uppercase mt-0.5" style={{ fontFamily: "Georgia, serif" }}>
                  MonSavoir · Le Cabinet
                </p>
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors text-[var(--muted)]"
                onMouseEnter={e => e.currentTarget.style.background = "rgba(201,168,76,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="gold-divider mb-4" />

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type toggle */}
            <div className="flex rounded-lg p-1 gap-1" style={{ background: "rgba(44,24,16,0.06)" }}>
              <button type="button" onClick={() => setType("word")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-md transition-all duration-200 tracking-widest uppercase"
                style={type === "word"
                  ? { background: "linear-gradient(135deg, #2E1065, #5B21B6)", color: "#F5EDD8", boxShadow: "0 2px 8px rgba(91,33,182,0.4)" }
                  : { color: "var(--muted)" }
                }>
                <BookOpen className="w-3.5 h-3.5" />
                Artefact
              </button>
              <button type="button" onClick={() => setType("question")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-md transition-all duration-200 tracking-widest uppercase"
                style={type === "question"
                  ? { background: "linear-gradient(135deg, #0F172A, #1E3A8A)", color: "#F5EDD8", boxShadow: "0 2px 8px rgba(30,58,138,0.4)" }
                  : { color: "var(--muted)" }
                }>
                <HelpCircle className="w-3.5 h-3.5" />
                Mystère
              </button>
            </div>

            {/* Title */}
            <div>
              <label className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-[0.15em] mb-1.5 block" style={{ fontFamily: "Georgia, serif" }}>
                {isQuestion ? "La question" : "Terme ou concept"}
              </label>
              <Input ref={titleInputRef} placeholder={isQuestion ? "Formule ta question..." : "Mot, concept, idée..."} value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            {/* Content */}
            <div>
              <label className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-[0.15em] mb-1.5 block" style={{ fontFamily: "Georgia, serif" }}>
                {isQuestion ? "Réponse & explication" : "Définition"}
              </label>
              <Textarea
                placeholder={isQuestion ? "Ce que tu en sais..." : "La définition..."}
                value={content} onChange={(e) => setContent(e.target.value)} required className="min-h-[120px]"
              />
            </div>

            {/* Examples */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-[0.15em] block" style={{ fontFamily: "Georgia, serif" }}>
                Exemples
              </label>
              {examples.map((ex, i) => (
                <div key={i} className="flex gap-2">
                  <Input placeholder={`Exemple ${i + 1}...`} value={ex} onChange={(e) => updateExample(i, e.target.value)} className="flex-1" />
                  {examples.length > 1 && (
                    <button type="button" onClick={() => removeExample(i)}
                      className="w-11 h-11 flex items-center justify-center rounded-lg text-[var(--muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addExample}
                className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase transition-colors"
                style={{ color: "var(--gold-ink)", fontFamily: "Georgia, serif" }}>
                <Plus className="w-3 h-3" />
                Ajouter un exemple
              </button>
            </div>

            {/* Source */}
            {isQuestion && (
              <div>
                <label className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-[0.15em] mb-1.5 block" style={{ fontFamily: "Georgia, serif" }}>Source</label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
                  <Input placeholder="URL optionnelle..." value={source} onChange={(e) => setSource(e.target.value)} className="pl-9" />
                </div>
              </div>
            )}

            {/* Image */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-[0.15em] block" style={{ fontFamily: "Georgia, serif" }}>Illustration</label>
              {imagePreview ? (
                <div className="relative rounded-lg overflow-hidden">
                  <img src={imagePreview} alt="preview" className="w-full h-40 object-cover" />
                  <button type="button"
                    aria-label="Supprimer l'illustration"
                    onClick={() => { setImagePreview(""); setImageFile(null); setImageUrl(""); }}
                    className="absolute top-2 right-2 w-11 h-11 bg-[#2C1810]/60 rounded-md flex items-center justify-center text-[#F5EDD8] hover:bg-[#2C1810]/80">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div onDrop={handleDrop} onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200"
                  style={{
                    borderColor: dragOver ? "#C9A84C" : "var(--border)",
                    background: dragOver ? "rgba(201,168,76,0.05)" : "transparent",
                  }}>
                  <ImageIcon className="w-7 h-7 mx-auto mb-2" style={{ color: "var(--border)" }} />
                  <p className="text-xs text-[var(--muted)]" style={{ fontFamily: "Georgia, serif" }}>
                    Glisse ou <span style={{ color: "var(--gold-ink)" }}>clique</span>
                  </p>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])} />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-[0.15em] block" style={{ fontFamily: "Georgia, serif" }}>Classifications</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)}
                    className={`transition-all duration-150 ${selectedTags.includes(tag.id) ? "opacity-100 scale-100" : "opacity-40 scale-95"}`}>
                    <Badge color={tag.color}>{tag.name}</Badge>
                  </button>
                ))}
                <button type="button" onClick={() => setShowTagForm(!showTagForm)}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-[9px] font-bold border border-dashed tracking-widest uppercase transition-colors"
                  style={{ borderColor: "#D4B896", color: "var(--muted)", fontFamily: "Georgia, serif" }}>
                  <Plus className="w-2.5 h-2.5" />
                  Nouvelle famille
                </button>
              </div>
              <AnimatePresence>
                {showTagForm && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                    <Input placeholder="Nom de la classification..." value={newTagName} onChange={(e) => setNewTagName(e.target.value)} />
                    <div className="flex gap-2 flex-wrap">
                      {TAG_COLORS.map((c) => (
                        <button key={c.name} type="button" onClick={() => setNewTagColor(c.name)}
                          className={`w-8 h-8 rounded-md transition-all ${c.dot} ${newTagColor === c.name ? "ring-2 ring-offset-2 ring-[#C9A84C] scale-110" : ""}`} />
                      ))}
                    </div>
                    <Button type="button" size="sm" onClick={handleCreateTag} variant="outline">Créer la classification</Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs font-medium text-red-600 dark:text-red-400" role="alert">
                {error}
              </p>
            )}

            {/* Submit */}
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full h-11 rounded-lg flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase"
                  style={{
                    background: isQuestion ? "linear-gradient(135deg, #065F46, #059669)" : "linear-gradient(135deg, #4C1D95, #7C3AED)",
                    color: "#F5EDD8",
                    fontFamily: "Georgia, serif",
                    boxShadow: isQuestion ? "0 0 24px rgba(5,150,105,0.5)" : "0 0 24px rgba(124,58,237,0.5)",
                  }}
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.4, 1] }}
                    transition={{ duration: 0.4, times: [0, 0.6, 1] }}
                  >✦</motion.span>
                  {isQuestion ? "Mystère inscrit" : "Artefact épinglé"}
                </motion.div>
              ) : (
                <motion.button
                  key="submit"
                  type="submit"
                  disabled={loading || !title.trim() || !content.trim()}
                  whileTap={{ scale: 0.97 }}
                  className="w-full h-11 rounded-lg text-xs font-bold tracking-widest uppercase text-[#F5EDD8] border transition-all disabled:opacity-50"
                  style={{
                    background: isQuestion ? "linear-gradient(135deg, #0F172A, #1E3A8A)" : "linear-gradient(135deg, #2E1065, #5B21B6)",
                    borderColor: isQuestion ? "#2563EB" : "#7C3AED",
                    boxShadow: isQuestion ? "0 2px 12px rgba(30,58,138,0.4)" : "0 2px 12px rgba(91,33,182,0.4)",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#F5EDD8] border-t-transparent rounded-full animate-spin" />
                      {isQuestion ? "Inscription..." : "Épinglage..."}
                    </span>
                  ) : submitLabel}
                </motion.button>
              )}
            </AnimatePresence>
          </form>
        </div>
            </motion.div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
