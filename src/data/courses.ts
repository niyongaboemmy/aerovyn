export type Course = {
  level: string
  levelColor: string
  title: string
  duration: string
  image: string
  summary: string
  features: string[]
  prereq: string
  modules: string[]
  outcomes: string[]
}

export const courses: Course[] = [
  {
    level: 'BEGINNER',
    levelColor: '#00D68F',
    title: 'Drone Fundamentals & Safety Certification',
    duration: '3 Days Intensive',
    image: '/images/training/beginner.jpg',
    summary: 'The complete foundation course for aspiring drone pilots. Covers theory, airspace law, safety protocols, and hands-on flight practice.',
    features: [
      'Hands-on Flight Training',
      'Safety & Regulatory Briefing',
      'Certificate Issued',
      'No prior experience required',
    ],
    prereq: 'None',
    modules: [
      'UAV systems & components overview',
      'Rwanda CAA regulations & air law',
      'Pre-flight planning & weather assessment',
      'Hands-on flight training (10+ hours)',
      'Emergency procedures & risk management',
      'Post-flight documentation & logging',
    ],
    outcomes: ['RCAA Theory Exam preparation', 'AEROVYN Beginner Certificate', 'Eligibility for Tier 1 permit'],
  },
  {
    level: 'INTERMEDIATE',
    levelColor: '#FFB800',
    title: 'Advanced Piloting & Aerial Operations',
    duration: '5 Days',
    image: '/images/training/intermediate.jpg',
    summary: 'Takes competent pilots into professional commercial territory — night operations, complex airspace, and real-world mission workflows.',
    features: [
      'Night Flying Techniques',
      'Commercial License Pathway',
      'Mapping & Survey Methods',
      'Basic drone maintenance',
    ],
    prereq: 'Beginner Course or equivalent',
    modules: [
      'Night flying techniques & lighting setup',
      'Commercial licence pathway (KCAA/RCAA)',
      'Aerial mapping & photogrammetry basics',
      'Survey mission planning in DJI Pilot 2',
      'Basic drone maintenance & troubleshooting',
      'Client briefing & deliverable standards',
    ],
    outcomes: ['Commercial Pilot Certificate', 'RCAA Tier 2 permit eligibility', 'Mapping & survey competency badge'],
  },
  {
    level: 'ADVANCED',
    levelColor: '#00F5C4',
    title: 'Professional UAV Pilot Certification',
    duration: '2 Weeks',
    image: '/images/training/advanced.jpg',
    summary: 'The professional-grade programme leading to RCAA Remote Pilot Licence and industrial operational competency across multiple mission types.',
    features: [
      'Regulatory Compliance (RURA)',
      'Industrial & Precision Ops',
      'Career Support & Networking',
      'Enterprise project exposure',
    ],
    prereq: 'Intermediate Course',
    modules: [
      'RCAA Remote Pilot Licence (RPL) exam prep',
      'BVLOS concepts & safety case principles',
      'Industrial inspections: towers, rooftops, pipelines',
      'Agricultural NDVI survey operations',
      'Safety Management System (SMS) documentation',
      'Career pathways, networking & job placement',
    ],
    outcomes: ['RCAA Remote Pilot Licence (RPL)', 'Industrial operations certificate', 'Career support + alumni network access'],
  },
  {
    level: 'CORPORATE',
    levelColor: '#C400F5',
    title: 'Custom Corporate Training Programme',
    duration: 'Tailored (2–10 days)',
    image: '/images/training/corporate.jpg',
    summary: 'Bespoke training designed around your organisation\'s existing equipment, operational requirements, and regulatory obligations.',
    features: [
      'Needs assessment & skills gap analysis',
      'Custom curriculum design',
      'On-site or at-facility delivery',
      'Equipment-specific flight training',
    ],
    prereq: 'Assessed per team',
    modules: [
      'Needs assessment & skills gap analysis',
      'Custom curriculum design',
      'On-site or at-facility delivery',
      'Equipment-specific flight training',
      'Safety management systems integration',
      'Team certification & ongoing support',
    ],
    outcomes: ['Organisation-specific certification', 'SOPs & safety documentation', 'Ongoing support retainer available'],
  },
]
