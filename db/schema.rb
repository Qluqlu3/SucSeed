# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2019_02_25_161150) do
  create_table "admins", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", limit: 20, null: false
    t.string "user_id", null: false
    t.string "password_digest", null: false
    t.timestamp "created_at", null: false
    t.timestamp "updated_at"
    t.timestamp "deleted_at"
  end

  create_table "art_categories", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", limit: 30, null: false
  end

  create_table "creators", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "user_id", null: false
    t.string "title", limit: 30, null: false
    t.bigint "art_category_id", null: false
    t.integer "establishment", null: false
    t.integer "employee", null: false
    t.string "postal_code", limit: 7, null: false
    t.boolean "is_recruitment", null: false
    t.timestamp "created_at", null: false
    t.timestamp "updated_at"
    t.timestamp "deleted_at"
    t.index ["art_category_id"], name: "index_creators_on_art_category_id"
    t.index ["user_id"], name: "fk_rails_f0c5a1a18a"
  end

  create_table "diaries", id: :string, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "user_id", null: false
    t.text "content", null: false
    t.timestamp "created_at", null: false
    t.timestamp "updated_at"
    t.timestamp "deleted_at"
    t.index ["user_id"], name: "fk_rails_f03fd03c63"
  end

  create_table "diary_comments", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "diary_id", null: false
    t.string "user_id", null: false
    t.string "comment", limit: 100, null: false
    t.timestamp "created_at", null: false
    t.timestamp "deleted_at"
    t.index ["diary_id"], name: "fk_rails_0f3d78174b"
    t.index ["user_id"], name: "fk_rails_75f0ca877d"
  end

  create_table "diary_goods", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "diary_id", null: false
    t.string "user_id", null: false
    t.timestamp "created_at", null: false
    t.index ["diary_id"], name: "fk_rails_b7c652964c"
    t.index ["user_id"], name: "fk_rails_da8d03400c"
  end

  create_table "favorites", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "user_id", null: false
    t.string "favorite_user_id", null: false
    t.timestamp "created_at", null: false
    t.index ["favorite_user_id"], name: "fk_rails_0bb10dcefc"
    t.index ["user_id"], name: "fk_rails_d15744e438"
  end

  create_table "galleries", id: :string, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "user_id", null: false
    t.string "data", null: false
    t.string "comment", limit: 100, null: false
    t.timestamp "created_at", null: false
    t.timestamp "deleted_at"
    t.index ["user_id"], name: "fk_rails_05f824a025"
  end

  create_table "gallery_comments", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "gallery_id", null: false
    t.string "user_id", null: false
    t.string "comment", limit: 100, null: false
    t.timestamp "created_at", null: false
    t.timestamp "deleted_at"
    t.index ["gallery_id"], name: "fk_rails_a5a859737a"
    t.index ["user_id"], name: "fk_rails_a90bc1d938"
  end

  create_table "gallery_goods", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "gallery_id", null: false
    t.string "user_id", null: false
    t.timestamp "created_at", null: false
    t.index ["gallery_id"], name: "fk_rails_d33d7a5d17"
    t.index ["user_id"], name: "fk_rails_2769ec3bc8"
  end

  create_table "heirs", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "user_id", null: false
    t.bigint "art_category_id", null: false
    t.text "introduction"
    t.timestamp "created_at", null: false
    t.timestamp "updated_at"
    t.index ["art_category_id"], name: "index_heirs_on_art_category_id"
    t.index ["user_id"], name: "fk_rails_94084789b8"
  end

  create_table "inquiries", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "user_id"
    t.bigint "inquiry_category_id", null: false
    t.text "content", null: false
    t.boolean "is_check", default: false, null: false
    t.bigint "admin_id"
    t.timestamp "created_at", null: false
    t.timestamp "updated_at"
    t.timestamp "deleted_at"
    t.index ["admin_id"], name: "index_inquiries_on_admin_id"
    t.index ["inquiry_category_id"], name: "index_inquiries_on_inquiry_category_id"
    t.index ["user_id"], name: "fk_rails_7fdff2c1ec"
  end

  create_table "inquiry_categories", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", limit: 20, null: false
  end

  create_table "matches", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "user_id", null: false
    t.string "target_user_id", null: false
    t.boolean "is_scout", null: false
    t.boolean "is_ok"
    t.boolean "is_add_list", default: false, null: false
    t.timestamp "created_at", null: false
    t.timestamp "updated_at"
    t.index ["target_user_id"], name: "fk_rails_c475acfdab"
    t.index ["user_id"], name: "fk_rails_1766d8a780"
  end

  create_table "message_lists", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "creator_user_id", null: false
    t.string "heir_user_id", null: false
    t.timestamp "created_at", null: false
    t.timestamp "updated_at"
    t.index ["creator_user_id"], name: "fk_rails_c44687bc14"
    t.index ["heir_user_id"], name: "fk_rails_8e0dafab66"
  end

  create_table "messages", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "send_user_id", null: false
    t.string "receive_user_id", null: false
    t.text "content", null: false
    t.timestamp "created_at", null: false
    t.index ["receive_user_id"], name: "fk_rails_75141dd80c"
    t.index ["send_user_id"], name: "fk_rails_6613941af1"
  end

  create_table "news", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "user_id", null: false
    t.text "content", null: false
    t.timestamp "created_at", null: false
    t.index ["user_id"], name: "fk_rails_7b6cb9343d"
  end

  create_table "taggings", id: :integer, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "tag_id"
    t.string "taggable_type"
    t.integer "taggable_id"
    t.string "tagger_type"
    t.integer "tagger_id"
    t.string "context", limit: 128
    t.datetime "created_at", precision: nil
    t.index ["context"], name: "index_taggings_on_context"
    t.index ["tag_id", "taggable_id", "taggable_type", "context", "tagger_id", "tagger_type"], name: "taggings_idx", unique: true
    t.index ["tag_id"], name: "index_taggings_on_tag_id"
    t.index ["taggable_id", "taggable_type", "context"], name: "index_taggings_on_taggable_id_and_taggable_type_and_context"
    t.index ["taggable_id", "taggable_type", "tagger_id", "context"], name: "taggings_idy"
    t.index ["taggable_id"], name: "index_taggings_on_taggable_id"
    t.index ["taggable_type"], name: "index_taggings_on_taggable_type"
    t.index ["tagger_id", "tagger_type"], name: "index_taggings_on_tagger_id_and_tagger_type"
    t.index ["tagger_id"], name: "index_taggings_on_tagger_id"
  end

  create_table "tags", id: :integer, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", collation: "utf8mb3_bin"
    t.integer "taggings_count", default: 0
    t.index ["name"], name: "index_tags_on_name", unique: true
  end

  create_table "users", id: :string, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", limit: 20, null: false
    t.string "email", limit: 256, null: false
    t.string "avatar_path"
    t.boolean "is_creator", default: false, null: false
    t.date "birthday", null: false
    t.boolean "is_man", null: false
    t.string "password_digest", null: false
    t.text "profile"
    t.boolean "is_certified", default: false, null: false
    t.timestamp "created_at", null: false
    t.timestamp "login_time"
    t.timestamp "deleted_at"
  end

  add_foreign_key "creators", "art_categories"
  add_foreign_key "creators", "users", on_delete: :cascade
  add_foreign_key "diaries", "users", on_delete: :cascade
  add_foreign_key "diary_comments", "diaries", on_delete: :cascade
  add_foreign_key "diary_comments", "users", on_delete: :cascade
  add_foreign_key "diary_goods", "diaries", on_delete: :cascade
  add_foreign_key "diary_goods", "users", on_delete: :cascade
  add_foreign_key "favorites", "users", column: "favorite_user_id", on_delete: :cascade
  add_foreign_key "favorites", "users", on_delete: :cascade
  add_foreign_key "galleries", "users", on_delete: :cascade
  add_foreign_key "gallery_comments", "galleries", on_delete: :cascade
  add_foreign_key "gallery_comments", "users", on_delete: :cascade
  add_foreign_key "gallery_goods", "galleries", on_delete: :cascade
  add_foreign_key "gallery_goods", "users", on_delete: :cascade
  add_foreign_key "heirs", "art_categories"
  add_foreign_key "heirs", "users", on_delete: :cascade
  add_foreign_key "inquiries", "admins"
  add_foreign_key "inquiries", "inquiry_categories"
  add_foreign_key "inquiries", "users", on_delete: :cascade
  add_foreign_key "matches", "users", column: "target_user_id", on_delete: :cascade
  add_foreign_key "matches", "users", on_delete: :cascade
  add_foreign_key "message_lists", "users", column: "creator_user_id", on_delete: :cascade
  add_foreign_key "message_lists", "users", column: "heir_user_id", on_delete: :cascade
  add_foreign_key "messages", "users", column: "receive_user_id", on_delete: :cascade
  add_foreign_key "messages", "users", column: "send_user_id", on_delete: :cascade
  add_foreign_key "news", "users", on_delete: :cascade
end
