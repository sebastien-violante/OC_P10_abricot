import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Modification de la config en raison d'un blocage CORS entre back 8000 et front 3000
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*',
      },
    ];
  },
};

export default nextConfig;