class ChatChannel < ApplicationCable::Channel
  def subscribed
    chat = Chat.find_by(id: params[:chat_id])
    if chat && chat.event.attendances.attending.exists?(user: current_user)
      chat.chat_memberships.find_or_create_by(user: current_user)
      stream_for chat
    else
      reject
    end
  end

  def unsubscribed; end
end
