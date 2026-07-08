class Creator < ApplicationRecord
  include SoftDeletable

  validates :title, presence: true, length: { maximum: 50 }
  validates :establishment, presence: true,
                            numericality: { only_integer: true, greater_than_or_equal_to: 0,
                                            less_than_or_equal_to: 500 }
  validates :employee, presence: true,
                       numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :postal_code, presence: true, numericality: true, length: { is: 7 }
  belongs_to :art_category
  belongs_to :user

  before_validation :set_prefecture_code

  private

  # 郵便番号から都道府県コードを自動算出しておく（地図機能でのgroup byを軽くするための非正規化）
  def set_prefecture_code
    self.prefecture_code = PostalCodePrefecture.code_for(postal_code)
  end
end
