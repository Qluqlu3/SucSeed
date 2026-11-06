import type { NextConfig } from 'next';

// 移行中は、Next にまだ無い画面と API をすべて Rails に中継する。
// ブラウザから見えるオリジンは Next の1つだけなので、Rails のセッション Cookie と
// CSRF トークンは今のまま使える（Rails 側は X-Forwarded-Host で元のホストを知る）。
const railsOrigin = process.env.RAILS_ORIGIN ?? 'http://localhost:3001';

const nextConfig: NextConfig = {
  // Rails のルーティングは末尾スラッシュ無しで揃っているので、Next 側で付け外しのリダイレクトをしない
  skipTrailingSlashRedirect: true,

  // 共有パッケージ（packages/*）はビルド済みの JS ではなく TS のまま公開しているので Next 側で変換する
  transpilePackages: ['@sucseed/api'],

  async rewrites() {
    return {
      // API は Next に同名のページがあっても必ず Rails へ流す
      beforeFiles: [{ source: '/api/:path*', destination: `${railsOrigin}/api/:path*` }],
      afterFiles: [],
      // Next のページに当たらなかったパスは Rails の画面（とアセット・アップロード画像）へ
      fallback: [{ source: '/:path*', destination: `${railsOrigin}/:path*` }],
    };
  },
};

export default nextConfig;
