import Image from "next/image";
import { ReactNode } from "react";

interface PageHeroProps {
  label: string;
  title: string;
  description?: string;
  image?: string;
  imageOpacity?: number;
  children?: ReactNode;
}

export function PageHero({
  label,
  title,
  description,
  image,
  imageOpacity = 0.1,
  children,
}: PageHeroProps) {
  return (
    <div className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20">
      {image && (
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-center"
          style={{ opacity: imageOpacity }}
          sizes="100vw"
          priority
        />
      )}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div
        className="absolute inset-x-0 bottom-0 h-28"
        style={{
          background: "linear-gradient(to top, var(--bg-base), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-0">
        <p
          className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#00F5C4]"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          {label}
        </p>
        <h1
          className="mb-6 text-3xl font-black tracking-widest text-white sm:text-4xl md:text-5xl"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-base leading-relaxed text-[#6B7A8D] sm:text-lg">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
}
