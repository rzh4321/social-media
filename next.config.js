/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            port: '',
            pathname: '**',
          },
        ],
      },
};
// (https://lh3.googleusercontent.com/a/AAcHTtdX7H3y0eKRut4WqpNEWHBsOAnWAyxIBpC-JPkXlsW3=s96-c)

module.exports = nextConfig;
