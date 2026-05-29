export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AEROVYN',
    legalName: 'AEROVYN LTD',
    foundingDate: '2026',
    url: 'https://aerovyn.com',
    logo: 'https://aerovyn.com/og-image.png',
    telephone: '+250788301945',
    description:
      'AEROVYN LTD delivers intelligent drone technology across Africa — aerial intelligence, infrastructure inspection, precision agriculture, geospatial mapping, medical logistics, and certified pilot training.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Amahoro, Kimihurura, Gasabo',
      addressLocality: 'Kigali',
      addressRegion: 'Kigali',
      addressCountry: 'RW',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@aerovyn.com',
      telephone: '+250788301945',
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
