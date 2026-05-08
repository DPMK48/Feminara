/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  headers: async () => [
    {
      source: '/sw.js',
      headers: [
        { key: 'Cache-Control', value: 'no-cache' },
        { key: 'Service-Worker-Allowed', value: '/' },
      ],
    },
    {
      source: '/manifest.json',
      headers: [{ key: 'Cache-Control', value: 'no-cache' }],
    },
  ],
};

export default nextConfig;
