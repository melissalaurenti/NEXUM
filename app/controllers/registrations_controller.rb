class RegistrationsController < Devise::RegistrationsController
  before_action :configure_sign_up_params, only: [:create]

  def create
    super do |resource|
      if resource.persisted? && params[:interest_names].present?
        params[:interest_names].each do |name|
          next if name.blank?
          interest = Interest.find_or_create_by(name: name)
          resource.interests << interest unless resource.interests.include?(interest)
        end
      end
    end
  end

  protected

  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :birthday])
  end

  def after_sign_up_path_for(resource)
    profile_path
  end
end
