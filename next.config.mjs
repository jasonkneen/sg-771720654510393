/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Add a rule to handle the canvas.node binary module
    config.module.rules.push({ test: /\.node$/, use: 'raw-loader' });

    // Exclude problematic dependencies from being bundled
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });

    return config;
  },
};

export default nextConfig;