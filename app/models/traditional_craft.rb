# 都道府県ごとの代表的な伝統工芸品を紹介するための参照データ(マスタ)。
# creatorsとは独立しており、地図ページで「この地域にはどんな工芸品があるか」を
# 紹介する読み物として使う。featuresは1行1項目のテキストとして保存する。
class TraditionalCraft < ApplicationRecord
  belongs_to :art_category, optional: true

  validates :name, presence: true, length: { maximum: 50 }
  validates :prefecture_code, presence: true, inclusion: { in: 1..47 }
  validates :summary, presence: true
  validates :features, presence: true
  validates :production_area, length: { maximum: 50 }, allow_nil: true
  validates :designated_year, allow_nil: true,
                              numericality: { only_integer: true, greater_than: 1868 }
  validates :source_url, format: { with: %r{\Ahttps?://\S+\z} }, allow_blank: true

  def feature_list
    features.to_s.split("\n").map(&:strip).reject(&:empty?)
  end
end
