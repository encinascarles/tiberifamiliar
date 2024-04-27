import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  //fix prisma error
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "tiberifamiliar.s3.eu-west-3.amazonaws.com",
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    return config;
  },
};

export default nextConfig;
