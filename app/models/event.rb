class Event < ApplicationRecord
  belongs_to :city
  belongs_to :host, class_name: "User"

  has_many :attendances, dependent: :destroy
  has_many :users, through: :attendances
  has_many :event_interests, dependent: :destroy
  has_many :interests, through: :event_interests
  has_one :chat, dependent: :destroy

  after_create :create_event_chat

  private

  def create_event_chat
    create_chat!
  end
end
