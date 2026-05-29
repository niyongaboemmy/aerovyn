export type Project = {
  slug: string
  title: string
  category: 'Mapping' | 'Photography' | 'Agriculture' | 'Industrial' | 'Events'
  tags: string[]
  summary: string
  description: string
  gradient: string
  accent: string
  image?: string
  client: string
  location: string
  duration: string
  outcome: string
  technologies: string[]
  testimonial?: { quote: string; name: string; role: string }
}

export const projects: Project[] = [
  {
    slug: 'aerial-mapping-rwanda',
    title: 'Aerial Mapping — Infrastructure Corridor',
    category: 'Mapping',
    tags: ['#MAPPING', '#INFRASTRUCTURE', '#SURVEY'],
    summary: 'High-resolution aerial mapping of a 120km infrastructure corridor for a national development authority.',
    description: 'AEROVYN deployed a fleet of fixed-wing and multirotor UAVs to conduct a comprehensive aerial survey of a 120km road and utility corridor across three provinces. Using photogrammetry and LiDAR fusion, we produced 2cm GSD orthomosaics, 3D point clouds, and elevation models delivered within 10 business days — a task that would have taken ground teams over three months.\n\nThe dataset enabled engineers to identify drainage issues, plan utility routing, and produce accurate cost estimates before a single metre of ground was broken.',
    gradient: 'linear-gradient(135deg, #0d2b1a 0%, #051510 50%, #00f5c410 100%)',
    accent: '#00F5C4',
    image: '/images/projects/mapping-infrastructure.jpg',
    client: 'Rwanda Infrastructure Authority',
    location: 'Kigali–Musanze Corridor, Rwanda',
    duration: '8 Days',
    outcome: '120km surveyed. 2cm GSD orthomosaic. 40% cost saving vs. traditional ground survey.',
    technologies: ['DJI Matrice 350 RTK', 'LiDAR L1', 'Agisoft Metashape', 'QGIS', 'AutoCAD Civil 3D'],
    testimonial: {
      quote: 'The precision and turnaround exceeded every expectation. AEROVYN delivered in 8 days what our previous contractor quoted 3 months for.',
      name: 'Eng. Patrick N.',
      role: 'Director of Infrastructure, RIA',
    },
  },
  {
    slug: 'agricultural-survey-bugesera',
    title: 'Crop Health Monitoring — Bugesera District',
    category: 'Agriculture',
    tags: ['#AGRICULTURE', '#NDVI', '#UAV'],
    summary: 'NDVI multispectral survey of 2,400 hectares of rice and maize farmland to identify stress zones and optimise irrigation.',
    description: 'Working with a cooperative of over 800 smallholder farmers in Bugesera District, AEROVYN conducted a multispectral NDVI survey across 2,400 hectares using DJI Agras T40 and Phantom 4 Multispectral drones. The resulting vegetation health maps allowed agronomists to pinpoint irrigation-deficient zones with sub-metre accuracy.\n\nFarmers received field-level PDF reports and georeferenced prescription maps compatible with variable-rate irrigation controllers. Crop yield estimates improved by 18% in the following season based on cooperative records.',
    gradient: 'linear-gradient(135deg, #1a1a0d 0%, #110f05 50%, #f5c40010 100%)',
    accent: '#F5C400',
    image: '/images/projects/agriculture-drone.jpg',
    client: 'Bugesera Farmers Cooperative',
    location: 'Bugesera District, Rwanda',
    duration: '5 Days',
    outcome: '2,400ha mapped. 18% yield improvement. Irrigation waste reduced by 31%.',
    technologies: ['DJI Phantom 4 Multispectral', 'DJI Agras T40', 'Pix4Dfields', 'QGIS', 'ArcGIS'],
    testimonial: {
      quote: 'The NDVI maps showed us exactly where our irrigation was failing. We saved water and increased our harvest — a remarkable result.',
      name: 'Jean-Pierre M.',
      role: 'Chairman, Bugesera Farmers Cooperative',
    },
  },
  {
    slug: 'kigali-urban-photography',
    title: 'Urban Photography — Kigali Skyline Series',
    category: 'Photography',
    tags: ['#PHOTOGRAPHY', '#URBAN', '#REAL-ESTATE'],
    summary: 'Cinematic aerial photography and 4K video production for a flagship real estate development in Kigali City.',
    description: 'AEROVYN was commissioned by a leading Kigali property developer to produce a full cinematic aerial photography and video series for their flagship mixed-use development. Operating under a CAA special flight authorisation, our crew conducted 12 flight missions over 4 days to capture golden-hour stills, twilight long-exposures, and 4K video flyovers from multiple altitudes.\n\nThe final deliverable included 200+ edited stills, a 3-minute hero video, and 15 social-media-ready vertical clips — all colour-graded to a consistent cinematic look.',
    gradient: 'linear-gradient(135deg, #0d1120 0%, #050a18 50%, #4d7cf510 100%)',
    accent: '#4D7CF5',
    image: '/images/projects/kigali-aerial.jpg',
    client: 'Kigali Heights Development Ltd.',
    location: 'Kigali City Centre, Rwanda',
    duration: '4 Days',
    outcome: '200+ edited stills, 3-min hero video, 15 social clips. Used in $40M sales campaign.',
    technologies: ['DJI Inspire 3', 'DJI Mini 4 Pro', 'Adobe Lightroom', 'DaVinci Resolve', 'Adobe Premiere Pro'],
  },
  {
    slug: 'tower-inspection-mtn',
    title: 'Telecom Tower Inspection — National Grid',
    category: 'Industrial',
    tags: ['#INSPECTION', '#INDUSTRIAL', '#TELECOM'],
    summary: 'Structural inspection of 47 telecommunications towers across Rwanda using close-proximity drone inspection protocols.',
    description: 'AEROVYN executed a nationwide inspection programme for a major telecom operator, deploying close-proximity inspection drones to assess the structural integrity of 47 towers across Rwanda. Traditional rope-access inspections are slow, expensive, and hazardous. Our drone solution captured 4K close-up imagery of all structural joints, corrosion points, and antenna mounts without a single worker at height.\n\nDefect reports with GPS-tagged imagery were delivered within 24 hours of each tower inspection, enabling the client to prioritise maintenance budget and schedule remediation works.',
    gradient: 'linear-gradient(135deg, #1a0d0d 0%, #150505 50%, #f54d4d10 100%)',
    accent: '#F54D4D',
    image: '/images/projects/tower-inspection.jpg',
    client: 'Major Telecom Operator (NDA)',
    location: 'Nationwide, Rwanda',
    duration: '3 Weeks',
    outcome: '47 towers inspected. 0 worker incidents. 73% cost saving vs. rope-access method.',
    technologies: ['DJI Matrice 300 RTK', 'Zenmuse H20T', 'DJI Dock 2', 'DJI FlightHub 2'],
  },
  {
    slug: 'lake-kivu-environmental',
    title: 'Environmental Monitoring — Lake Kivu Shoreline',
    category: 'Mapping',
    tags: ['#MAPPING', '#ENVIRONMENT', '#WATER'],
    summary: 'Multi-temporal aerial mapping of Lake Kivu shoreline erosion and vegetation encroachment over a 6-month monitoring programme.',
    description: 'Commissioned by an environmental research institution, AEROVYN established a recurring quarterly aerial monitoring programme across 85km of Lake Kivu shoreline. Each survey mission produced orthomosaic maps and change-detection analysis comparing current conditions against a historical baseline.\n\nThe data revealed critical erosion hotspots, quantified vegetation loss in riparian zones, and provided actionable intelligence for conservation interventions — all delivered as interactive GIS layers compatible with the client\'s existing monitoring platform.',
    gradient: 'linear-gradient(135deg, #0d1a1a 0%, #051515 50%, #00b8f510 100%)',
    accent: '#00B8F5',
    image: '/images/projects/lake-kivu-aerial.jpg',
    client: 'Rwanda Environment Management Authority',
    location: 'Lake Kivu, Western Province',
    duration: '6 Months (Quarterly)',
    outcome: '85km shoreline monitored. 12 erosion hotspots identified. Conservation programme launched.',
    technologies: ['DJI Mavic 3 Enterprise', 'DJI Matrice 350 RTK', 'Pix4Dmapper', 'QGIS', 'Python (change detection)'],
  },
  {
    slug: 'kigali-marathon-coverage',
    title: 'Kigali International Marathon — Aerial Coverage',
    category: 'Events',
    tags: ['#EVENTS', '#SPORTS', '#BROADCAST'],
    summary: 'Live aerial broadcast support and highlight reel production for the Kigali International Marathon with 12,000 participants.',
    description: 'AEROVYN provided end-to-end aerial production support for the Kigali International Marathon, one of East Africa\'s largest running events. Operating a 5-drone crew across the full 42km course, we streamed live aerial footage to the broadcast truck for real-time TV integration while simultaneously capturing 6K RAW footage for the post-race highlight film.\n\nCoordination with the Rwanda Civil Aviation Authority and city traffic authorities was managed entirely by AEROVYN\'s operations team, allowing the event organisers to focus on race-day logistics.',
    gradient: 'linear-gradient(135deg, #1a0d1a 0%, #150515 50%, #c400f510 100%)',
    accent: '#C400F5',
    image: '/images/projects/marathon-aerial.jpg',
    client: 'Kigali City Events Authority',
    location: 'Kigali, Rwanda',
    duration: '2 Days',
    outcome: '5-drone live broadcast. 12,000+ participants covered. 6K highlight reel delivered in 48h.',
    technologies: ['DJI Inspire 3', 'DJI Avata 2', 'LiveU Solo', 'DaVinci Resolve', 'Adobe Premiere Pro'],
  },
]

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug)
}

export function getRelatedProjects(slug: string, category: string, count = 3) {
  return projects.filter((p) => p.slug !== slug && p.category === category).slice(0, count)
}
