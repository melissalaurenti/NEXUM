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

ActiveRecord::Schema[7.1].define(version: 2026_02_10_165614) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "attendances", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "event_id", null: false
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_id"], name: "index_attendances_on_event_id"
    t.index ["user_id", "event_id"], name: "index_attendances_on_user_id_and_event_id", unique: true
    t.index ["user_id"], name: "index_attendances_on_user_id"
  end

  create_table "chat_memberships", force: :cascade do |t|
    t.bigint "chat_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["chat_id", "user_id"], name: "index_chat_memberships_on_chat_id_and_user_id", unique: true
    t.index ["chat_id"], name: "index_chat_memberships_on_chat_id"
    t.index ["user_id"], name: "index_chat_memberships_on_user_id"
  end

  create_table "chats", force: :cascade do |t|
    t.bigint "event_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_id"], name: "index_chats_on_event_id"
  end

  create_table "cities", force: :cascade do |t|
    t.string "name"
    t.string "country_code"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "event_interests", force: :cascade do |t|
    t.bigint "event_id", null: false
    t.bigint "interest_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_id", "interest_id"], name: "index_event_interests_on_event_id_and_interest_id", unique: true
    t.index ["event_id"], name: "index_event_interests_on_event_id"
    t.index ["interest_id"], name: "index_event_interests_on_interest_id"
  end

  create_table "events", force: :cascade do |t|
    t.bigint "city_id", null: false
    t.bigint "host_id", null: false
    t.string "title"
    t.text "description"
    t.string "address"
    t.string "status"
    t.integer "capacity"
    t.datetime "starts_at"
    t.datetime "ends_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["city_id"], name: "index_events_on_city_id"
    t.index ["host_id"], name: "index_events_on_host_id"
  end

  create_table "interests", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "messages", force: :cascade do |t|
    t.bigint "chat_id", null: false
    t.bigint "user_id", null: false
    t.text "body"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["chat_id"], name: "index_messages_on_chat_id"
    t.index ["user_id"], name: "index_messages_on_user_id"
  end

  create_table "user_interests", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "interest_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["interest_id"], name: "index_user_interests_on_interest_id"
    t.index ["user_id", "interest_id"], name: "index_user_interests_on_user_id_and_interest_id", unique: true
    t.index ["user_id"], name: "index_user_interests_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "name"
    t.text "bio"
    t.string "avatar_url"
    t.string "language"
    t.date "birthday"
    t.bigint "city_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["city_id"], name: "index_users_on_city_id"
  end

  add_foreign_key "attendances", "events"
  add_foreign_key "attendances", "users"
  add_foreign_key "chat_memberships", "chats"
  add_foreign_key "chat_memberships", "users"
  add_foreign_key "chats", "events"
  add_foreign_key "event_interests", "events"
  add_foreign_key "event_interests", "interests"
  add_foreign_key "events", "cities"
  add_foreign_key "events", "users", column: "host_id"
  add_foreign_key "messages", "chats"
  add_foreign_key "messages", "users"
  add_foreign_key "user_interests", "interests"
  add_foreign_key "user_interests", "users"
  add_foreign_key "users", "cities"
end
