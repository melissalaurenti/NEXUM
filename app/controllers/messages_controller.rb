class MessagesController < ApplicationController
  before_action :authenticate_user!

  def create
    chat = Chat.find(params[:chat_id])

    unless chat.event.attendances.attending.exists?(user: current_user)
      return render json: { error: "Not authorized" }, status: :forbidden
    end

    message = chat.messages.build(body: params[:body].to_s.strip, user: current_user)

    if message.body.present? && message.save
      ChatChannel.broadcast_to(chat, {
        html: render_to_string(partial: "messages/message", locals: { message: message }, formats: [:html])
      })
      render json: { success: true }
    else
      render json: { success: false }, status: :unprocessable_entity
    end
  end
end
