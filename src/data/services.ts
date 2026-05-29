import { Map, Wrench, Sprout, Shield, Truck, GraduationCap, type LucideIcon } from 'lucide-react'

export interface ServiceData {
  icon: LucideIcon
  title: string
  slug: string
  accent: string
  image: string
  summary: string
  features: string[]
  span?: string
  description: string[]
  useCases: { title: string; desc: string }[]
  deliverables: string[]
  equipment: string[]
}

const RW = {
  city:     'https://images.unsplash.com/photo-1687986261123-b17f08f2796c?w=1200&q=80&fit=crop&auto=format',
  hills:    'https://images.unsplash.com/photo-1682773083924-6f0f5a700d8b?w=1200&q=80&fit=crop&auto=format',
  aerial:   'https://images.unsplash.com/photo-1551357141-f73a8402ceb3?w=1200&q=80&fit=crop&auto=format',
  rural:    'https://images.unsplash.com/photo-1682773083896-95176d8aecf8?w=1200&q=80&fit=crop&auto=format',
  cityHill: 'https://images.unsplash.com/photo-1708772565599-2c4e4b3ed9db?w=1200&q=80&fit=crop&auto=format',
  valley:   'https://images.unsplash.com/photo-1682773083912-ff5ee5fa557b?w=1200&q=80&fit=crop&auto=format',
}

export const services: ServiceData[] = [
  {
    icon: Wrench,
    title: 'Infrastructure Inspection',
    slug: 'inspection',
    accent: '#F54D4D',
    image: RW.city,
    summary: 'Rapid, non-intrusive aerial inspection of power lines, telecom towers, bridges, and industrial sites — with high-resolution imagery and thermal analysis.',
    features: ['Power line & telecom tower inspection', 'Thermal / IR analysis', 'GPS-tagged defect reports', '24-hour report turnaround'],
    span: 'lg:col-span-2',
    description: [
      'Traditional infrastructure inspections require rope access teams, scaffolding, and lengthy shutdowns — all expensive, slow, and dangerous. AEROVYN eliminates every one of those constraints with precision aerial platforms that capture centimetre-level detail without a single worker at height.',
      'Our certified crews deploy DJI Matrice 300 RTK drones equipped with the Zenmuse H20T — combining a 20MP zoom camera, wide-angle lens, radiometric thermal imager, and laser rangefinder in a single payload. Every defect is GPS-tagged, measured, and documented in a structured report delivered within 24 hours.',
      'From Rwanda\'s national power grid to telecom towers across East Africa, AEROVYN has completed hundreds of infrastructure inspection missions — enabling clients to prioritise maintenance spend, reduce risk, and extend asset lifespan.',
    ],
    useCases: [
      { title: 'Power Transmission Lines', desc: 'Identify insulator damage, conductor sagging, vegetation encroachment, and corrosion across long-distance HV lines — without de-energisation.' },
      { title: 'Telecom Tower Inspection', desc: 'Close-proximity imaging of antenna mounts, structural joints, corrosion, and cable management on towers up to 120m.' },
      { title: 'Bridge & Civil Structure', desc: 'Detailed condition assessment of decks, piers, bearings, and expansion joints on road and rail bridges.' },
      { title: 'Industrial Facilities', desc: 'Rooftop, façade, and chimney inspection of factories, warehouses, and processing plants — minimising operational downtime.' },
    ],
    deliverables: ['High-resolution photo & video report', 'Thermal / IR imagery with temperature data', 'GPS-tagged defect map', 'Structured maintenance priority report', 'Raw data files on request'],
    equipment: ['DJI Matrice 300 RTK + H20T', 'DJI Matrice 350 RTK', 'Zenmuse Z30 optical zoom'],
  },
  {
    icon: Sprout,
    title: 'Precision Agriculture',
    slug: 'agriculture',
    accent: '#F5C400',
    image: RW.hills,
    summary: 'Multispectral crop monitoring and precision spraying — empowering farmers with data-driven agriculture across the Land of a Thousand Hills.',
    features: ['Multispectral NDVI imaging', 'Precision spraying', 'Early disease detection', 'Variable-rate prescription maps'],
    span: 'lg:col-span-1',
    description: [
      'Rwanda\'s hilly terrain and smallholder farming structure have historically made precision agriculture difficult to achieve at scale. AEROVYN bridges that gap — bringing the tools of industrial farming to African smallholders and large cooperatives alike.',
      'Our multispectral imaging flights produce NDVI, NDRE, and NDWI vegetation indices across entire farm blocks in a single sortie. Early stress detection can identify disease, drought, or nutrient deficiency weeks before it becomes visible to the naked eye — giving farmers a critical window to intervene.',
      'For farms requiring chemical application, our DJI Agras T40 precision sprayer delivers crop protection products at variable rates according to prescription maps derived from the multispectral data — eliminating waste, reducing chemical cost, and protecting adjacent ecosystems.',
    ],
    useCases: [
      { title: 'Crop Health Monitoring', desc: 'Multi-band NDVI flights over tea, coffee, maize, rice, and horticultural crops to identify stress zones and track seasonal progress.' },
      { title: 'Precision Spraying', desc: 'Variable-rate application of fertilisers, herbicides, fungicides, and pesticides — covering 40+ hectares per hour.' },
      { title: 'Irrigation Assessment', desc: 'Thermal and multispectral analysis to identify over- and under-irrigated zones across large irrigation schemes.' },
      { title: 'Harvest Planning', desc: 'Biomass estimation and maturity index mapping to optimise harvest scheduling and logistics.' },
    ],
    deliverables: ['Multispectral orthomosaic maps', 'NDVI / NDRE / NDWI index rasters', 'Variable-rate prescription map (GIS-ready)', 'Field health report with intervention recommendations', 'Spray coverage confirmation map'],
    equipment: ['DJI Phantom 4 Multispectral', 'DJI Agras T40', 'MicaSense RedEdge-MX'],
  },
  {
    icon: Map,
    title: 'Geospatial Mapping & Surveys',
    slug: 'mapping',
    accent: '#00F5C4',
    image: RW.aerial,
    summary: 'Centimetre-accurate topographic surveys, 3D terrain models, and volumetric calculations for architects, engineers, and planners.',
    features: ['2cm GSD photogrammetry', 'LiDAR fusion surveys', '3D point clouds & DEMs', 'QGIS / AutoCAD deliverables'],
    span: 'lg:col-span-1',
    description: [
      'Accurate geospatial data is the foundation of every major infrastructure project, urban development plan, and land administration programme in Africa. AEROVYN delivers survey-grade mapping outputs that meet international accuracy standards — faster and at lower cost than traditional ground survey methods.',
      'Using GCP-controlled photogrammetry and LiDAR fusion on the DJI Matrice 350 RTK, we achieve ground sample distances below 2cm and absolute accuracy within 3cm horizontally and 5cm vertically. Our deliverables are produced in standard formats compatible with QGIS, AutoCAD, ArcGIS, and Civil 3D.',
      'From single-site topographic surveys to district-scale land administration mapping programmes, AEROVYN has delivered geospatial products used by government agencies, engineering firms, real estate developers, and environmental organisations across Rwanda.',
    ],
    useCases: [
      { title: 'Topographic Survey', desc: 'High-accuracy terrain models and contour maps for engineering design, site planning, and flood risk assessment.' },
      { title: 'Construction Monitoring', desc: 'Regular progress photography and volumetric earthwork calculations at active construction sites.' },
      { title: 'Urban Planning & Cadastre', desc: 'Large-area orthomosaic mapping and building footprint extraction for urban development and land registry programmes.' },
      { title: 'Environmental Assessment', desc: 'Vegetation mapping, erosion monitoring, and land cover classification for environmental impact studies.' },
    ],
    deliverables: ['Georeferenced orthomosaic (GeoTIFF)', 'Digital Elevation Model (DEM / DSM)', '3D point cloud (LAS / LAZ)', 'Contour lines (DXF / SHP)', 'Volumetric calculations report', 'QGIS / AutoCAD-ready files'],
    equipment: ['DJI Matrice 350 RTK + LiDAR 360', 'DJI Phantom 4 RTK', 'Trimble ground control targets'],
  },
  {
    icon: Truck,
    title: 'Medical Logistics & Emergency Delivery',
    slug: 'medical',
    accent: '#4D7CF5',
    image: RW.rural,
    summary: 'Time-critical delivery of blood products, vaccines, and medicines to hospitals and remote communities — cutting hours to minutes.',
    features: ['Blood, vaccines & medicine delivery', 'Remote community access', 'Real-time flight tracking', 'Sub-30-minute windows'],
    span: 'lg:col-span-2',
    description: [
      'In Rwanda, the last mile of healthcare delivery has always been the hardest. A patient bleeding out in a rural health centre may be less than 50km from a blood bank — but road conditions, traffic, and geography can turn that journey into a two-hour wait. A drone takes 25 minutes.',
      'AEROVYN operates medical delivery missions under RCAA Beyond Visual Line of Sight (BVLOS) authorisation, carrying insulated payload boxes containing blood products, vaccines, anti-venom, surgical supplies, and emergency medicines. Real-time GPS telemetry gives dispatchers and receiving clinics full visibility of every flight.',
      'Our operations team is available around the clock, and our medical delivery drones are pre-loaded and mission-ready within 15 minutes of an order. We work directly with hospitals, district health offices, and emergency response coordinators to design delivery routes and standard operating procedures for each facility.',
    ],
    useCases: [
      { title: 'Blood Product Delivery', desc: 'Urgent delivery of whole blood, packed red cells, plasma, and platelets to rural hospitals and health centres.' },
      { title: 'Vaccine Cold Chain', desc: 'Temperature-monitored delivery of vaccines to remote vaccination outreach points, maintaining cold-chain integrity.' },
      { title: 'Emergency Medicines', desc: 'Rapid dispatch of anti-venom, oxytocin, adrenaline, and critical surgical supplies during emergencies.' },
      { title: 'Sample Collection', desc: 'Return-leg sample transport — collecting diagnostic specimens from remote facilities and returning them to central labs.' },
    ],
    deliverables: ['GPS flight log & proof of delivery', 'Payload temperature monitoring report', 'Chain-of-custody documentation', 'Real-time tracking dashboard access', 'Monthly delivery analytics report'],
    equipment: ['DJI Matrice 350 RTK (medical payload)', 'Custom insulated payload box', 'Real-time telemetry system'],
  },
  {
    icon: Shield,
    title: 'Private Security & Asset Monitoring',
    slug: 'security',
    accent: '#C400F5',
    image: RW.cityHill,
    summary: '24/7 aerial surveillance for critical infrastructure, commercial properties, and industrial sites with real-time visual intelligence.',
    features: ['24/7 perimeter surveillance', 'Real-time visual intel', 'Rapid incident response', 'Commercial site monitoring'],
    span: 'lg:col-span-1',
    description: [
      'Ground security teams have fixed viewpoints and finite patrol coverage. AEROVYN\'s aerial surveillance capability expands your security perimeter instantly — providing eyes above every corner of your asset, in real time, day or night.',
      'Our security drones are equipped with the Zenmuse H20T payload, combining a 20x optical zoom camera with a fully radiometric thermal imager. In low-light and zero-visibility conditions, the thermal sensor detects human heat signatures that are invisible to conventional cameras.',
      'We design bespoke aerial security programmes for each client — defining patrol routes, alert thresholds, escalation protocols, and integration with existing ground security operations. A dedicated AEROVYN operator monitors feeds in real time and alerts your security team within 60 seconds of detecting an anomaly.',
    ],
    useCases: [
      { title: 'Perimeter Patrol', desc: 'Automated or live-piloted drone patrols of facility perimeters, detecting intrusions before they reach critical assets.' },
      { title: 'Construction Site Security', desc: 'Overnight and weekend monitoring of construction sites to deter theft, vandalism, and unauthorised access.' },
      { title: 'Event Security', desc: 'Aerial overwatch for large-scale events — tracking crowd density, access control compliance, and security incidents.' },
      { title: 'Critical Infrastructure', desc: 'Continuous monitoring of power substations, water treatment plants, data centres, and government facilities.' },
    ],
    deliverables: ['Live video feed to client dashboard', 'Incident reports with timestamped footage', 'Patrol logs & coverage maps', 'Thermal anomaly alerts', 'Monthly security summary report'],
    equipment: ['DJI Matrice 300 RTK + H20T', 'DJI Dock 2 (automated deployment)', 'Zenmuse H20T thermal + optical'],
  },
  {
    icon: GraduationCap,
    title: 'Training, Maintenance & Value-Add',
    slug: 'training-services',
    accent: '#00D68F',
    image: RW.valley,
    summary: 'Certified pilot training, drone maintenance, regulatory compliance, and spectacular drone shows for national events and corporate ceremonies.',
    features: ['Certified pilot programmes', 'Drone maintenance services', 'Regulatory compliance', 'Drone shows & events'],
    span: 'lg:col-span-1',
    description: [
      'Africa\'s drone industry is growing rapidly — but the shortage of certified operators, qualified maintenance technicians, and regulatory expertise is a genuine constraint on that growth. AEROVYN\'s training and value-add division exists to remove that bottleneck.',
      'Our RCAA-accredited pilot training programmes take students from zero experience to fully licensed Remote Pilot Certificate holders, with tracks designed for recreational fliers, commercial operators, and enterprise flight teams. All training is conducted on real commercial equipment — the same platforms we use on operational missions.',
      'Beyond training, we offer drone maintenance contracts, airspace consultation, CAA permit filing, and customised drone shows using formation-flying light drones for national days, corporate events, and cultural celebrations.',
    ],
    useCases: [
      { title: 'Pilot Training Programmes', desc: 'RCAA-accredited beginner, intermediate, and advanced courses with simulator and field components.' },
      { title: 'Corporate Flight Teams', desc: 'Bespoke training programmes for organisations wishing to build in-house drone operations capability.' },
      { title: 'Drone Maintenance', desc: 'Scheduled servicing, component replacement, firmware management, and emergency repair for DJI commercial platforms.' },
      { title: 'Drone Light Shows', desc: 'Choreographed formation flying with 50–500 light drones for national events, product launches, and celebrations.' },
    ],
    deliverables: ['RCAA Remote Pilot Certificate', 'Training completion certificate', 'Maintenance service report', 'Airspace permit documentation', 'Drone show choreography & execution'],
    equipment: ['DJI Avata 2', 'DJI Mini 4 Pro (training)', 'DJI Matrice 350 RTK (advanced)', 'DJI simulator suite'],
  },
]

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return services.find(s => s.slug === slug)
}
