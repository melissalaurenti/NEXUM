class PagesController < ApplicationController
  def home
    @cities = City.where(name: %w[Rome Berlin Paris Madrid London Vienna]).index_by(&:name).values_at("Rome", "Berlin", "Paris", "Madrid", "London", "Vienna").compact
    @highlights = Event.where(status: "published")
                       .where("starts_at > ?", Time.current)
                       .order(:starts_at)
                       .includes(:interests, :attendances, :host, :city)
                       .limit(3)
  end
end
