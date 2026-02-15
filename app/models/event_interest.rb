class EventInterest < ApplicationRecord
  belongs_to :event
  belongs_to :interest

  validates :event_id, uniqueness: { scope: :interest_id }
end
