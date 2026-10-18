class MatchController < ApplicationController
  before_action :require_login
  # アピール/スカウトの送信は API（/api/v1/appeals・scouts）のみ。ここでは一覧と回答を扱う。
  # アピールを受けて回答する側・スカウトを送った側 = 職人
  before_action :require_creator, only: %i[appealed_list_view scout_check appeal_answer_ok appeal_answer_sorry]
  # アピールを送った側・スカウトを受けて回答する側 = 後継者
  before_action :require_non_creator, only: %i[appeal_check scouted_show
                                               scout_answer_ok scout_answer_sorry]

  # 職人: 自分宛てで未回答のアピール
  def appealed_list_view
    appeals = my_matches(Match.appeals.pending).order(:created_at)
    @page_props = {
      matches: appeals.map { |m| match_card(m) },
      flash: flash.to_h,
    }
    render :appealed_list
  end

  # 職人・後継者: 成立したマッチング
  def matching_list_view
    matches = my_matches(Match.accepted).order(created_at: :desc)
    @page_props = {
      matches: matches.map do |m|
        match_card(m).merge(isAddList: m.is_add_list, profilePath: partner_profile_path(m))
      end,
      flash: flash.to_h,
    }
    render :matching
  end

  def appeal_answer_ok    = handle_appeal_answer(is_ok: true)
  def appeal_answer_sorry = handle_appeal_answer(is_ok: false)

  # 後継者: 自分が送って未回答のアピール
  def appeal_check
    appeals = my_matches(Match.appeals.pending).order(:created_at)
    @page_props = {
      appeals: appeals.map { |m| match_card(m).merge(title: creator_title(m), isOk: m.is_ok) },
      flash: flash.to_h,
    }
    render :appeal_show
  end

  def scout_answer_ok    = handle_scout_answer(is_ok: true)
  def scout_answer_sorry = handle_scout_answer(is_ok: false)

  # 後継者: 自分宛てで未回答のスカウト
  def scouted_show
    scouts = my_matches(Match.scouts.pending).order(:created_at)
    @page_props = {
      scouts: scouts.map { |m| match_card(m).merge(title: creator_title(m)) },
      flash: flash.to_h,
    }
    render :scout_check
  end

  # 職人: 自分が送ったスカウト（回答済みも含む）
  def scout_check
    scouts = my_matches(Match.scouts).order(:created_at)
    @page_props = {
      scouts: scouts.map { |m| match_card(m).merge(isOk: m.is_ok) },
      flash: flash.to_h,
    }
    render :scout_show
  end

  private

  # ログイン中ユーザーが当事者のマッチ（退会した相手の行は除く）
  def my_matches(scope)
    scope = scope.involving(Current.user).with_active_parties
    # 後継者から見た一覧には相手（職人）の屋号を出す
    Current.creator? ? scope : scope.preload(target_user: :creator)
  end

  def partner_of(match)
    match.partner_for(Current.user)
  end

  def match_card(match)
    partner = partner_of(match)
    {
      pageId: partner.id,
      name: partner.name,
      birthday: partner.birthday,
      avatarPath: partner.avatar_path.to_s,
      matchTime: match.created_at,
    }
  end

  # 後継者から見た相手（職人）の屋号
  def creator_title(match)
    partner_of(match).creator&.title
  end

  def partner_profile_path(match)
    Current.creator? ? "/page/heir/#{match.user_id}" : "/page/creator/#{match.target_user_id}"
  end

  # アピールとスカウトは同じ「後継者 × 職人」の組で格納されるため、Match.answer_appeal /
  # answer_scout が is_scout で絞る。絞らないと職人が自分の送ったスカウトを承認できてしまう。
  def handle_appeal_answer(is_ok:)
    answered = Match.answer_appeal(creator_id: Current.user_id, heir_id: params[:id], accepted: is_ok)
    set_answer_flash(answered)
    redirect_to '/match/appealed/list'
  end

  def handle_scout_answer(is_ok:)
    answered = Match.answer_scout(heir_id: Current.user_id, creator_id: params[:id], accepted: is_ok)
    set_answer_flash(answered)
    redirect_to '/match/scouted/list'
  end

  def set_answer_flash(answered)
    if answered
      flash[:success] = t('flash.success.saved')
    else
      flash[:danger] = t('flash.danger.error')
    end
  end
end
