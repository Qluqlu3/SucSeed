# 職人/後継者のロール別ユーザーを作るテスト用ファクトリ。
# fixtures だけでは「職人 × 後継者」の組み合わせを柔軟に作りにくいため、
# API テスト（ApiTestCase）と HTML のコントローラテストの両方から include して使う。
module UserFactory
  DEFAULT_PASSWORD = 'password123'.freeze

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
