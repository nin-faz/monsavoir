"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

interface BookDiveTransitionProps {
  onDone: () => void;
}

/**
 * Full-screen "dive into the magic book" transition played once right after
 * a successful sign-in/sign-up. Mounted at the root (see TransitionContext),
 * not inside the auth page, so it survives the router.push to /dashboard
 * instead of being unmounted mid-fade.
 *
 * The clip itself ends on a violet/gold portal (not a plain cut), but a raw
 * opacity fade of the frozen last frame still reads as abrupt — there's
 * nothing actually *dissolving*. Instead: a violet mist blooms in, the video
 * pushes forward and blurs (still diving, not stopping), then everything
 * dissolves into the dashboard underneath as one continuous motion.
 */
export function BookDiveTransition({ onDone }: BookDiveTransitionProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mistRef = useRef<HTMLDivElement>(null);
  const firedRef = useRef(false);

  const finish = () => {
    if (firedRef.current) return;
    firedRef.current = true;
    router.push("/dashboard");

    gsap
      .timeline({ onComplete: onDone })
      .to(mistRef.current, { opacity: 0.9, duration: 0.22, ease: "power1.out" }, 0)
      .to(
        videoRef.current,
        { scale: 1.18, filter: "blur(10px)", duration: 0.55, ease: "power2.in" },
        0,
      )
      .to(containerRef.current, { opacity: 0, duration: 0.4, ease: "power2.inOut" }, 0.25);
  };

  // Start the dissolve a touch before the clip's natural end so the mist and
  // the fade are already underway while the portal is still on screen,
  // instead of freezing on the last frame first and only then reacting.
  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    if (v.currentTime / v.duration > 0.82) finish();
  };

  useEffect(() => {
    // Safety net: never trap the user behind the transition if the video
    // stalls (slow network, decode error, etc.) — the clip is ~2.1s.
    const fallback = setTimeout(finish, 3500);
    return () => clearTimeout(fallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] bg-black" aria-hidden="true">
      <video
        ref={videoRef}
        src="/transition.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={finish}
        onError={finish}
        className="w-full h-full object-cover"
      />
      {/* Violet mist blooming outward as the portal closes — guarantees the
          "dissolving into violet vapor" feeling regardless of the exact
          frame the clip happens to land on. */}
      <div
        ref={mistRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0,
          background:
            "radial-gradient(circle at center, rgba(147,51,234,0.55) 0%, rgba(76,29,149,0.45) 35%, rgba(10,8,18,0.92) 75%)",
        }}
      />
    </div>
  );
}
