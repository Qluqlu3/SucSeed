require 'test_helper'

module Api
  module V1
    class MessageThreadsControllerTest < ApiTestCase
      setup do
        @creator = build_creator('MsgCreator')
        @heir = build_heir('MsgHeir')
      end

      # ── スレッド一覧 ──────────────────────────────────────────────

      test 'GET /api/v1/message_threads — 未ログインは 401' do
        api_get '/api/v1/message_threads'
        assert_response :unauthorized
      end

      test 'GET /api/v1/message_threads — 職人には相手の後継者が返る' do
        MessageList.create!(creator_user_id: @creator.id, heir_user_id: @heir.id)

        api_login(@creator)
        api_get '/api/v1/message_threads'
        assert_response :success
        assert_equal [@heir.id], json['items'].pluck('id')
        assert_equal 'MsgHeir', json['items'].first['name']
      end

      test 'GET /api/v1/message_threads — 後継者には相手の職人が返る' do
        MessageList.create!(creator_user_id: @creator.id, heir_user_id: @heir.id)

        api_login(@heir)
        api_get '/api/v1/message_threads'
        assert_equal [@creator.id], json['items'].pluck('id')
      end

      test 'GET /api/v1/message_threads — 無関係なスレッドは含まれない' do
        other_creator = build_creator('OtherMsgCr')
        other_heir = build_heir('OtherMsgHeir')
        MessageList.create!(creator_user_id: other_creator.id, heir_user_id: other_heir.id)

        api_login(@creator)
        api_get '/api/v1/message_threads'
        assert_empty json['items']
      end

      # ── スレッド作成 ──────────────────────────────────────────────

      test 'POST /api/v1/message_threads — 職人がスレッドを作れる' do
        api_login(@creator)
        api_post '/api/v1/message_threads', params: { user_id: @heir.id }
        assert_response :created
        assert_equal false, json['alreadyExists']
        assert MessageList.exists?(creator_user_id: @creator.id, heir_user_id: @heir.id)
      end

      test 'POST /api/v1/message_threads — 後継者から作っても向きが揃う' do
        api_login(@heir)
        api_post '/api/v1/message_threads', params: { user_id: @creator.id }
        assert_response :created
        assert MessageList.exists?(creator_user_id: @creator.id, heir_user_id: @heir.id)
      end

      test 'POST /api/v1/message_threads — 既存スレッドは冪等に扱う' do
        MessageList.create!(creator_user_id: @creator.id, heir_user_id: @heir.id)

        api_login(@creator)
        api_post '/api/v1/message_threads', params: { user_id: @heir.id }
        assert_response :success
        assert_equal true, json['alreadyExists']
        assert_equal 1, MessageList.where(creator_user_id: @creator.id).count
      end

      test 'POST /api/v1/message_threads — マッチの is_add_list が両方向で立つ' do
        Match.create!(user_id: @heir.id, target_user_id: @creator.id, is_scout: true, is_ok: true)

        api_login(@creator)
        api_post '/api/v1/message_threads', params: { user_id: @heir.id }
        assert Match.find_by(user_id: @heir.id, target_user_id: @creator.id).is_add_list
      end

      # ── 履歴 ──────────────────────────────────────────────────────

      test 'GET /api/v1/message_threads/:id — 双方向の履歴が古い順で返る' do
        Message.create!(send_user_id: @heir.id, receive_user_id: @creator.id, content: '最初',
                        created_at: 2.days.ago)
        Message.create!(send_user_id: @creator.id, receive_user_id: @heir.id, content: '返信',
                        created_at: 1.day.ago)

        api_login(@creator)
        api_get "/api/v1/message_threads/#{@heir.id}"
        assert_response :success
        assert_equal %w[最初 返信], json['messages'].pluck('content')
        assert_equal 'MsgHeir', json.dig('partner', 'name')
      end

      test 'GET /api/v1/message_threads/:id — mine で自分の発言か判別できる' do
        Message.create!(send_user_id: @creator.id, receive_user_id: @heir.id, content: '自分の発言')

        api_login(@creator)
        api_get "/api/v1/message_threads/#{@heir.id}"
        assert_equal true, json['messages'].first['mine']
      end

      test 'GET /api/v1/message_threads/:id — 第三者とのやり取りは含まれない' do
        outsider = build_heir('OutsiderHeir')
        Message.create!(send_user_id: outsider.id, receive_user_id: @creator.id, content: '無関係')
        Message.create!(send_user_id: @heir.id, receive_user_id: @creator.id, content: '関係あり')

        api_login(@creator)
        api_get "/api/v1/message_threads/#{@heir.id}"
        assert_equal ['関係あり'], json['messages'].pluck('content')
      end

      # ── 送信 ──────────────────────────────────────────────────────

      test 'POST /message_threads/:id/messages — 送信できる' do
        api_login(@creator)
        api_post "/api/v1/message_threads/#{@heir.id}/messages",
                 params: { message: { content: 'はじめまして' } }
        assert_response :created
        assert_equal 'はじめまして', json['content']
        assert_equal true, json['mine']
        assert Message.exists?(send_user_id: @creator.id, receive_user_id: @heir.id)
      end

      test 'POST /message_threads/:id/messages — 空文は 422' do
        api_login(@creator)
        api_post "/api/v1/message_threads/#{@heir.id}/messages",
                 params: { message: { content: '' } }
        assert_response :unprocessable_content
      end

      test 'POST /message_threads/:id/messages — 1000文字超は 422' do
        api_login(@creator)
        api_post "/api/v1/message_threads/#{@heir.id}/messages",
                 params: { message: { content: 'あ' * 1001 } }
        assert_response :unprocessable_content
      end

      test 'POST /message_threads/:id/messages — 存在しない宛先は 404' do
        api_login(@creator)
        api_post '/api/v1/message_threads/no_such_user/messages',
                 params: { message: { content: 'x' } }
        assert_response :not_found
      end
    end
  end
end
