require_relative 'user_factory'

# JSON API のリクエストテスト用の基底クラス。
#
# API は「JSON で送って JSON で受ける」ことが前提なので as: :json を毎回書かずに
# 済むようヘルパーを用意している。職人/後継者のロール別テストが多いため、
# ユーザー生成のファクトリ（UserFactory）も取り込んでいる。
class ApiTestCase < ActionDispatch::IntegrationTest
  include UserFactory

  # ── リクエスト ────────────────────────────────────────────────────

  def api_get(path, params: nil)
    get path, params: params, as: :json
  end

  def api_post(path, params: nil)
    post path, params: params, as: :json
  end

  def api_patch(path, params: nil)
    patch path, params: params, as: :json
  end

  def api_delete(path, params: nil)
    delete path, params: params, as: :json
  end

  # 画像を伴うエンドポイントは JSON ではなく multipart/form-data で送る
  # （CarrierWave が UploadedFile しか受け取れないため）
  def api_post_multipart(path, params:)
    post path, params: params
  end

  def api_patch_multipart(path, params:)
    patch path, params: params
  end

  def upload_fixture(name = 'valid_image.png', type = 'image/png')
    Rack::Test::UploadedFile.new(Rails.root.join('test/fixtures/files', name), type)
  end

  def json
    response.parsed_body
  end

  def error_code
    json.dig('error', 'code')
  end

  # ── 認証 ──────────────────────────────────────────────────────────

  def api_login(user, password: DEFAULT_PASSWORD)
    api_post '/api/v1/session', params: { session: { email: user.email, password: password } }
  end
end
