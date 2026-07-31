"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Sphere3D } from "@/components/three/Sphere3D";
import { useTransition } from "@/context/TransitionContext";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const { startDive } = useTransition();

  // Skip the video for users who've asked the OS/browser to reduce motion —
  // straight to the dashboard instead of trapping them behind a fixed clip.
  const goToDashboard = () => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      router.push("/dashboard");
    } else {
      startDive();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (mode === "signin") await signIn(email, password);
      else await signUp(email, password, name);
      goToDashboard();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("user-not-found") || msg.includes("wrong-password") || msg.includes("invalid-credential")) setError("Email ou mot de passe incorrect");
      else if (msg.includes("email-already-in-use")) setError("Cet email est déjà utilisé");
      else if (msg.includes("weak-password")) setError("Mot de passe trop court (6 car. min)");
      else setError("Une erreur est survenue. Réessayez.");
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setError(""); setLoading(true);
    try { await signInWithGoogle(); goToDashboard(); }
    catch { setError("Connexion Google échouée"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: "var(--background)" }}>
      {/* Decorative ruled lines */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "repeating-linear-gradient(180deg, transparent, transparent 31px, rgba(180,140,80,0.08) 31px, rgba(180,140,80,0.08) 32px)" }} />

      <div className="w-full max-w-sm relative">
        {/* Logo / Crest */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="relative mx-auto -mb-2 w-44 h-44">
            <Sphere3D className="w-full h-full" />
          </div>
          <h1 className="text-3xl font-bold text-[#2C1810] dark:text-[#F5EDD8]"
            style={{ fontFamily: "var(--font-crimson, Georgia, serif)", letterSpacing: "0.03em" }}>
            MonSavoir
          </h1>
          <p className="text-[9px] text-[var(--muted)] mt-1.5 tracking-[0.2em] uppercase" style={{ fontFamily: "Georgia, serif" }}>
            Cabinet de Curiosités Intellectuelles
          </p>
          {/* Gold divider */}
          <div className="mt-3 mx-auto w-32 h-px" style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />
        </motion.div>

        {/* Auth card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl p-6 relative overflow-hidden"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            boxShadow: "0 8px 32px rgba(44,24,16,0.15), inset 0 1px 0 rgba(201,168,76,0.2)",
          }}
        >
          {/* Gold top stripe */}
          <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl"
            style={{ background: "linear-gradient(90deg, #A07835, #C9A84C, #E8C46A, #C9A84C, #A07835)" }} />

          {/* Mode toggle */}
          <div className="flex rounded-lg p-1 mb-5" style={{ background: "rgba(44,24,16,0.06)" }}>
            {(["signin", "signup"] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(""); }}
                className="flex-1 py-2 text-xs font-bold rounded-md transition-all duration-200 tracking-widest uppercase cursor-pointer"
                style={{
                  fontFamily: "Georgia, serif",
                  background: mode === m ? "var(--card)" : "transparent",
                  color: mode === m ? "var(--foreground)" : "var(--muted)",
                  boxShadow: mode === m ? "0 1px 4px rgba(44,24,16,0.1), inset 0 1px 0 rgba(201,168,76,0.15)" : "none",
                }}
                onMouseEnter={e => { if (mode !== m) e.currentTarget.style.background = "rgba(201,168,76,0.08)"; }}
                onMouseLeave={e => { if (mode !== m) e.currentTarget.style.background = "transparent"; }}>
                {m === "signin" ? "Connexion" : "Inscription"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <AnimatePresence>
              {mode === "signup" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
                    <Input placeholder="Ton prénom" autoComplete="given-name" value={name} onChange={(e) => setName(e.target.value)} className="pl-9" required={mode === "signup"} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
              <Input type="email" placeholder="Email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
              <Input type="password" placeholder="Mot de passe" autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" required />
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-red-700 dark:text-red-400 text-xs text-center py-2 px-3 rounded-lg border"
                style={{ background: "rgba(185,28,28,0.06)", borderColor: "rgba(185,28,28,0.2)", fontFamily: "Georgia, serif" }}>
                {error}
              </motion.p>
            )}

            <motion.button type="submit" disabled={loading}
              whileHover={loading ? undefined : { scale: 1.02, boxShadow: "0 4px 20px rgba(91,33,182,0.6)" }}
              whileTap={loading ? undefined : { scale: 0.97 }}
              className="w-full h-11 rounded-lg text-xs font-bold tracking-widest uppercase text-[#F5EDD8] border disabled:opacity-50 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #2E1065, #5B21B6)",
                borderColor: "#7C3AED",
                boxShadow: "0 2px 12px rgba(91,33,182,0.4)",
                fontFamily: "Georgia, serif",
              }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#F5EDD8] border-t-transparent rounded-full animate-spin" />
                  Chargement...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {mode === "signin" ? "Ouvrir le cabinet" : "Créer mon cabinet"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              )}
            </motion.button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-[9px] text-[var(--muted)] tracking-widest uppercase" style={{ fontFamily: "Georgia, serif" }}>ou</span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          <button onClick={handleGoogle} disabled={loading}
            className="w-full h-11 rounded-lg text-xs font-bold tracking-wide border flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-default"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
              color: "var(--text-body)",
              fontFamily: "Georgia, serif",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(201,168,76,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--card)"}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </button>
        </motion.div>

        <p className="text-center mt-5 text-[9px] text-[var(--muted)] tracking-[0.2em] uppercase" style={{ fontFamily: "Georgia, serif" }}>
          ✦ Usage personnel & privé ✦
        </p>
      </div>
    </div>
  );
}
