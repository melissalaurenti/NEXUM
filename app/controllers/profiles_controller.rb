class ProfilesController < ApplicationController
  before_action :authenticate_user!

  def show
    @user = current_user
  end

  def update
    @user = current_user
    if @user.update(profile_params)
      redirect_to profile_path, notice: "Profile updated successfully."
    else
      @user = current_user
      flash[:alert] = @user.errors.full_messages.to_sentence
      redirect_to profile_path
    end
  end

  def update_interests
    @user = current_user
    interest_names = Array(params[:interest_names]).reject(&:blank?)
    @user.interests = interest_names.map { |name| Interest.find_or_create_by!(name: name) }
    redirect_to profile_path, notice: "Interests updated."
  end

  private

  def profile_params
    params.require(:user).permit(:name, :bio, :birthday, :profile_picture, :avatar_url, languages: [])
  end
end
