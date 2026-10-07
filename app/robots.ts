import type { MetadataRoute } from 'next'

// Public pages (landing, login, student portal entry, legal) may be crawled; signed-in CRM and
// student areas and the token-carrying password pages must not be.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/bdm/',
        '/dashboard',
        '/student/dashboard',
        '/reset-password',
        '/student/reset-password',
      ],
    },
  }
}
