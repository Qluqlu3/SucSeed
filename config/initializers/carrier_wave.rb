# CarrierWave のグローバル設定。
#
# テスト環境ではアップロード先のルートを tmp/test_uploads に隔離する。
# 既定のままだと画像を保存するテスト（ギャラリー投稿など）が public/uploads/ 配下に
# ファイルを撒き、実行のたびに Git の作業ツリーが汚れてしまうため。
#
# store_dir は相対パスなので、URL（/uploads/galleries/... ）は本番と変わらない。
# 変わるのは実ファイルの保存先だけ。
if Rails.env.test?
  CarrierWave.configure do |config|
    config.root = Rails.root.join('tmp/test_uploads')
  end
end
