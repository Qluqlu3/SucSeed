class Match < ApplicationRecord
  # matches は向きが固定されている。アピール（後継者発）もスカウト（職人発）も
  # user_id が後継者、target_user_id が職人で、どちらから声を掛けたかは is_scout で区別する。
  # そのため「後継者 × 職人」の組だけで絞るとアピールとスカウトが混ざる点に注意。
  belongs_to :user, class_name: 'User'
  belongs_to :target_user, class_name: 'User'
  validates :user_id, uniqueness: { scope: :target_user_id }

  scope :appeals,  -> { where(is_scout: false) }
  scope :scouts,   -> { where(is_scout: true) }
  scope :pending,  -> { where(is_ok: nil) }
  scope :accepted, -> { where(is_ok: true) }
end
