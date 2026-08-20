# JSON API のリクエストテスト用の基底クラス。
#
# API は「JSON で送って JSON で受ける」ことが前提なので as: :json を毎回書かずに
# 済むようヘルパーを用意している。また職人/後継者のロール別テストが多いため、
# ユーザー生成のファクトリもここに置く。
class ApiTestCase < ActionDispatch::IntegrationTest
  DEFAULT_PASSWORD = 'password123'.freeze

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

  # ── ファクトリ ────────────────────────────────────────────────────

  def build_user(name, is_creator: false)
    User.create!(name: name, email: "#{name.downcase}@example.com",
                 password: DEFAULT_PASSWORD, password_confirmation: DEFAULT_PASSWORD,
                 birthday: '1990-01-01', is_man: true, is_creator: is_creator)
  end

  # 職人ユーザー（users.is_creator = true + creators レコード）をまとめて作る
  def build_creator(name, art_category: nil, is_recruitment: true, postal_code: '1000001')
    user = build_user(name, is_creator: true)
    Creator.create!(user_id: user.id, title: "#{name}工房",
                    art_category_id: (art_category || art_categories(:one)).id,
                    establishment: 5, employee: 3, postal_code: postal_code,
                    is_recruitment: is_recruitment)
    user
  end

  # 後継者ユーザー（users.is_creator = false + heirs レコード）
  def build_heir(name, art_category: nil)
    user = build_user(name)
    Heir.create!(user_id: user.id, art_category_id: (art_category || art_categories(:one)).id)
    user
  end
end
