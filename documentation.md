# AEROVYN — Website Implementation Plan

### Senior UI/UX Design Document · v1.0 · May 2026

---

## 1. Brand Identity Reference

| Token                   | Value                                     |
| ----------------------- | ----------------------------------------- |
| **Primary Brand Color** | `#00F5C4` (Cyan-Mint)                     |
| **Dark Background**     | `#0A0B0D`                                 |
| **Secondary Dark**      | `#111318`                                 |
| **Text Primary**        | `#FFFFFF`                                 |
| **Text Muted**          | `#8A9BAE`                                 |
| **Accent Glow**         | `rgba(0, 245, 196, 0.15)`                 |
| **Logo Mark**           | Drone cross/quad icon (outlined, minimal) |
| **Brand Voice**         | Precision · Innovation · Elevation        |

> **Design Philosophy**: _Dark. Cinematic. Technical._ — Inspired by aerospace HUDs, satellite imagery dashboards, and next-gen aviation tech. The website should feel like the operating system of the future of airspace.

---

## 2. Research Summary

### 2.1 Benchmarked Websites & Trends

Based on research of leading drone company websites (Webflow showcase, Dribbble, Behance, 99Designs) and 2025–2026 UI/UX trend reports, the following patterns define best-in-class drone/tech company websites:

| Trend                                             | Why It Works for AEROVYN                                       |
| ------------------------------------------------- | -------------------------------------------------------------- |
| **Dark mode with neon/cyan accents**              | Matches brand palette; conveys technical authority             |
| **GSAP + ScrollTrigger scroll-linked animations** | Creates cinematic storytelling as user scrolls                 |
| **Parallax depth layers**                         | Gives the illusion of aerial perspective — on-brand for drones |
| **Animated SVG drone paths**                      | Interactive drone flight path traces on load                   |
| **Glassmorphism cards**                           | Modern, tech-forward UI cards for services/courses             |
| **Full-screen hero with video/3D**                | Immediate visual impact — establishes premium positioning      |
| **Scroll-triggered counter reveals**              | Stats (missions flown, students trained) feel alive            |
| **Custom animated cursor**                        | Luxury brand signal; adds interactivity layer                  |
| **Lenis smooth scrolling**                        | Buttery scroll experience favored by top Awwwards sites        |
| **Split-text reveal animations**                  | Headlines animate letter-by-letter for drama                   |

### 2.2 Competitor Landscape

- **DJI** — Product-focused, 3D renders, dark with blue accents
- **Skydio** — Clean white/minimal, cinematic video
- **FlytBase** — SaaS dashboard aesthetic, data-forward
- **DroneBase** — Portfolio-heavy, photography-centric

**AEROVYN's Differentiator**: The only brand combining **drone operations + structured training programs** with an African tech ecosystem positioning. The website must communicate both expertise AND accessibility (trainings for all levels).

---

## 3. Site Architecture

```
aerovyn.com/
├── / (Home)
├── /services
│   ├── /services/drone-projects
│   └── /services/training
├── /training
│   ├── /training/courses
│   └── /training/certification
├── /projects (Portfolio)
├── /about
├── /blog
└── /contact
```

---

## 4. Page-by-Page Design Specification

---

### 4.1 HOME PAGE

#### Section 1 — Hero (Full Viewport)

**Layout**: Full-screen dark background. Animated particle field (representing airspace). Drone SVG icon flying in from top-right with a glowing trail.

**Content**:

```
[Animated drone icon flying across viewport]

AEROVYN

Elevating the Future of Airspace

[Sub-headline]
Professional Drone Projects & Certified Training Programs

[CTAs]
[Explore Services →]    [View Training Courses]
```

**Animations**:

- Page load: GSAP timeline — drone SVG traces a curved flight path across the screen
- Headline: SplitText letter-by-letter reveal (staggered 30ms per character)
- Sub-headline: Fade up with 400ms delay
- CTAs: Scale-in with glow pulse on the primary button
- Background: Subtle animated grid lines (CSS keyframes) + floating particle dots

**Tech Stack for this section**:

```javascript
// GSAP SplitText + Timeline
gsap
  .timeline()
  .from('.drone-svg', {
    x: -200,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
  })
  .from('.headline chars', { opacity: 0, y: 40, stagger: 0.03 }, '-=0.5')
  .from('.cta-group', { opacity: 0, y: 20 }, '-=0.2')
```

---

#### Section 2 — Stats Strip (Scroll-triggered)

**Design**: Dark glass panel spanning full width. 4 animated counters.

```
┌─────────────────────────────────────────────────────┐
│  500+          50+           98%          10+        │
│  Missions      Courses       Success      Countries  │
│  Completed     Available     Rate         Reached    │
└─────────────────────────────────────────────────────┘
```

**Animation**: Numbers count up from 0 when scrolled into view (CountUp.js or GSAP ticker).

---

#### Section 3 — Services Overview

**Layout**: Asymmetric 2-column split. Left: large animated text "WHAT WE DO". Right: two service cards stacked.

**Service Cards** (glassmorphism style):

```
┌──────────────────────────────┐
│  [Drone Icon]                │
│  DRONE PROJECTS              │
│  Aerial mapping, inspections,│
│  surveying, photography &    │
│  custom UAV deployments.     │
│                              │
│  [Explore →]                 │
└──────────────────────────────┘

┌──────────────────────────────┐
│  [Graduation Icon]           │
│  DRONE TRAINING              │
│  Beginner to advanced pilot  │
│  certification programs with │
│  hands-on flight sessions.   │
│                              │
│  [View Courses →]            │
└──────────────────────────────┘
```

**Card style**:

```css
.service-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(0, 245, 196, 0.2);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  transition: border-color 0.3s, box-shadow 0.3s;
}
.service-card:hover {
  border-color: rgba(0, 245, 196, 0.6);
  box-shadow: 0 0 40px rgba(0, 245, 196, 0.1);
}
```

---

#### Section 4 — Featured Projects (Horizontal Scroll)

**Layout**: Pinned section — user scrolls vertically but content moves horizontally (GSAP ScrollTrigger horizontal).

**3 Project Cards** (landscape format):

- Card 1: Aerial Mapping — Infrastructure project
- Card 2: Agricultural Drone Survey
- Card 3: Urban Photography & Videography

**Each card**: Full-bleed background image, overlay gradient, project name + tag pills.

```javascript
// Horizontal scroll with GSAP
gsap.to('.projects-track', {
  x: () => -(projectsTrack.scrollWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: '.projects-section',
    pin: true,
    scrub: 1,
    end: () => '+=' + projectsTrack.scrollWidth,
  },
})
```

---

#### Section 5 — Training Programs Preview

**Layout**: 3-column grid of course cards.

**Course Card**:

```
┌─────────────────────────┐
│  BEGINNER               │
│  ─────────────          │
│  Drone Fundamentals     │
│  & Safety Certification │
│                         │
│  ● 3 Days Intensive     │
│  ● Hands-on Flight      │
│  ● Certificate Issued   │
│                         │
│  [Enroll Now]           │
└─────────────────────────┘
```

**Levels**: Beginner · Intermediate · Advanced/Professional

---

#### Section 6 — Why AEROVYN (Animated Infographic)

**Layout**: Dark section with animated path/line connecting 4 value propositions as scroll progresses.

```
   [Certified Instructors]
          ↓  (animated line draws on scroll)
   [Real Hardware & Simulators]
          ↓
   [Industry-Grade Projects]
          ↓
   [Career Support & Networking]
```

**Animation**: SVG path stroke-dashoffset animation triggered by scroll position.

---

#### Section 7 — Testimonials

**Layout**: Large quote centered. Auto-rotating with fade transition. Client name + avatar below.

---

#### Section 8 — CTA Banner

**Design**: Full-width section. Cyan gradient bar (rare use of brand color as background).

```
Ready to Elevate Your Skills?
Start your drone journey today.

[Get Started →]    [Contact Us]
```

---

#### Section 9 — Footer

**Layout**: 4-column grid.

- Col 1: AEROVYN logo + tagline + social icons
- Col 2: Services links
- Col 3: Training links
- Col 4: Contact info

**Design**: Very dark (`#080A0C`). Subtle top border in brand cyan.

---

### 4.2 SERVICES PAGE — Drone Projects

**Hero**: Cinematic video background (looping drone footage). Dark overlay. Bold headline.

**Sections**:

1. Service categories (Aerial Photography, Mapping, Inspections, Agricultural Surveys, Events)
2. Process timeline (Request → Assessment → Mission Plan → Execution → Delivery)
3. Equipment showcase (drone models used)
4. Case studies (3 featured projects with before/after)
5. Pricing tiers / Request a Quote form

---

### 4.3 TRAINING PAGE

**Hero**: Split screen — left: student learning, right: animated course catalog.

**Sections**:

1. Course grid (filterable by level: Beginner/Advanced/Corporate)
2. Curriculum breakdown (accordion-style expandable)
3. Certification badges (SVG animated reveal)
4. Instructor profiles (team cards with hover flip effect)
5. Training schedule / upcoming sessions calendar
6. Enrollment form with payment options

**Course Card Detail**:

```
┌────────────────────────────────────┐
│  [Level Badge]  [Duration]         │
│                                    │
│  Course Name                       │
│  ──────────────────────────        │
│  Short description                 │
│                                    │
│  What you'll learn:                │
│  ✓ Module 1                        │
│  ✓ Module 2                        │
│  ✓ Module 3                        │
│                                    │
│  Prerequisites: None / Basic       │
│                                    │
│  [Enroll — $XXX]                   │
└────────────────────────────────────┘
```

---

### 4.4 PORTFOLIO PAGE

**Layout**: Masonry grid with category filter (All / Mapping / Photography / Agriculture / Industrial).

**Hover state**: Image darkens, project title + tags slide up, "View Project →" appears.

**Project Detail Modal**: Lightbox-style overlay with:

- Full image gallery (swipeable)
- Project brief
- Technologies used
- Client testimonial

---

### 4.5 ABOUT PAGE

**Sections**:

1. Mission statement (full-width, large typography)
2. Team grid with animated hover cards
3. Timeline of AEROVYN milestones
4. Certifications & Partnerships logos
5. Africa-focused impact section

---

### 4.6 CONTACT PAGE

**Layout**: Left side: contact info + embedded map. Right side: multi-step form.

**Form Steps**:

1. What are you looking for? (Drone Project / Training / Partnership)
2. Details about your request
3. Contact information
4. Confirmation

---

## 5. Technology Stack

| Layer             | Technology                             | Justification                                   |
| ----------------- | -------------------------------------- | ----------------------------------------------- |
| **Framework**     | Next.js 15 (App Router)                | SSR/SSG for SEO, fast performance               |
| **Styling**       | Tailwind CSS + CSS Variables           | Rapid development, consistent design tokens     |
| **Animations**    | GSAP + ScrollTrigger + SplitText       | Industry standard for premium scroll animations |
| **Smooth Scroll** | Lenis.js                               | Buttery scroll physics (Awwwards standard)      |
| **3D/Visual**     | Three.js (hero section particle field) | Depth and immersion                             |
| **Icons**         | Lucide React                           | Clean, consistent SVG icons                     |
| **Forms**         | React Hook Form + Zod                  | Validation, multi-step UX                       |
| **CMS**           | Sanity.io or Contentful                | Non-technical team can update courses/projects  |
| **Hosting**       | Vercel                                 | Auto-deploy, global CDN, Next.js optimized      |
| **Analytics**     | Plausible (privacy-first)              | GDPR compliant, lightweight                     |
| **Email**         | Resend + React Email                   | Transactional emails for enrollments            |

---

## 6. Animation System

### 6.1 Core Animation Principles

- **Entrance**: All elements fade + translate up (Y: 30px → 0, opacity: 0 → 1)
- **Duration**: 600–900ms with `power2.out` easing
- **Stagger**: 80ms between sibling elements
- **Scroll Trigger**: `start: "top 80%"` (element in view at 80% viewport height)

### 6.2 Signature Animations

#### Drone Flight Path (Hero)

```javascript
const dronePath = document.querySelector('.drone-path')
const pathLength = dronePath.getTotalLength()

gsap.set('.drone-path', {
  strokeDasharray: pathLength,
  strokeDashoffset: pathLength,
})

gsap.to('.drone-path', {
  strokeDashoffset: 0,
  duration: 2,
  ease: 'power2.inOut',
  scrollTrigger: { trigger: '.hero', start: 'top top' },
})
```

#### Headline SplitText

```javascript
const split = new SplitText('.hero-headline', { type: 'chars,words' })
gsap.from(split.chars, {
  opacity: 0,
  y: 60,
  rotationX: -90,
  stagger: 0.02,
  duration: 0.8,
  ease: 'back.out(1.5)',
})
```

#### Stats Counter

```javascript
gsap.to('.counter', {
  textContent: (i, el) => el.dataset.target,
  duration: 2,
  ease: 'power1.inOut',
  snap: { textContent: 1 },
  scrollTrigger: { trigger: '.stats-section', start: 'top 80%' },
})
```

#### Horizontal Project Scroll

```javascript
gsap.to('.projects-track', {
  x: () => -(track.scrollWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: '.projects-section',
    pin: true,
    scrub: 1.5,
    end: () => '+=' + track.scrollWidth,
  },
})
```

---

## 7. Responsive Design Strategy

| Breakpoint                | Behavior                                                                    |
| ------------------------- | --------------------------------------------------------------------------- |
| **Mobile** (`< 640px`)    | Single column, simplified animations (reduced motion), larger touch targets |
| **Tablet** (`640–1024px`) | 2-column layouts, retained animations at reduced intensity                  |
| **Desktop** (`> 1024px`)  | Full experience, all animations active                                      |
| **Large** (`> 1440px`)    | Max-width container, enhanced parallax                                      |

**Performance Rule**: All video backgrounds use `<video autoplay muted loop playsinline>` with WebM format. Animations respect `prefers-reduced-motion`.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. SEO & Performance

### SEO

- Next.js `<Metadata>` API for all pages
- Structured data (JSON-LD) for: Organization, Course, LocalBusiness
- Sitemap auto-generated via `next-sitemap`
- OpenGraph images for all key pages
- Target keywords: "drone training [country]", "drone services Africa", "UAV pilot certification", "drone mapping"

### Performance Targets

| Metric                 | Target             |
| ---------------------- | ------------------ |
| Lighthouse Performance | ≥ 90               |
| LCP                    | < 2.5s             |
| CLS                    | < 0.1              |
| FID                    | < 100ms            |
| Bundle Size            | < 200KB initial JS |

### Optimization Techniques

- `next/image` for all images (WebP auto-conversion, lazy load)
- Dynamic imports for Three.js (code-split, loaded only on hero)
- GSAP loaded as module (tree-shakeable)
- Fonts: `next/font` with `display: swap`
- Videos: served via CDN, poster image shown until loaded

---

## 9. Implementation Phases

### Phase 1 — Foundation (Weeks 1–2)

- [ ] Set up Next.js 15 project with Tailwind CSS
- [ ] Configure design tokens (colors, typography, spacing)
- [ ] Build global layout (header, footer, navigation)
- [ ] Implement Lenis smooth scrolling
- [ ] Create reusable animation hooks (useGSAP, useScrollTrigger)
- [ ] Set up CMS (Sanity.io) with schemas for: Projects, Courses, Team

### Phase 2 — Core Pages (Weeks 3–5)

- [ ] Home page — all 9 sections
- [ ] Services page — Drone Projects
- [ ] Training page — Course listings + enrollment
- [ ] About page
- [ ] Contact page with multi-step form

### Phase 3 — Portfolio & Blog (Week 6)

- [ ] Portfolio/Projects page with masonry grid
- [ ] Project detail page (dynamic route)
- [ ] Blog list + single article pages
- [ ] Search functionality

### Phase 4 — Animations & Polish (Week 7)

- [ ] Hero drone flight path animation
- [ ] Horizontal scroll section
- [ ] All ScrollTrigger reveals
- [ ] Hover micro-interactions
- [ ] Custom cursor
- [ ] Page transitions (GSAP Timeline on route change)

### Phase 5 — Optimization & Launch (Week 8)

- [ ] Lighthouse audit and performance fixes
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile/tablet testing on real devices
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] SEO meta tags, sitemap, robots.txt
- [ ] Analytics setup (Plausible)
- [ ] Deploy to Vercel + custom domain
- [ ] Set up staging environment

---

## 10. Design System — Color & Typography

### Color Palette

```css
:root {
  /* Backgrounds */
  --bg-base: #0a0b0d;
  --bg-surface: #111318;
  --bg-elevated: #1a1d24;

  /* Brand */
  --brand-primary: #00f5c4;
  --brand-glow: rgba(0, 245, 196, 0.15);
  --brand-border: rgba(0, 245, 196, 0.25);

  /* Text */
  --text-primary: #ffffff;
  --text-secondary: #c4cdd8;
  --text-muted: #6b7a8d;

  /* Semantic */
  --success: #00d68f;
  --warning: #ffb800;
  --error: #ff4d4f;

  /* Gradients */
  --gradient-brand: linear-gradient(135deg, #00f5c4 0%, #00b8a9 100%);
  --gradient-dark: linear-gradient(180deg, #0a0b0d 0%, #111318 100%);
}
```

### Typography Scale

```css
/* Font Pairing: Display + Body */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap');

:root {
  --font-display: 'Orbitron', sans-serif; /* Headlines, brand name */
  --font-body: 'DM Sans', sans-serif; /* Body, UI text */

  /* Scale */
  --text-xs: 0.75rem; /* 12px */
  --text-sm: 0.875rem; /* 14px */
  --text-base: 1rem; /* 16px */
  --text-lg: 1.125rem; /* 18px */
  --text-xl: 1.25rem; /* 20px */
  --text-2xl: 1.5rem; /* 24px */
  --text-3xl: 1.875rem; /* 30px */
  --text-4xl: 2.25rem; /* 36px */
  --text-5xl: 3rem; /* 48px */
  --text-6xl: 3.75rem; /* 60px */
  --text-7xl: 4.5rem; /* 72px */
}
```

---

## 11. Navigation Design

### Desktop Navbar

```
[AEROVYN Logo]    Services   Training   Projects   About   Blog    [Contact Us]
```

- Sticky with `backdrop-filter: blur(20px)` on scroll
- Underline animate on hover (cyan, slides from left)
- "Contact Us" CTA button with cyan border + glow

### Mobile Navigation

- Hamburger → Full-screen overlay menu
- Menu items animate in with stagger (slide from right)
- Background: `rgba(10, 11, 13, 0.97)` with noise texture

---

## 12. Custom Cursor (Desktop Only)

```javascript
// Dual-layer custom cursor
const cursor = document.querySelector('.cursor-dot')
const follower = document.querySelector('.cursor-follower')

document.addEventListener('mousemove', (e) => {
  gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0 })
  gsap.to(follower, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.4,
    ease: 'power2.out',
  })
})

// Expand on hover over interactive elements
document.querySelectorAll('a, button').forEach((el) => {
  el.addEventListener('mouseenter', () => {
    gsap.to(follower, { scale: 2.5, borderColor: 'var(--brand-primary)' })
  })
  el.addEventListener('mouseleave', () => {
    gsap.to(follower, { scale: 1, borderColor: 'rgba(255,255,255,0.5)' })
  })
})
```

---

## 13. Content Requirements

### Needed from AEROVYN Team

- [ ] High-resolution logo files (SVG + PNG, dark/light variants)
- [ ] Drone footage videos (hero background, at least 2 × 30s clips)
- [ ] Photography: drone hardware, training sessions, projects
- [ ] Course curriculum documents (titles, descriptions, prerequisites, duration, price)
- [ ] Team member photos + bios
- [ ] 3–5 project case studies (description, images, outcomes)
- [ ] Client testimonials (name, role, company, quote, photo)
- [ ] Certifications & partner logos
- [ ] Company story / About Us text
- [ ] Physical address + contact details

---

## 14. Accessibility Checklist

- [ ] Color contrast ratio ≥ 4.5:1 for all text
- [ ] All animations respect `prefers-reduced-motion`
- [ ] Keyboard navigation fully functional (focus visible states)
- [ ] All images have descriptive `alt` text
- [ ] Form inputs have associated `<label>` elements
- [ ] Skip-to-main-content link at top of page
- [ ] ARIA attributes on interactive custom components
- [ ] Screen reader tested (VoiceOver + NVDA)

---

## 15. Estimated Development Resources

| Role               | Hours    | Responsibility                          |
| ------------------ | -------- | --------------------------------------- |
| UI/UX Designer     | 60h      | Figma mockups, design system, assets    |
| Frontend Developer | 120h     | Next.js implementation, animations      |
| CMS / Backend      | 30h      | Sanity setup, API routes, form handling |
| QA / Testing       | 20h      | Cross-browser, mobile, accessibility    |
| SEO Specialist     | 10h      | Meta, structured data, sitemap          |
| **Total**          | **240h** |                                         |

---

## 16. Recommended Template References

The following templates from the Webflow/Awwwards ecosystem closely match the AEROVYN vision and can serve as structural inspiration:

1. **Avox (ThemeForest)** — Dark tech startup, GSAP animations, HUD aesthetic
2. **Raktor Drone Dashboard (Behance)** — Drone-specific UI patterns, dark with cyan
3. **AeroControl (Behance)** — Aviation SaaS design, clean grid, data-forward
4. **Brooklyn (HTML5UP)** — Parallax portfolio structure (open source baseline)

> **Note**: Do not clone any template directly. Use them for structural/animation inspiration while building a fully original AEROVYN-branded experience.

---

_Document prepared by AI Senior UX Design Consultant · AEROVYN Website Project · May 2026_
_Next Step: Translate this plan into Figma wireframes → high-fidelity mockups → development handoff_
