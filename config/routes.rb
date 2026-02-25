Rails.application.routes.draw do
  get 'profiles/show'
  devise_for :users, controllers: { registrations: "registrations" }

  get "cities/search", to: "cities#search"
  get "cities", to: "cities#index"
  get "profile", to: "profiles#show"

  get "pages/home"
  root "pages#home"

  get "up" => "rails/health#show", as: :rails_health_check
end
