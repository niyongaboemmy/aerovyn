export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AEROVYN',
    url: 'https://aerovyn.com',
    logo: 'https://aerovyn.com/og-image.png',
    description:
      'Professional drone projects and certified UAV pilot training programmes across Africa.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kigali',
      addressCountry: 'RW',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@aerovyn.com',
      contactType: 'customer service',
    },
    sameAs: [],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
