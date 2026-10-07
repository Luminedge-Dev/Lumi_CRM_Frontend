/** @type {import('next').NextConfig} */

// Signed-in areas: never indexed by search engines (robots.txt also disallows them).
const PRIVATE_PATHS = ['/admin/:path*', '/bdm/:path*', '/dashboard/:path*', '/student/dashboard/:path*']

const nextConfig = {
    reactStrictMode: true,
    images: {
        // The image optimizer (/_next/image) is switched off: Next 14 has open advisories in it
        // (DoS, SSRF, RCE) that are only fixed in a major upgrade, and this app only renders
        // small logos/avatars, so images are served as-is. Remove once Next is upgraded.
        unoptimized: true,
        // localhost only in development: in production the image optimizer must not be able to
        // fetch from the server's own loopback interface.
        domains: [
            ...(process.env.NODE_ENV === 'production' ? [] : ['localhost']),
            'i.pravatar.cc',
            'lh3.googleusercontent.com',
            'onrender.com',
        ],
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        // Google sign-in uses a popup that must keep its opener reference.
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'unsafe-none',
                    },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                    { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
                ],
            },
            ...PRIVATE_PATHS.map((source) => ({
                source,
                headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
            })),
        ]
    },
}

module.exports = nextConfig
