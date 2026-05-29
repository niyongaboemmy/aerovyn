"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Award,
  ChevronDown,
  Users,
  Shield,
  Cpu,
  ArrowRight,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { courses } from "@/data/courses";

const instructors = [
  // {
  //   initials: 'JT',
  //   name: 'Jean Claude Tuyisenge',
  //   role: 'Founder & Managing Director',
  //   exp: 'Aviation innovator and founder of AEROVYN. Expert in drone operations, embedded systems, and African education technology.',
  //   accent: '#00F5C4',
  // },
  // {
  //   initials: 'PG',
  //   name: 'Pierre Gatama',
  //   role: 'Co-Founder & Director',
  //   exp: 'Co-founder of AEROVYN, bringing strategic leadership and operational expertise to our training and expansion programmes.',
  //   accent: '#4D7CF5',
  // },
  {
    initials: "OT",
    name: "AEROVYN Operations Team",
    role: "Certified Field Instructors",
    exp: "Our certified pilot instructors hold RCAA and DJI authorizations with hands-on field experience across Rwanda and East Africa.",
    accent: "#F5C400",
  },
];

const certifications = [
  {
    icon: Shield,
    label: "RCAA Accredited",
    desc: "Rwanda Civil Aviation Authority approved",
  },
  {
    icon: Award,
    label: "KCAA Recognised",
    desc: "Kenya CAA cross-border endorsement",
  },
  {
    icon: Cpu,
    label: "DJI Authorised",
    desc: "Official DJI training partner, East Africa",
  },
  {
    icon: Users,
    label: "500+ Graduates",
    desc: "Alumni across 10 African countries",
  },
];

function CourseRow({
  course,
  expanded,
  onToggle,
}: {
  course: (typeof courses)[0];
  expanded: boolean;
  onToggle: () => void;
}) {
  const {
    level,
    levelColor,
    title,
    duration,
    image,
    summary,
    features,
    modules,
    outcomes,
    prereq,
  } = course;

  return (
    <div
      className="overflow-hidden rounded-2xl transition-all duration-300"
      style={{
        background: "#111318",
        border: `1px solid ${expanded ? levelColor + "40" : levelColor + "18"}`,
        boxShadow: expanded ? `0 0 40px ${levelColor}10` : "none",
      }}
    >
      {/* Collapsed header — always visible */}
      <button
        className="group w-full text-left"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <div className="flex items-stretch gap-0">
          {/* Thumbnail */}
          <div
            className="relative hidden h-auto w-48 shrink-0 overflow-hidden sm:block"
            style={{ minHeight: "120px" }}
          >
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="192px"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, transparent 60%, #111318 100%)`,
              }}
            />
          </div>

          {/* Header content */}
          <div className="flex flex-1 items-center justify-between gap-4 px-6 py-6">
            <div className="flex-grow">
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <span
                  className="rounded px-3 py-1 text-[10px] font-black tracking-widest"
                  style={{
                    background: `${levelColor}15`,
                    color: levelColor,
                    border: `1px solid ${levelColor}35`,
                    fontFamily: "var(--font-orbitron)",
                  }}
                >
                  {level}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-[#6B7A8D]">
                  <Clock size={11} /> {duration}
                </span>
              </div>
              <h3
                className="text-base font-bold leading-snug text-white sm:text-lg"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                {title}
              </h3>
              <p className="mt-1.5 line-clamp-1 text-sm text-[#6B7A8D]">
                {summary}
              </p>
            </div>
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300"
              style={{
                background: expanded
                  ? `${levelColor}20`
                  : "rgba(255,255,255,0.04)",
                border: `1px solid ${expanded ? levelColor + "50" : "rgba(255,255,255,0.08)"}`,
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <ChevronDown
                size={16}
                style={{ color: expanded ? levelColor : "#6B7A8D" }}
              />
            </div>
          </div>
        </div>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="border-t" style={{ borderColor: `${levelColor}18` }}>
          {/* Full-width image banner */}
          <div className="relative h-56 w-full overflow-hidden sm:h-72">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, #111318 0%, rgba(17,19,24,0.4) 50%, transparent 100%)",
              }}
            />
            <div className="absolute bottom-6 left-6">
              <p className="text-sm text-[#C4CDD8] max-w-xl leading-relaxed">
                {summary}
              </p>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 gap-8 px-6 py-8 md:grid-cols-3">
            {/* Features */}
            <div>
              <p
                className="mb-4 text-[10px] font-bold uppercase tracking-widest"
                style={{
                  color: levelColor,
                  fontFamily: "var(--font-orbitron)",
                }}
              >
                What You'll Learn
              </p>
              <ul className="space-y-2.5">
                {features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm text-[#C4CDD8]"
                  >
                    <CheckCircle2
                      size={13}
                      className="mt-0.5 shrink-0"
                      style={{ color: levelColor }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Modules */}
            <div>
              <p
                className="mb-4 text-[10px] font-bold uppercase tracking-widest"
                style={{
                  color: levelColor,
                  fontFamily: "var(--font-orbitron)",
                }}
              >
                Curriculum
              </p>
              <ul className="space-y-2.5">
                {modules.map((m) => (
                  <li
                    key={m}
                    className="flex items-start gap-2.5 text-sm text-[#8A9BAE]"
                  >
                    <ArrowRight
                      size={12}
                      className="mt-0.5 shrink-0"
                      style={{ color: levelColor + "aa" }}
                    />
                    {m}
                  </li>
                ))}
              </ul>
            </div>

            {/* Outcomes + CTA */}
            <div className="flex flex-col">
              <p
                className="mb-4 text-[10px] font-bold uppercase tracking-widest"
                style={{
                  color: levelColor,
                  fontFamily: "var(--font-orbitron)",
                }}
              >
                Outcomes
              </p>
              <ul className="mb-6 space-y-2.5">
                {outcomes.map((o) => (
                  <li
                    key={o}
                    className="flex items-start gap-2.5 text-sm text-[#C4CDD8]"
                  >
                    <Award
                      size={13}
                      className="mt-0.5 shrink-0"
                      style={{ color: levelColor }}
                    />
                    {o}
                  </li>
                ))}
              </ul>
              <p className="mb-5 mt-auto text-xs text-[#6B7A8D]">
                Prerequisites: <span className="text-[#8A9BAE]">{prereq}</span>
              </p>
              <Link
                href="/contact"
                className="flex items-center justify-between rounded-xl px-5 py-3.5 text-sm font-semibold transition-all duration-300"
                style={{
                  background: `${levelColor}12`,
                  border: `1px solid ${levelColor}35`,
                  color: levelColor,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    `${levelColor}22`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    `${levelColor}12`;
                }}
              >
                <span className="flex items-center gap-2">
                  <Award size={15} /> Enroll Now
                </span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrainingPage() {
  const [expanded, setExpanded] = useState<number | null>(0);
  const toggle = (i: number) => setExpanded((prev) => (prev === i ? null : i));

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <PageHero
        label="Training Programs"
        title="TRAINING"
        description="From zero experience to RCAA Remote Pilot Licence — structured programmes taught by working professionals on real commercial equipment."
        image="/images/training/intermediate.jpg"
      >
        <div className="flex flex-wrap gap-3">
          {certifications.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-full px-4 py-2"
              style={{
                background: "rgba(0,245,196,0.06)",
                border: "1px solid rgba(0,245,196,0.18)",
              }}
            >
              <Icon size={13} className="text-[#00F5C4]" />
              <span
                className="text-xs font-semibold text-white"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </PageHero>

      {/* ── Course list ────────────────────────────────────────────── */}
      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p
            className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Our Programmes
          </p>
          <h2
            className="mb-10 text-2xl font-black tracking-wide text-white sm:text-3xl sm:mb-12"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            COURSE CATALOGUE
          </h2>
          <div className="space-y-4">
            {courses.map((course, i) => (
              <CourseRow
                key={course.level}
                course={course}
                expanded={expanded === i}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Instructors ────────────────────────────────────────────── */}
      <section
        className="px-4 py-14 sm:px-6 sm:py-16 lg:py-20"
        style={{ background: "var(--bg-surface)" }}
      >
        <div className="mx-auto max-w-7xl">
          <p
            className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Who Teaches
          </p>
          <h2
            className="mb-10 text-2xl font-black tracking-wide text-white sm:text-3xl sm:mb-12"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            INSTRUCTORS
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
            {instructors.map(({ initials, name, role, exp, accent }) => (
              <div
                key={name}
                className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "var(--bg-elevated)",
                  border: `1px solid ${accent}18`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    `${accent}40`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    `${accent}18`;
                }}
              >
                {/* Accent glow top-right */}
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10 blur-2xl"
                  style={{ background: accent }}
                />

                <div className="mb-4 flex items-center gap-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-base font-black"
                    style={{
                      background: `${accent}18`,
                      color: accent,
                      fontFamily: "var(--font-orbitron)",
                      border: `1px solid ${accent}30`,
                    }}
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="font-bold text-white leading-tight">{name}</p>
                    <p className="text-xs mt-0.5" style={{ color: accent }}>
                      {role}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-[#6B7A8D]">{exp}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-16">
        <Image
          src="/images/training/advanced.jpg"
          alt="Start training"
          fill
          className="object-cover"
          style={{ opacity: 0.1 }}
          sizes="100vw"
        />
        <div
          className="relative mx-auto max-w-7xl rounded-2xl px-6 py-12 text-center sm:px-12 sm:py-16"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,245,196,0.08) 0%, rgba(0,245,196,0.03) 100%)",
            border: "1px solid rgba(0,245,196,0.2)",
          }}
        >
          <p
            className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Next Cohort Open
          </p>
          <h2
            className="mb-4 text-3xl font-black tracking-wide text-white sm:text-4xl"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            START YOUR JOURNEY TODAY
          </h2>
          <p className="mx-auto mb-10 max-w-md text-sm leading-relaxed text-[#6B7A8D] sm:text-base">
            Secure your spot before it fills. Contact us to discuss the right
            programme for your goals.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="w-full rounded-xl px-8 py-3.5 text-sm font-bold text-[#0A0B0D] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,245,196,0.4)] sm:w-auto"
              style={{
                background: "#00F5C4",
                fontFamily: "var(--font-orbitron)",
              }}
            >
              Enroll Now →
            </Link>
            <Link
              href="/contact"
              className="w-full rounded-xl border px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-[#00F5C4] hover:text-[#00F5C4] sm:w-auto"
              style={{ borderColor: "rgba(255,255,255,0.15)" }}
            >
              Request Group Booking
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
