# Solid Cache 導入。本番の Rails.cache を既定の :file_store（プロセスローカルで
# 複数インスタンス間で共有されず、Rack::Attack / rate_limit のカウンタが
# インスタンスごとに別集計になっていた）から、MySQL に持つ Solid Cache へ切り替える。
#
# 別データベース/別接続を増やさず、既存の主DBにテーブルを1つ足すだけで済ませる
# (config/cache.yml で database: を指定していないため ActiveRecord::Base の
# 接続をそのまま使う)。カラム定義は solid_cache gem が生成する
# db/cache_structure.mysql.sql と同一。
class CreateSolidCacheEntries < ActiveRecord::Migration[8.1]
  def change
    create_table :solid_cache_entries, charset: 'utf8mb4', collation: 'utf8mb4_0900_ai_ci' do |t|
      t.binary :key, limit: 1024, null: false
      t.binary :value, limit: 536_870_912, null: false
      t.datetime :created_at, null: false
      t.integer :key_hash, limit: 8, null: false
      t.integer :byte_size, limit: 4, null: false

      t.index :byte_size
      t.index %i[key_hash byte_size]
      t.index :key_hash, unique: true
    end
  end
end
