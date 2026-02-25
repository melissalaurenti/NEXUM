# frozen_string_literal: true

class AddDeviseToUsers < ActiveRecord::Migration[7.1]
  def up
    change_table :users, bulk: true do |t|
      ## Database authenticatable
      # email exists already (created in create_users migration)
      # t.string :email, null: false, default: ""

      t.string :encrypted_password, null: false, default: ""

      ## Recoverable
      t.string   :reset_password_token
      t.datetime :reset_password_sent_at

      ## Rememberable
      t.datetime :remember_created_at

      ## Trackable (optional, currently not used)
      # t.integer  :sign_in_count, default: 0, null: false
      # t.datetime :current_sign_in_at
      # t.datetime :last_sign_in_at
      # t.string   :current_sign_in_ip
      # t.string   :last_sign_in_ip
    end

    add_index :users, :email, unique: true unless index_exists?(:users, :email, unique: true)
    add_index :users, :reset_password_token, unique: true unless index_exists?(:users, :reset_password_token, unique: true)
  end

  def down
    remove_index :users, column: :email if index_exists?(:users, :email)
    remove_index :users, column: :reset_password_token if index_exists?(:users, :reset_password_token)

    change_table :users, bulk: true do |t|
      t.remove :encrypted_password,
               :reset_password_token,
               :reset_password_sent_at,
               :remember_created_at
    end
  end
end
