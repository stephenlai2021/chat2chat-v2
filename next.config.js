const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ['firebasestorage.googleapis.com'],
    remotePatterns: [     
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com'
      },
    ],
  },
}

module.exports =  withNextIntl(nextConfig);
// module.exports = nextConfig

// {
//   "avatarUrl": "https://firebasestorage.googleapis.com/v0/b/nextjs-14.appspot.com/o/images%2F%E6%A5%8A%E5%AF%B6%E7%A6%8E.jfif?alt=media&token=77a84b95-42c5-45a2-8641-8f23a01fac6a",
//   "email": "stephenlai2021@gmail.com",
//   "name": "楊寶禎",
//   "id": "a5494b2f-f1c5-4275-9064-981af60df494"
// }
