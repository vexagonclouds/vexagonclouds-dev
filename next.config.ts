import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `next build` emits a fully static `out/` folder (no Node server
  // needed). The site has no API routes / server actions / SSR, so this is safe and
  // is what AWS Amplify hosts. See ../i-want-to-host plan + amplify.yml.
  output: "export",
  // Emit each route as `route/index.html` — cleanest mapping for static hosts.
  trailingSlash: true,
  // Pin the workspace root to this project; a stray lockfile in $HOME otherwise
  // makes Next infer the wrong root.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
