class ChatMembership < ApplicationRecord
  belongs_to :chat
  belongs_to :user

  validates :chat_id, uniqueness: { scope: :user_id }
end
