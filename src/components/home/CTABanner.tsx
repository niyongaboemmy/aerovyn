"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Zap,
  Clock,
  Shield,
  Volume2,
  VolumeX,
  Send,
} from "lucide-react";
import { useGSAP } from "@/hooks/useGSAP";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: Clock, label: "24", suffix: "h", sub: "Mission scoped" },
  { icon: Zap, label: "10", suffix: "×", sub: "Faster delivery" },
  { icon: Shield, label: "100", suffix: "%", sub: "Safety record" },
];

function Counter({
  target,
  suffix,
  go,
}: {
  target: number;
  suffix: string;
  go: boolean;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const obj = useRef({ val: 0 });
  useEffect(() => {
    if (!go || !spanRef.current) return;
    gsap.to(obj.current, {
      val: target,
      duration: 1.8,
      ease: "power2.out",
      onUpdate: () => {
        if (spanRef.current)
          spanRef.current.textContent = Math.round(obj.current.val) + suffix;
      },
    });
  }, [go, target, suffix]);
  return <span ref={spanRef}>0{suffix}</span>;
}

/* Animated ring that pulses around a button */
function PulseRing() {
  const ringRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const tween = gsap.to(ringRef.current, {
      scale: 1.55,
      opacity: 0,
      duration: 1.4,
      ease: "power1.out",
      repeat: -1,
      repeatDelay: 0.6,
    });
    return () => {
      tween.kill();
    };
  }, []);
  return (
    <span
      ref={ringRef}
      className="pointer-events-none absolute inset-0 rounded-xl"
      style={{
        border: "2px solid rgba(0,245,196,0.5)",
        transformOrigin: "center",
      }}
    />
  );
}

export function CTABanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [go, setGo] = useState(false);

  /* Horizontal scan line across video */
  useEffect(() => {
    const loop = gsap.fromTo(
      scanRef.current,
      { top: "0%", opacity: 0.7 },
      {
        top: "100%",
        opacity: 0,
        duration: 4,
        ease: "none",
        repeat: -1,
        repeatDelay: 2,
      },
    );
    return () => {
      loop.kill();
    };
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        onEnter: () => setGo(true),
      },
    });

    /* Video reveal */
    tl.from(".cta-video-bg", {
      opacity: 0,
      scale: 1.06,
      duration: 1.1,
      ease: "power2.out",
    });

    /* Overlay dark fade-in */
    tl.from(
      ".cta-overlay",
      { opacity: 0, duration: 0.5, ease: "power2.out" },
      "<0.2",
    );

    /* Badge drop */
    tl.from(
      ".cta-badge",
      { opacity: 0, y: -14, duration: 0.45, ease: "back.out(2)" },
      "<0.3",
    );

    /* Heading words */
    tl.from(
      ".cta-word",
      {
        opacity: 0,
        y: 40,
        rotationX: -25,
        stagger: 0.06,
        duration: 0.6,
        ease: "back.out(1.4)",
      },
      "<0.15",
    );

    /* Sub text */
    tl.from(
      ".cta-sub",
      { opacity: 0, y: 16, duration: 0.5, ease: "power2.out" },
      "<0.2",
    );

    /* Buttons */
    tl.from(
      ".cta-btn-wrap",
      {
        opacity: 0,
        y: 22,
        scale: 0.95,
        stagger: 0.12,
        duration: 0.55,
        ease: "back.out(1.6)",
      },
      "<0.1",
    );

    /* Divider line */
    tl.fromTo(
      ".cta-divider",
      { scaleX: 0 },
      { scaleX: 1, duration: 0.6, ease: "power3.out" },
      "<0.2",
    );

    /* Stats */
    tl.from(
      ".cta-stat",
      {
        opacity: 0,
        y: 18,
        stagger: 0.1,
        duration: 0.45,
        ease: "power2.out",
      },
      "<0.1",
    );

    /* HUD corners */
    tl.from(
      ".cta-corner",
      {
        opacity: 0,
        scale: 0.6,
        stagger: 0.06,
        duration: 0.4,
        ease: "back.out(2)",
      },
      "<-0.3",
    );
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden">
      <div className="relative overflow-hidden" style={{ minHeight: 520 }}>
        {/* ── Full-bleed video background ── */}
        <video
          ref={videoRef}
          src="/videos/drone-operations.webm"
          autoPlay
          loop
          muted
          playsInline
          className="cta-video-bg absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark gradient overlay */}
        <div
          className="cta-overlay absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(5,20,18,0.82) 0%, rgba(5,20,18,0.74) 50%, rgba(5,20,18,0.88) 100%)",
          }}
        />

        {/* Dot grid on top of overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(0,245,196,0.09) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Horizontal scan line */}
        <div
          ref={scanRef}
          className="pointer-events-none absolute left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #00F5C4 25%, #00F5C4 75%, transparent 100%)",
            filter: "blur(1.5px)",
          }}
        />

        {/* Outer border */}
        <div className="pointer-events-none absolute inset-0" />

        {/* Top glow line */}
        <div
          className="absolute left-0 right-0 top-0 h-[2px] rounded-t-3xl"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #00F5C4 35%, #00b8a9 65%, transparent 100%)",
          }}
        />

        {/* HUD corner brackets */}
        {[
          "top-4 left-4 border-l-2 border-t-2",
          "top-4 right-4 border-r-2 border-t-2",
          "bottom-4 left-4 border-b-2 border-l-2",
          "bottom-4 right-4 border-b-2 border-r-2",
        ].map((cls, i) => (
          <div
            key={i}
            className={`cta-corner pointer-events-none absolute h-9 w-9 rounded-sm ${cls}`}
            style={{ borderColor: "rgba(0,245,196,0.45)" }}
          />
        ))}

        {/* Mute button — top right */}
        <button
          onClick={() => {
            const next = !muted;
            setMuted(next);
            if (videoRef.current) videoRef.current.muted = next;
          }}
          className="absolute right-12 top-6 z-30 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[rgba(0,245,196,0.15)]"
          style={{
            border: "1px solid rgba(0,245,196,0.3)",
            background: "rgba(0,0,0,0.4)",
          }}
          aria-label="Toggle mute"
        >
          {muted ? (
            <VolumeX size={13} color="#00F5C4" />
          ) : (
            <Volume2 size={13} color="#00F5C4" />
          )}
        </button>

        {/* ── Content (centered) ── */}
        <div className="relative z-20 flex flex-col items-center px-6 py-16 text-center sm:px-10 sm:py-20 lg:py-24">
          {/* Badge */}
          <div className="cta-badge mb-7">
            <span
              className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-widest"
              style={{
                background: "rgba(0,245,196,0.09)",
                border: "1px solid rgba(0,245,196,0.28)",
                color: "#00F5C4",
                fontFamily: "var(--font-orbitron)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00F5C4]" />
              Free consultation · 24 h response
            </span>
          </div>

          {/* Heading */}
          <h2
            className="max-w-3xl text-[clamp(2.4rem,6vw,4rem)] font-black leading-[1.04] tracking-tight"
            style={{ fontFamily: "var(--font-orbitron)", perspective: "700px" }}
          >
            {["Ready", "to", "Elevate"].map((w) => (
              <span
                key={w}
                className="cta-word mr-[0.22em] inline-block text-white"
              >
                {w}
              </span>
            ))}
            <br />
            {["Your", "Operations?"].map((w) => (
              <span
                key={w}
                className="cta-word mr-[0.22em] inline-block"
                style={{
                  background:
                    "linear-gradient(90deg, #00F5C4 0%, #00d4b0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {w}
              </span>
            ))}
          </h2>

          {/* Sub */}
          <p className="cta-sub mt-5 max-w-xl text-base leading-relaxed text-[#8fa8a2]">
            We&apos;ll scope your mission, propose a deployment plan, and
            deliver measurable results — all within 24 hours of your first
            message.
          </p>

          {/* ── CTA Buttons ── always visible, centered ── */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {/* Primary */}
            <div className="cta-btn-wrap relative">
              <PulseRing />
              <Link
                href="/contact"
                className="group relative flex items-center gap-2.5 overflow-hidden rounded-xl px-8 py-4 text-sm font-bold text-[#0A0B0D] transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,245,196,0.45)]"
                style={{
                  background:
                    "linear-gradient(135deg, #00F5C4 0%, #00c9a7 100%)",
                  fontFamily: "var(--font-orbitron)",
                }}
              >
                {/* Shimmer sweep */}
                <span className="absolute inset-0 -translate-x-full skew-x-[-15deg] bg-white/25 transition-transform duration-500 group-hover:translate-x-full" />
                <Send size={15} />
                Request Free Consultation
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* Secondary */}
            <div className="cta-btn-wrap relative">
              <Link
                href="/training"
                className="group flex items-center gap-2.5 rounded-xl px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:border-[rgba(0,245,196,0.5)] hover:bg-[rgba(0,245,196,0.07)] hover:text-[#00F5C4]"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  backdropFilter: "blur(10px)",
                }}
              >
                Enroll in Training
                <ArrowRight
                  size={15}
                  className="opacity-45 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                />
              </Link>
            </div>
          </div>

          {/* Divider */}
          <div
            className="cta-divider mt-14 h-px w-full max-w-lg origin-center"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(0,245,196,0.25), transparent)",
            }}
          />

          {/* Stats row */}
          <div className="mt-8 flex flex-wrap justify-center gap-10">
            {stats.map(({ icon: Icon, label, suffix, sub }) => (
              <div
                key={label}
                className="cta-stat flex flex-col items-center gap-1.5"
              >
                <div
                  className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background: "rgba(0,245,196,0.08)",
                    border: "1px solid rgba(0,245,196,0.18)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Icon size={16} color="#00F5C4" />
                </div>
                <p
                  className="text-2xl font-black text-white"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  <Counter target={Number(label)} suffix={suffix} go={go} />
                </p>
                <p className="text-xs text-[#6B7A8D]">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
