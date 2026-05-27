export function CourseListSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AEROVYN Drone Training Programmes',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Course',
          name: 'Drone Fundamentals & Safety Certification',
          description:
            'Entry-level course covering drone regulations, safety protocols, and basic flight skills. Includes hands-on flight sessions and a certifying assessment.',
          provider: { '@type': 'Organization', name: 'AEROVYN', sameAs: 'https://aerovyn.com' },
          educationalLevel: 'Beginner',
          timeRequired: 'P3D',
          url: 'https://aerovyn.com/training',
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Course',
          name: 'Aerial Mapping & Survey Operations',
          description:
            'Intermediate programme covering photogrammetry, GIS data capture, flight planning software, and multi-mission operations.',
          provider: { '@type': 'Organization', name: 'AEROVYN', sameAs: 'https://aerovyn.com' },
          educationalLevel: 'Intermediate',
          timeRequired: 'P5D',
          url: 'https://aerovyn.com/training',
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Course',
          name: 'Professional UAV Operations & Certification',
          description:
            'Advanced programme for commercial pilots covering BVLOS preparation, enterprise operations, LiDAR and thermal platforms.',
          provider: { '@type': 'Organization', name: 'AEROVYN', sameAs: 'https://aerovyn.com' },
          educationalLevel: 'Advanced',
          timeRequired: 'P7D',
          url: 'https://aerovyn.com/training',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
