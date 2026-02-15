class Interest < ApplicationRecord
  has_many :user_interests, dependent: :destroy
  has_many :users, through: :user_interests
  has_many :event_interests, dependent: :destroy
  has_many :events, through: :event_interests

  validates :name, presence: true, uniqueness: { case_sensitive: false }
end
