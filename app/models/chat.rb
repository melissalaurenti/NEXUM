class Chat < ApplicationRecord
  belongs_to :event

  has_many :chat_memberships, dependent: :destroy
  has_many :users, through: :chat_memberships
  has_many :messages, dependent: :destroy
end
