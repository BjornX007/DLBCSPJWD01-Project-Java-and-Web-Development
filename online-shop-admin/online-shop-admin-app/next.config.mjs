/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,

  // 🚫 Disable service worker in development
  disable: isDev,
})({
  reactStrictMode: true,
});

export default nextConfig;
