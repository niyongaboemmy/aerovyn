export type Post = {
  slug: string
  title: string
  excerpt: string
  body: string[]
  category: string
  tags: string[]
  readTime: string
  publishedAt: string
  image?: string
  author: { name: string; role: string; initials: string }
}

export const posts: Post[] = [
  {
    slug: 'drone-regulations-east-africa-2026',
    title: 'Drone Regulations in East Africa: What Operators Need to Know in 2026',
    excerpt: 'Aviation authorities across East Africa are rolling out updated UAV regulations. We break down what changed, what stayed the same, and how to stay compliant.',
    category: 'Regulations',
    tags: ['Regulations', 'Africa', 'Compliance', 'CAA'],
    readTime: '6 min read',
    publishedAt: '2026-05-10',
    image: '/images/blog/drone-regulations.jpg',
    author: { name: 'Jean Claude Tuyisenge', role: 'Founder & Managing Director', initials: 'JT' },
    body: [
      'The regulatory landscape for drone operations in East Africa has evolved significantly over the past 18 months. Rwanda, Kenya, Uganda, and Tanzania have all published updated civil aviation authority frameworks that affect how commercial UAV operators plan and execute missions.',
      'Rwanda\'s Civil Aviation Authority (RCAA) introduced a three-tier permit system in Q1 2026. Tier 1 covers recreational flights below 120m in uncontrolled airspace. Tier 2 covers commercial operations with a standard permit valid for 12 months. Tier 3 covers Beyond Visual Line of Sight (BVLOS) flights, which now require a dedicated operational authorisation and a demonstrated safety case.',
      'Kenya\'s KCAA updated its remote pilot licence requirements in February 2026, mandating a minimum of 40 hours of documented flight time for commercial certification — up from 20 hours under the previous regime. Foreign operators seeking to fly in Kenya must now submit an advance notice of 14 business days rather than 7.',
      'The practical implication for operators is straightforward: start your permit applications earlier than you think you need to, and ensure your operations manual is current. AEROVYN\'s compliance team manages all permit filings on behalf of our clients, ensuring zero mission delays due to administrative bottlenecks.',
      'Looking ahead, the East African Community (EAC) has published a draft framework for a harmonised regional UAV regulatory standard. If adopted, this would allow a single licence to cover commercial operations across all six EAC member states — a significant development for cross-border infrastructure projects.',
    ],
  },
  {
    slug: 'how-ndvi-drones-are-transforming-agriculture',
    title: 'How NDVI Drone Surveys Are Transforming Smallholder Agriculture',
    excerpt: 'Multispectral imaging was once reserved for large-scale commercial farms. Falling hardware costs and faster processing pipelines are putting it within reach of cooperative farmers.',
    category: 'Agriculture',
    tags: ['Agriculture', 'NDVI', 'Precision Farming', 'Technology'],
    readTime: '8 min read',
    publishedAt: '2026-04-22',
    image: '/images/blog/ndvi-agriculture.jpg',
    author: { name: 'Pierre Gatama', role: 'Co-Founder & Director', initials: 'PG' },
    body: [
      'NDVI — the Normalised Difference Vegetation Index — has been used in satellite remote sensing since the 1970s. What has changed in the last three years is the democratisation of the technology: multispectral sensors that once cost $50,000 now ship as purpose-built drones for under $8,000, and the processing software has become fast enough to deliver field-level insights within hours of a flight.',
      'The core principle is elegantly simple. Healthy plants absorb red light and reflect near-infrared (NIR) light strongly. Stressed or dying vegetation does the opposite. By comparing the ratio of reflected red to NIR using a multispectral camera, agronomists can produce a colour-coded map showing exactly where a field\'s health is declining — before the damage becomes visible to the naked eye.',
      'In our Bugesera District project, the NDVI survey identified a 340-hectare zone of severe water stress that the cooperative\'s field officers had not noticed. The cause turned out to be a blocked irrigation canal head that had been partially obstructed for several weeks. Once cleared, the stress zone recovered within two weeks — a recovery that would have gone unnoticed until harvest loss.',
      'For smallholder cooperatives, the challenge is aggregating enough land under a single flight operation to justify the mobilisation cost. AEROVYN\'s cooperative pricing model groups neighbouring farms into a single survey day, reducing per-hectare costs by up to 60% compared to individual farm surveys.',
      'The data pipeline matters as much as the drone. Raw multispectral images are only useful when they become actionable prescription maps. Our team delivers georeferenced PDF reports and KMZ layers that farmers can open on a basic Android phone with Google Earth — no GIS training required.',
    ],
  },
  {
    slug: 'choosing-the-right-drone-for-aerial-photography',
    title: 'Choosing the Right Drone for Professional Aerial Photography',
    excerpt: 'Not all camera drones are created equal. Here is how to evaluate sensor size, gimbal stability, and operational constraints for serious commercial photography work.',
    category: 'Equipment',
    tags: ['Photography', 'Equipment', 'DJI', 'Cameras'],
    readTime: '7 min read',
    publishedAt: '2026-04-05',
    image: '/images/blog/aerial-photography.jpg',
    author: { name: 'Jean Claude Tuyisenge', role: 'Founder & Managing Director', initials: 'JT' },
    body: [
      'The aerial photography market has matured to the point where even entry-level consumer drones can produce imagery that would have required a helicopter 10 years ago. But for professional commercial work — real estate, broadcast, events, and architectural documentation — the difference between a consumer and professional platform is significant.',
      'Sensor size is the single most important variable. The DJI Inspire 3 with a full-frame 8K sensor delivers 14 stops of dynamic range. That latitude matters enormously when shooting golden-hour cityscapes where you need to retain shadow detail in the street and highlight detail in a bright sky simultaneously. The DJI Mini 4 Pro, by contrast, offers a 1/1.3-inch sensor — excellent for content creation, but limited in challenging lighting.',
      'Gimbal stability is the second critical factor, and it is often underestimated. In strong wind conditions, a 3-axis stabilised gimbal may allow detectable micro-vibration into the footage. Professional platforms use ActiveTrack vibration dampening and motor torque feedback to maintain sub-pixel stability even in 40km/h gusts. For real estate still photography this rarely matters, but for broadcast-quality video it is non-negotiable.',
      'Flight time and operational constraints shape what you can realistically deliver. A 30-minute battery allows approximately 20 minutes of usable filming time after takeoff, positioning, and landing safety margins. On a 4-hour golden hour event shoot, battery logistics — spare cells, charging infrastructure, swap time — become a significant part of operations planning.',
      'For most AEROVYN commercial photography projects, we operate a two-drone crew: an Inspire 3 as the primary camera platform and a Mavic 3 Cine as a secondary/backup unit. This gives us redundancy, flexibility to work at different altitudes simultaneously, and a risk mitigation path if the primary platform experiences a technical issue on location.',
    ],
  },
  {
    slug: 'guide-to-drone-pilot-certification-rwanda',
    title: 'The Complete Guide to Drone Pilot Certification in Rwanda',
    excerpt: 'Step-by-step walkthrough of Rwanda\'s RCAA certification process — from study materials and theory exams to practical flight assessment and licence issuance.',
    category: 'Training',
    tags: ['Training', 'Certification', 'Rwanda', 'RCAA'],
    readTime: '10 min read',
    publishedAt: '2026-03-18',
    image: '/images/blog/pilot-training.jpg',
    author: { name: 'Jean Claude Tuyisenge', role: 'Founder & Managing Director', initials: 'JT' },
    body: [
      'Rwanda has one of the most streamlined UAV pilot certification processes in Africa, and the Rwanda Civil Aviation Authority has made significant investments in making the pathway accessible to both local and international applicants. This guide covers the complete process as of Q1 2026.',
      'The first step is completing a RCAA-approved ground school programme. The theory examination covers air law, meteorology, navigation, UAV systems, human factors, and emergency procedures. AEROVYN\'s Beginner Certification course covers the full ground school curriculum and prepares students for the multiple-choice RCAA theory examination in 3 intensive days.',
      'The theory examination is administered at the RCAA examination centre in Kigali. It consists of 60 questions with a 70% pass threshold. Most candidates who have completed a structured ground school pass on their first attempt. A candidate who fails may re-sit after a 14-day waiting period.',
      'The practical flight assessment requires demonstration of pre-flight checks, standard manoeuvres, an emergency procedure scenario, and post-flight procedures. Assessors pay particular attention to situational awareness — they want to see that you are actively scanning the airspace and making conservative margin decisions, not just completing the technical sequence.',
      'Once both examinations are passed, the RCAA issues a Remote Pilot Licence (RPL) valid for 2 years. Renewal requires a log of at least 10 hours of commercial flying in the preceding 12 months, or a refresher ground school. AEROVYN provides logbook management support for all graduates of our certification programmes.',
    ],
  },
  {
    slug: 'future-of-bvlos-operations-africa',
    title: 'Beyond the Horizon: The Future of BVLOS Drone Operations in Africa',
    excerpt: 'Beyond Visual Line of Sight operations are the next frontier for drone logistics, medical supply chains, and infrastructure monitoring. What will it take to unlock BVLOS at scale?',
    category: 'Industry',
    tags: ['BVLOS', 'Industry', 'Logistics', 'Future'],
    readTime: '9 min read',
    publishedAt: '2026-02-28',
    image: '/images/blog/bvlos-operations.jpg',
    author: { name: 'Pierre Gatama', role: 'Co-Founder & Director', initials: 'PG' },
    body: [
      'In April 2019, Zipline launched the world\'s first national-scale drone delivery network from its distribution hub in Muhanga, Rwanda — delivering blood and medical supplies to rural hospitals across the country. That operation, which is now delivering hundreds of packages per day across multiple countries, is the world\'s most advanced proof point for Beyond Visual Line of Sight (BVLOS) commercial drone operations.',
      'BVLOS operations — in which the drone flies beyond the operator\'s direct line of sight — are technically and regulatorily the most complex category of UAV work. The safety case requires reliable detect-and-avoid systems, redundant communication links, robust weather monitoring, and a demonstrated safety management system that satisfies aviation authorities.',
      'The hardware challenge is largely solved. Cellular 4G/5G command links with latencies under 100ms are now reliable enough for BVLOS control across much of East Africa\'s populated areas. The DJI Dock 2 autonomous landing and recharging station enables persistent operations without a ground crew at the remote site.',
      'The regulatory challenge is more complex and varies significantly by country. Rwanda\'s RCAA has a published pathway for BVLOS authorisations under its Tier 3 permit system, requiring an operational authorisation with a detailed risk assessment using the JARUS SORA methodology. Kenya\'s KCAA is developing its BVLOS framework but has not yet issued commercial authorisations outside of controlled trials.',
      'For operators looking to position themselves for BVLOS work, the groundwork starts now. Building a documented safety management system, investing in detect-and-avoid training, and establishing a track record of incident-free VLOS operations are the prerequisites that aviation authorities will scrutinise when evaluating a BVLOS application. AEROVYN is actively working toward our first BVLOS authorisation in Rwanda, targeting Q3 2026.',
    ],
  },
]

export function getPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug)
}

export function getRelatedPosts(slug: string, count = 2) {
  return posts.filter((p) => p.slug !== slug).slice(0, count)
}
