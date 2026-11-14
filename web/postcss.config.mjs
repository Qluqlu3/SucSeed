// Tailwind CSS v4 を Next のビルドに組み込む（Rails 側は @tailwindcss/cli で別にビルドしている）
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
