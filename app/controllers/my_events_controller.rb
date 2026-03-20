class MyEventsController < ApplicationController
  before_action :authenticate_user!

  def index
    now = Time.current

    @upcoming = current_user.attendances
      .includes(event: [:interests, :city])
      .where(status: "attending")
      .joins(:event)
      .where("events.starts_at > ?", now)
      .order("events.starts_at ASC")

    @past = current_user.attendances
      .includes(event: [:interests, :city])
      .where(status: "attending")
      .joins(:event)
      .where("events.starts_at <= ?", now)
      .order("events.starts_at DESC")

    @saved = current_user.attendances
      .includes(event: [:interests, :city])
      .where(status: "saved")
      .joins(:event)
      .order("events.starts_at ASC")

    @calendar_dates = (@upcoming + @past).map { |a| a.event.starts_at.to_date.iso8601 }.uniq
  end
end
