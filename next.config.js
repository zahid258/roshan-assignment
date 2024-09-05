module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.eu-central-1.amazonaws.com',
        port: '',
        pathname: '/jansnewfiles/**',
      },
      {
        protocol: 'https',
        hostname: 'janjapan.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
