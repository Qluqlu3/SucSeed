# 都道府県ごとの代表的な伝統工芸品を紹介するための参照データ(マスタ)。
# creatorsとは独立しており、地図ページで「この地域にはどんな工芸品があるか」を
# 紹介する読み物として使う。featuresは1行1項目のテキストとして保存する。
class TraditionalCraft < ApplicationRecord
  belongs_to :art_category, optional: true

  validates :name, presence: true, length: { maximum: 50 }
  validates :prefecture_code, presence: true, inclusion: { in: 1..47 }
  validates :summary, presence: true
  validates :features, presence: true

  def feature_list
    features.to_s.split("\n").map(&:strip).reject(&:empty?)
  end
end
