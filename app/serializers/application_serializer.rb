# 全シリアライザの基底クラス。
#
# 「Rails 側は snake_case、TypeScript 側は camelCase」という境界の変換を
# ここ一箇所に閉じ込める。各コントローラで `{ avatarPath: user.avatar_path.to_s }`
# のように手書きしていたキー変換を撲滅するのが目的。
#
# 使い方:
#   UserSerializer.new(user).serializable_hash          # => { "id" => ..., "avatarPath" => ... }
#   UserSerializer.new(users).serializable_hash         # => [ {...}, {...} ]
#   UserSerializer.new(user, params: { viewer: ... })   # => attribute ブロックの第2引数で受け取れる
class ApplicationSerializer
  include Alba::Resource

  transform_keys :lower_camel

  # nil を渡しても落ちないコンストラクタ。
  # `currentUser: logged_in? ? Serializer.new(user)... : nil` という分岐を
  # 呼び出し側に書かせないためのヘルパー。
  def self.render(object, **)
    return nil if object.nil?

    new(object, **).serializable_hash
  end

  private

  # 画面表示用の日時。既存の Presenter と同じ書式を保つ。
  def display_time(time)
    time&.strftime('%Y/%m/%d %H:%M')
  end

  # CarrierWave のアップローダは to_s で URL になる。未設定時に nil ではなく
  # 空文字を返してきた既存挙動をそのまま踏襲する（フロントが img src に直接渡すため）。
  def image_url(uploader)
    uploader.to_s
  end
end
