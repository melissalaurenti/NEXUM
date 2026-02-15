class AddUniqueIndexesToJoins < ActiveRecord::Migration[7.1]
  def change
    add_index :user_interests, [ :user_id, :interest_id], unique: true
    add_index :event_interests, [:event_id, :interest_id], unique: true
    add_index :chat_memberships, [:chat_id, :user_id], unique: true
    add_index :attendances, [:user_id, :event_id], unique: true
    add_index :chats, :event_id, unique: true
  end
end
