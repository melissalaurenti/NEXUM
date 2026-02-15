class User < ApplicationRecord
  belongs_to :city, optional: true

  has_many :hosted_events, class_name: "Event", foreign_key: :host_id, dependent: :nullify
  has_many :user_interests, dependent: :destroy
  has_many :interests, through: :user_interests
  has_many :attendances, dependent: :destroy
  has_many :attended_events, through: :attendances, source: :event
  has_many :chat_memberships, dependent: :destroy
  has_many :chats, through: :chat_memberships
  has_many :messages, dependent: :destroy
  has_one_attached :profile_picture
end
