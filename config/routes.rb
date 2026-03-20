Rails.application.routes.draw do
  get 'profiles/show'
  devise_for :users, controllers: { registrations: "registrations" }

  get "cities/search", to: "cities#search"
  get "cities", to: "cities#index"
  resources :events, only: [:index]
  resources :attendances, only: [:create, :destroy]
  get "my_events", to: "my_events#index", as: :my_events
  get "profile", to: "profiles#show"
  patch "profile", to: "profiles#update"
  patch "profile/interests", to: "profiles#update_interests", as: :profile_interests

  get "pages/home"
  root "pages#home"

  get "up" => "rails/health#show", as: :rails_health_check
end
