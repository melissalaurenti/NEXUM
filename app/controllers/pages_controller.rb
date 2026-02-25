class PagesController < ApplicationController
  def home
    @cities = %w[Rome Berlin Paris Madrid London Vienna]
  end
end
