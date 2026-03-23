class EventsController < ApplicationController
  skip_before_action :authenticate_user!, raise: false

  def index
    @city = City.find_by(id: params[:city_id])
    @events = if @city
      Event.where(city: @city, status: "published")
           .where("starts_at > ?", Time.current)
           .order(:starts_at)
           .includes(:interests, :attendances, :host)
    else
      Event.none
    end
  end

  def show
    @event = Event.includes(:interests, :attendances, :host, :city, :chat).find(params[:id])
    @attendance = current_user&.attendances&.find_by(event: @event)
    @messages = @event.chat ? @event.chat.messages.includes(:user).order(:created_at) : []
  end
end
