/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fast Refreshの設定
  reactStrictMode: true,
  output: 'standalone',
  // 本番環境での最適化
  webpack: (config, { dev, isServer }) => {
    // 開発環境でのみ適用
    if (dev && !isServer) {
      // ホットリロードの最適化
      config.watchOptions = {
        poll: 1000, // 1秒ごとに変更をチェック
        aggregateTimeout: 300, // 変更が検出されてから再ビルドまでの待機時間
      }
    }
    return config
  },
  // 本番環境でのパフォーマンス最適化
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig 