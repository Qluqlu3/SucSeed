class Match < ApplicationRecord
  # matches は向きが固定されている。アピール（後継者発）もスカウト（職人発）も
  # user_id が後継者、target_user_id が職人で、どちらから声を掛けたかは is_scout で区別する。
  # そのため「後継者 × 職人」の組だけで絞るとアピールとスカウトが混ざる点に注意。
  #
  # この向きを HTML / API の各コントローラが個別に思い出さなくて済むよう、
  # 作成・回答・当事者での絞り込みはここのメソッドを通す。
  belongs_to :user, class_name: 'User'
  belongs_to :target_user, class_name: 'User'
  validates :user_id, uniqueness: { scope: :target_user_id }
  # 向きの前提（user = 後継者 / target_user = 職人）を作成時に守らせる。役割が違うので自分自身も弾かれる。
  # 既存の行は職人登録の切り替えなどで崩れうるため、回答（更新）時には見ない
  validate :parties_have_expected_roles, on: :create

  scope :appeals,  -> { where(is_scout: false) }
  scope :scouts,   -> { where(is_scout: true) }
  scope :pending,  -> { where(is_ok: nil) }
  scope :accepted, -> { where(is_ok: true) }

  scope :between, ->(heir_id:, creator_id:) { where(user_id: heir_id, target_user_id: creator_id) }

  # viewer が当事者の行。職人なら target_user_id、後継者なら user_id が自分になる
  scope :involving, lambda { |viewer|
    where((viewer.is_creator? ? :target_user_id : :user_id) => viewer.id)
  }

  # 退会（論理削除）した当事者の行を INNER JOIN で落とし、両者を読み込んでおく。
  # preload だけだと退会者が nil になり、相手を表示する側で落ちる
  scope :with_active_parties, -> { joins(:user, :target_user).preload(:user, :target_user) }

  def self.appeal(heir_id:, creator_id:)
    new(user_id: heir_id, target_user_id: creator_id, is_scout: false)
  end

  def self.scout(creator_id:, heir_id:)
    new(user_id: heir_id, target_user_id: creator_id, is_scout: true)
  end

  # 職人が受け取ったアピールに回答する。対象のアピールが無ければ nil
  def self.answer_appeal(creator_id:, heir_id:, accepted:)
    answer(appeals.between(heir_id: heir_id, creator_id: creator_id), accepted)
  end

  # 後継者が受け取ったスカウトに回答する。対象のスカウトが無ければ nil
  def self.answer_scout(heir_id:, creator_id:, accepted:)
    answer(scouts.between(heir_id: heir_id, creator_id: creator_id), accepted)
  end

  def self.answer(scope, accepted)
    match = scope.first
    match&.update!(is_ok: accepted)
    match
  end
  private_class_method :answer

  # viewer（当事者の一方）から見た相手
  def partner_for(viewer)
    viewer.id == user_id ? target_user : user
  end

  private

  def parties_have_expected_roles
    errors.add(:user, 'は後継者である必要があります') if user&.is_creator?
    errors.add(:target_user, 'は職人である必要があります') if target_user && !target_user.is_creator?
  end
end
