require 'test_helper'

# シリアライザが返すキー集合を固定するテスト。
#
# 【なぜ必要か】
# フロントの型定義 frontend/api/types.ts は手で書いている。JSON は
# JSON.parse で入ってくるので、Rails 側でキーを消したり名前を変えたりしても
# TypeScript のコンパイルは通ってしまい、実行時に undefined になって初めて壊れる。
#
# このテストが落ちたら、期待値を直す前に frontend/api/types.ts の対応する型と
# それを使っているコンポーネントを更新すること。
# 「テストの期待値だけ直す」のは修正ではなく破壊の隠蔽になる。
#
# 対応表:
#   PublicUserSerializer       -> PublicUser
#   CreatorCardSerializer      -> CreatorCard
#   CreatorSerializer          -> CreatorDetail
#   HeirSerializer             -> HeirDetail
#   CommentSerializer          -> Comment
#   DiarySerializer            -> DiaryFeedItem
#   GallerySerializer          -> GalleryFeedItem
#   GalleryDetailSerializer    -> GalleryDetail
#   MatchSerializer            -> Match
#   MessageSerializer          -> Message
#   TraditionalCraftSerializer -> TraditionalCraft
#   ArtCategorySerializer      -> ArtCategory
#   CurrentUserSerializer      -> MessagePartner / 各ページの currentUser
class SerializerContractTest < ActiveSupport::TestCase
  # frontend/api/types.ts と 1:1 で対応するキー（camelCase・ソート済み）
  EXPECTED_KEYS = {
    'ArtCategorySerializer' => %w[id name],
    'CurrentUserSerializer' => %w[avatarPath id name],
    'PublicUserSerializer' => %w[avatarPath birthday id isMan name profile],
    'CreatorCardSerializer' => %w[avatarPath createdAt galleryCount galleryPreviewPath name
                                  prefectureCode title userId],
    'CreatorSerializer' => %w[artCategoryId artCategoryName employee establishment isAppealed
                              isFavorited isOwn isRecruitment postalCode prefectureCode title
                              user userId],
    'HeirSerializer' => %w[artCategoryId artCategoryName introduction isOwn isScouted user userId],
    'CommentSerializer' => %w[avatarPath comment id name postTime],
    'DiarySerializer' => %w[avatarPath commentCount comments content diaryId goodAvatars goodCount
                            myGood name postTime userId],
    'GallerySerializer' => %w[dataUrl goodCount id myGood tags],
    'GalleryDetailSerializer' => %w[comment comments createdAt creator dataUrl galleryId goodCount
                                    matchTagGalleries myGood otherGalleries tags],
    'MatchSerializer' => %w[createdAt creator creatorTitle creatorUserId heir heirUserId isAddList
                            isOk isScout],
    'MessageSerializer' => %w[content createdAt id mine receiveUserId sendUserId],
    'TraditionalCraftSerializer' => %w[categoryName designatedYear features id imagePath name
                                       prefectureCode productionArea relatedCreatorsCount
                                       sourceUrl summary],
  }.freeze

  setup do
    @category = art_categories(:one)
    @creator_user = build_user('ContractCreator', is_creator: true)
    @heir_user = build_user('ContractHeir')
    @creator = Creator.create!(user_id: @creator_user.id, title: '工房',
                               art_category_id: @category.id, establishment: 5, employee: 3,
                               postal_code: '1000001', is_recruitment: true)
    @heir = Heir.create!(user_id: @heir_user.id, art_category_id: @category.id)
    @diary = Diary.create!(user_id: @creator_user.id, content: '日記')
    @diary_comment = DiaryComment.create!(diary_id: @diary.id, user_id: @heir_user.id, comment: 'c')
    image = Rack::Test::UploadedFile.new(Rails.root.join('test/fixtures/files/valid_image.png'),
                                         'image/png')
    @gallery = Gallery.create!(user_id: @creator_user.id, comment: '作品', data: image)
    @match = Match.create!(user_id: @heir_user.id, target_user_id: @creator_user.id,
                           is_scout: false)
    @message = Message.create!(send_user_id: @heir_user.id, receive_user_id: @creator_user.id,
                               content: 'hi')
    @craft = TraditionalCraft.create!(name: '工芸品', prefecture_code: 13, summary: 's',
                                      features: 'f', art_category_id: @category.id)
  end

  test 'すべてのシリアライザについて契約を検証している' do
    # ApplicationSerializer.subclasses は使えない。test 環境は eager_load = false なので
    # 「まだオートロードされていないシリアライザ」が漏れ、先に走ったテストによって
    # 結果が変わってしまう（実際にそれで不安定になった）。
    # ファイル一覧から求めれば実行順に依存しない。
    defined_serializers = Rails.root.glob('app/serializers/*.rb')
                               .map { |path| path.basename('.rb').to_s.camelize }
                               .excluding('ApplicationSerializer')

    assert_equal defined_serializers.sort, EXPECTED_KEYS.keys.sort,
                 'シリアライザを追加/削除したら EXPECTED_KEYS と frontend/api/types.ts も更新すること'
  end

  test 'シリアライザの返すキーが frontend/api/types.ts と一致している' do
    actual_keys.each do |name, keys|
      assert_equal EXPECTED_KEYS.fetch(name), keys,
                   "#{name} のキーが変わっている。frontend/api/types.ts の対応する型も更新すること"
    end
  end

  test 'キーはすべて camelCase で返る' do
    actual_keys.each do |name, keys|
      snake_case = keys.grep(/_/)
      assert_empty snake_case, "#{name} に snake_case のキーが混ざっている: #{snake_case.inspect}"
    end
  end

  test '公開ユーザー情報に非公開のカラムが混ざっていない' do
    forbidden = %w[email passwordDigest password_digest deletedAt deleted_at loginTime login_time]

    %w[PublicUserSerializer CurrentUserSerializer].each do |name|
      leaked = actual_keys.fetch(name) & forbidden
      assert_empty leaked, "#{name} が非公開の項目を返している: #{leaked.inspect}"
    end
  end

  private

  def actual_keys
    @actual_keys ||= serialized_samples.transform_values { |hash| hash.keys.sort }
  end

  def serialized_samples
    {
      'ArtCategorySerializer' => ArtCategorySerializer.new(@category).serializable_hash,
      'CurrentUserSerializer' => CurrentUserSerializer.new(@creator_user).serializable_hash,
      'PublicUserSerializer' => PublicUserSerializer.new(@creator_user).serializable_hash,
      'CreatorCardSerializer' => CreatorCardSerializer.build([creator_card_row]).first,
      'CreatorSerializer' => CreatorSerializer.new(@creator).serializable_hash,
      'HeirSerializer' => HeirSerializer.new(@heir).serializable_hash,
      'CommentSerializer' => CommentSerializer.new(@diary_comment).serializable_hash,
      'DiarySerializer' => DiarySerializer.from_feed(diary_feed).first,
      'GallerySerializer' => GallerySerializer.from_feed(gallery_feed).first,
      'GalleryDetailSerializer' => GalleryDetailSerializer.new(gallery_detail).serializable_hash,
      'MatchSerializer' => MatchSerializer.build([@match]).first,
      'MessageSerializer' => message_serializer_sample,
      'TraditionalCraftSerializer' => TraditionalCraftSerializer.build([@craft]).first,
    }
  end

  def message_serializer_sample
    MessageSerializer.new(@message, params: { viewer_id: @heir_user.id }).serializable_hash
  end

  def creator_card_row
    User.joins(:creator).select(RecruitingCreatorsQuery::COLUMNS)
        .find_by(creators: { user_id: @creator_user.id })
  end

  def diary_feed
    DiaryFeedQueryService.build(diaries: DiaryFeedQueryService.scope_for(@creator_user.id),
                                viewer_id: @heir_user.id)
  end

  def gallery_feed
    GalleryFeedQueryService.build(galleries: GalleryFeedQueryService.scope_for(@creator_user.id),
                                  viewer_id: @heir_user.id)
  end

  def gallery_detail
    GalleryDetailQueryService.build(@gallery, viewer_id: @heir_user.id)
  end

  def build_user(name, is_creator: false)
    User.create!(name: name, email: "#{name.downcase}@example.com",
                 password: 'password123', password_confirmation: 'password123',
                 birthday: '1990-01-01', is_man: true, is_creator: is_creator)
  end
end
