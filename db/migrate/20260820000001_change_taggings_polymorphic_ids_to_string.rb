# taggings.taggable_id / tagger_id を integer から string に変更する。
#
# 【背景】
# galleries.id と users.id は has_secure_token による24文字の英数字トークン（string）だが、
# acts-as-taggable-on が生成した taggings テーブルは taggable_id / tagger_id が integer の
# ままだった。MySQL は文字列を integer カラムに入れる際に先頭の数値部分だけを取るため、
#
#   'Zzz0YJxpGkl2...' -> 0
#   '5XYkxxVjJaLm...' -> 5
#
# のように丸められ、以下の不具合が起きていた。
#
#   - 先頭が英字の id を持つギャラリーはすべて taggable_id = 0 に集約され、
#     tagged_with による検索が「タグの付いた全ギャラリー」を返す（タグ検索が機能しない）
#   - 同じ理由で gallery.tag_list が他人のタグを拾う / 空になる
#   - /gallery/selected/:id の「同じタグの作品」に無関係な作品が並ぶ
#
# 【既存データの扱い】
# 既存の taggings 行はどのレコードを指していたか復元できない（0 に丸められている）ため削除する。
# 残したままカラム型を変えると、今度は文字列比較で確実にどこにもマッチしない孤児行になる。
# tags.taggings_count もそれに合わせて 0 に戻す。
class ChangeTaggingsPolymorphicIdsToString < ActiveRecord::Migration[7.2]
  # トークンは24文字。複合ユニークインデックス(taggings_idx)のキー長が
  # InnoDB の上限(3072バイト)を超えないよう、varchar(255)ではなく32文字に抑える。
  ID_LIMIT = 32

  def up
    execute 'DELETE FROM taggings'
    change_column :taggings, :taggable_id, :string, limit: ID_LIMIT
    change_column :taggings, :tagger_id, :string, limit: ID_LIMIT
    execute 'UPDATE tags SET taggings_count = 0'
  end

  def down
    execute 'DELETE FROM taggings'
    change_column :taggings, :taggable_id, :integer
    change_column :taggings, :tagger_id, :integer
    execute 'UPDATE tags SET taggings_count = 0'
  end
end
