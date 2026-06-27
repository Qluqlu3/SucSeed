class MatchController < ApplicationController
  def appealed_list_view
    return redirect_to '/index' if session[:creator].blank?

    @match = User.joins(:sent_matches)
                 .where(matches: { is_ok: nil })
                 .where(users: { id: Match.where(target_user_id: session[:id]).select('matches.user_id') })
                 .select('users.*, users.id AS page_id, matches.created_at AS match_time')
                 .order('matches.created_at ASC')
    @page_props = {
      matches: @match.map { |m| { pageId: m.page_id.to_s, name: m.name, birthday: m.birthday, avatarPath: m.avatar_path, matchTime: m.match_time } },
      flash: flash.to_h
    }
    render :appealed_list
  end

  def matching_list_view
    return redirect_to '/index' if session[:id].blank?

    @match = User
             .joins(:sent_matches)
             .select('users.id, users.name, users.birthday, users.avatar_path, matches.is_add_list, matches.created_at AS match_time')
             .where(matches: { target_user_id: session[:id], is_ok: true })
             .or(
               User.joins(:target_matches)
                   .select('users.id, users.name, users.birthday, users.avatar_path, matches.is_add_list, matches.created_at AS match_time')
                   .where(matches: { user_id: session[:id], is_ok: true })
             )
             .order('matches.created_at DESC')
    @page_props = {
      matches: @match.map { |m| { id: m.id.to_s, name: m.name, birthday: m.birthday, avatarPath: m.avatar_path.to_s, matchTime: m.match_time, isAddList: m.is_add_list.to_i } },
      flash: flash.to_h
    }
    render :matching
  end

  def appeal_answer_ok    = handle_appeal_answer(is_ok: true)
  def appeal_answer_sorry = handle_appeal_answer(is_ok: false)

  def appeal_send
    return redirect_to '/index' if session[:id].blank?

    @match = Match.new(user_id: session[:id], target_user_id: params[:id], is_scout: false)
    flash[:success] = 'success' if @match.save
    redirect_to "/page/creator/#{params[:id]}"
  end

  def appeal_check
    return redirect_to '/index' unless session[:id].present? && session[:creator].nil?

    @appeal = User.joins(:target_matches, :creator)
                  .select('users.name, users.birthday, users.id AS page_id, matches.*, matches.created_at AS match_time, creators.*')
                  .where(matches: { user_id: session[:id], is_ok: nil })
                  .order('matches.created_at ASC')
    @page_props = {
      appeals: @appeal.map { |a| { pageId: a.page_id.to_s, name: a.name, birthday: a.birthday, avatarPath: a.avatar_path.to_s, title: a.title, matchTime: a.match_time, isOk: a.is_ok } },
      flash: flash.to_h
    }
    render :appeal_show
  end

  def scout_send
    return redirect_to '/index' if session[:creator].blank?

    scout = Match.new(user_id: params[:id], target_user_id: session[:id], is_scout: true)
    scout.save ? flash[:success] = 'success' : flash[:danger] = 'エラー'
    redirect_to "/page/heir/#{params[:id]}"
  end

  def scout_answer_ok    = handle_scout_answer(is_ok: true)
  def scout_answer_sorry = handle_scout_answer(is_ok: false)

  def scouted_show
    return redirect_to '/index' unless session[:id].present? && session[:creator].nil?

    @scout = User.joins(:target_matches, :creator)
                 .select('users.name, users.birthday, users.id AS page_id, users.avatar_path, matches.*, matches.created_at AS match_time, creators.*')
                 .where(users: { id: Match.where(user_id: session[:id]).select('matches.target_user_id') })
                 .where(matches: { is_scout: true, is_ok: nil })
                 .order('matches.created_at ASC')
    @page_props = {
      scouts: @scout.map { |s| { pageId: s.page_id.to_s, name: s.name, birthday: s.birthday, avatarPath: s.avatar_path, matchTime: s.match_time, title: s.title } },
      flash: flash.to_h
    }
    render :scout_check
  end

  def scout_check
    return redirect_to '/index' if session[:creator].blank?

    @scout = User.joins(:sent_matches)
                 .select('users.name, users.birthday, users.id AS page_id, matches.created_at AS match_time')
                 .where(matches: { target_user_id: session[:id], is_scout: true })
                 .order('matches.created_at ASC')
    @page_props = {
      scouts: @scout.map { |s| { pageId: s.page_id.to_s, name: s.name, birthday: s.birthday, avatarPath: s.avatar_path.to_s, matchTime: s.match_time, title: '' } },
      flash: flash.to_h
    }
    render :scout_show
  end

  private

  def handle_appeal_answer(is_ok:)
    return redirect_to '/index' if session[:creator].blank?

    match = Match.where(user_id: params[:id], target_user_id: session[:id])
    match.update_all(is_ok: is_ok) ? flash[:success] = 'success' : flash[:danger] = 'エラー'
    redirect_to '/match/appealed/list'
  end

  def handle_scout_answer(is_ok:)
    return redirect_to '/index' unless session[:id].present? && session[:creator].nil?

    scout = Match.where(is_scout: true, user_id: session[:id], target_user_id: params[:id])
    scout.update_all(is_ok: is_ok) ? flash[:success] = 'success' : flash[:danger] = 'エラー'
    redirect_to '/match/scouted/list'
  end
end
