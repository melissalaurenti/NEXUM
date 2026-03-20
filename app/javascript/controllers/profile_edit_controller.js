import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["modal", "interestsModal"]

  open() {
    this.modalTarget.classList.remove("hidden")
  }

  close() {
    this.modalTarget.classList.add("hidden")
  }

  openInterests() {
    this.interestsModalTarget.classList.remove("hidden")
  }

  closeInterests() {
    this.interestsModalTarget.classList.add("hidden")
  }

  stopPropagation(event) {
    event.stopPropagation()
  }
}
