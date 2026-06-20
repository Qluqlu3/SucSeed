class MatchController < ApplicationController
  # アピールされたリスト表示
  def appealed_list_view
    if session[:creator].present?
      @match = User.joins(:sent_matches).where(matches: { is_ok: nil }).where(users: { id: Match.where(target_user_id: session[:id]).select('matches.user_id') }).select(
        'users.*', 'users.id AS page_id', 'users.id', 'matches.created_at AS match_time'
      ).order('matches.created_at ASC')
      @page_props = {
        matches: @match.map do |m|
          {
            pageId: m.page_id.to_s,
            name: m.name,
            birthday: m.birthday,
            avatarPath: m.avatar_path,
            matchTime: m.match_time
          }
        end,
        flash: flash.to_h
      }
      render :appealed_list
    else
      redirect_to '/index'
    end
  end

  # マッチングリスト
  def matching_list_view
    if session[:id].present?
      @match = User
               .joins(:sent_matches)
               .select('users.id, users.name, users.birthday, users.avatar_path, matches.is_add_list, matches.created_at AS match_time')
               .where(matches: { target_user_id: session[:id], is_ok: true })
               .or(
                 User
                   .joins(:target_matches)
                   .select('users.id, users.name, users.birthday, users.avatar_path, matches.is_add_list, matches.created_at AS match_time')
                   .where(matches: { user_id: session[:id], is_ok: true })
               )
               .order('matches.created_at DESC')
      @message_list = MessageList.new
      @page_props = {
        matches: @match.map do |m|
          {
            id: m.id.to_s,
            name: m.name,
            birthday: m.birthday,
            avatarPath: m.avatar_path.to_s,
            matchTime: m.match_time,
            isAddList: m.is_add_list.to_i
          }
        end,
        flash: flash.to_h
      }
      render :matching
    else
      redirect_to '/index'
    end
  end

  # 話してみるボタン
  def appeal_answer_ok
    if session[:creator].present?
      match = Match.where(user_id: params[:id]).where(target_user_id: session[:id])
      if match.update_all(is_ok: 1)
        flash[:success] = 'success'
      else
        flash[:danger] = 'エラー'
      end
      redirect_to '/match/appealed/list'
    else
      redirect_to '/index'
    end
  end

  # ごめなさいボタン
  def appeal_answer_sorry
    if session[:creator].present?
      match = Match.where(user_id: params[:id]).where(target_user_id: session[:id])
      if match.update_all(is_ok: 0)
        flash[:success] = 'success'
      else
        flash[:danger] = 'エラー'
      end
      redirect_to '/match/appealed/list'
    else
      redirect_to '/index'
    end
  end

  # アピールボタン
  def appeal_send
    if session[:id].present?
      @match = Match.new(user_id: session[:id], target_user_id: params[:id], is_scout: false)
      flash[:success] = 'success' if @match.save
      redirect_to "/page/creator/#{params[:id]}"
    else
      redirect_to '/index'
    end
  end

  # アピールした一覧
  def appeal_check
    if session[:id].present? && session[:creator].nil?
      @appeal = User.joins(:target_matches, :creator).select('users.name', 'users.birthday', 'users.id AS page_id', 'matches.*',
                                                             'matches.created_at AS match_time', 'creators.*').where(matches: { user_id: session[:id] }).where(matches: { is_ok: nil }).order('matches.created_at ASC')
      @page_props = {
        appeals: @appeal.map do |a|
          {
            pageId: a.page_id.to_s,
            name: a.name,
            birthday: a.birthday,
            avatarPath: a.avatar_path.to_s,
            title: a.title,
            matchTime: a.match_time,
            isOk: a.is_ok
          }
        end,
        flash: flash.to_h
      }
      render :appeal_show
    else
      redirect_to '/index'
    end
  end

  # スカウトボタン
  def scout_send
    if session[:creator].present?
      scout = Match.new(user_id: params[:id], target_user_id: session[:id], is_scout: true)
      if scout.save
        flash[:success] = 'success'
      else
        flash[:danger] = 'エラー'
      end
      redirect_to "/page/heir/#{params[:id]}"
    else
      redirect_to '/index'
    end
  end

  # スカウトアンサーOK
  def scout_answer_ok
    if session[:id].present? && session[:creator].nil?
      scout = Match.where(is_scout: true).where(user_id: session[:id]).where(target_user_id: params[:id])
      if scout.update_all(is_ok: true)
        flash[:success] = 'スカウトアンサー'
      else
        flash[:danger] = 'スカウトアンサー'
      end
      redirect_to '/match/scouted/list'
    else
      redirect_to '/index'
    end
  end

  # スカウトアンサーNO
  def scout_answer_sorry
    if session[:id].present? && session[:creator].nil?
      scout = Match.where(is_scout: true).where(user_id: session[:id]).where(target_user_id: params[:id])
      if scout.update_all(is_ok: false)
        flash[:success] = 'success'
      else
        flash[:danger] = 'エラー'
      end
      redirect_to '/match/scouted/list'
    else
      redirect_to '/index'
    end
  end

  # スカウト一覧
  def scouted_show
    if session[:id].present? && session[:creator].nil?
      @match = Match.new
      @scout = User.joins(:target_matches, :creator).select('users.name', 'users.birthday', 'users.id AS page_id', 'users.avatar_path', 'matches.*',
                                                            'matches.created_at AS match_time', 'creators.*').where(users: { id: Match.where(user_id: session[:id]).select('matches.target_user_id') }).where(matches: { is_scout: true }).where(matches: { is_ok: nil }).order('matches.created_at ASC')
      @page_props = {
        scouts: @scout.map do |s|
          {
            pageId: s.page_id.to_s,
            name: s.name,
            birthday: s.birthday,
            avatarPath: s.avatar_path,
            matchTime: s.match_time,
            title: s.title
          }
        end,
        flash: flash.to_h
      }
      render :scout_check
    else
      redirect_to '/index'
    end
  end

  # スカウトした一覧
  def scout_check
    if session[:creator].present?
      @scout = User.joins(:sent_matches).select('users.name', 'users.birthday', 'users.id AS page_id',
                                                'matches.created_at AS match_time').where(matches: { target_user_id: session[:id] }).where(matches: { is_scout: true }).order('matches.created_at ASC')
      @page_props = {
        scouts: @scout.map do |s|
          {
            pageId: s.page_id.to_s,
            name: s.name,
            birthday: s.birthday,
            avatarPath: s.avatar_path.to_s,
            matchTime: s.match_time,
            title: ''
          }
        end,
        flash: flash.to_h
      }
      render :scout_show
    else
      redirect_to '/index'
    end
  end
end
