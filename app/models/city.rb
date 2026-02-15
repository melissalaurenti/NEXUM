class City < ApplicationRecord
  has_many :users, dependent: :nullify
  has_many :events, dependent: :nullify
end
