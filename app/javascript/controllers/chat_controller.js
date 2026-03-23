import { Controller } from "@hotwired/stimulus"
import consumer from "channels/consumer"

export default class extends Controller {
  static targets = ["messages", "input", "form"]
  static values = { chatId: Number, messagesUrl: String }

  connect() {
    this.subscription = consumer.subscriptions.create(
      { channel: "ChatChannel", chat_id: this.chatIdValue },
      { received: (data) => this.#handleReceive(data) }
    )
    this.#scrollToBottom()
  }

  disconnect() {
    this.subscription?.unsubscribe()
  }

  async submit(event) {
    event.preventDefault()
    const body = this.inputTarget.value.trim()
    if (!body) return

    await fetch(this.messagesUrlValue, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
      },
      body: new URLSearchParams({ body })
    })

    this.inputTarget.value = ""
  }

  #handleReceive(data) {
    const empty = this.messagesTarget.querySelector("[data-empty]")
    if (empty) empty.remove()
    this.messagesTarget.insertAdjacentHTML("beforeend", data.html)
    this.#scrollToBottom()
  }

  #scrollToBottom() {
    this.messagesTarget.scrollTop = this.messagesTarget.scrollHeight
  }
}
