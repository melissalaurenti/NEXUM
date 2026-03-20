class AttendancesController < ApplicationController
  before_action :authenticate_user!

  def create
    event = Event.find(params[:event_id])
    status = params[:status].presence_in(%w[attending saved]) || "attending"
    attendance = current_user.attendances.find_or_initialize_by(event: event)
    attendance.status = status

    if attendance.save
      render json: { success: true, status: attendance.status, id: attendance.id }
    else
      render json: { success: false, errors: attendance.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    attendance = current_user.attendances.find(params[:id])
    attendance.destroy
    render json: { success: true }
  end
end
