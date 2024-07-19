/** @type {import('next').NextConfig} */
const nextConfig = {

      webpack: config => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding')
        return config
      },

      output: 'export',
      images: {
        unoptimized: true,
      },
};

export default nextConfig;
