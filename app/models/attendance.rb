class Attendance < ApplicationRecord
  belongs_to :user
  belongs_to :event

  enum :status, { attending: "attending", saved: "saved" }

  validates :user_id, uniqueness: { scope: :event_id }
end
