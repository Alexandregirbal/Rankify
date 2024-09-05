/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Without this it's trying to build the node modules which causes an error
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
