/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    swcPlugins: [
      [
        "next-superjson-plugin",
        {},
      ] /* this plugin sanitizes our objects so that we can safely pass them from sever to client components (eg: date components cannot be passed) */,
    ],
  },
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
    ],
  },
};

module.exports = nextConfig;
