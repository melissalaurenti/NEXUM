class CitiesController < ApplicationController
  skip_before_action :authenticate_user!, raise: false

  def index
    cities = City.order(:name)
    render json: cities.map { |c| { id: c.id, name: c.name, country_code: c.country_code } }
  end

  def search
    query = params[:q].to_s.strip
    cities = if query.length >= 2
               City.where("name ILIKE ?", "#{query}%").order(:name).limit(10)
             else
               []
             end
    render json: cities.map { |c| { id: c.id, name: c.name, country_code: c.country_code } }
  end
end
