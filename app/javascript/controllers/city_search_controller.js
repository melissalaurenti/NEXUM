import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="city-search"
export default class extends Controller {
  static targets = ["input", "dropdown"]

  search() {
    const q = this.inputTarget.value.trim()

    if (q.length < 2) {
      this.dropdownTarget.innerHTML = ""
      this.dropdownTarget.classList.add("hidden")
      this.#clearSelection()
      return
    }

    fetch(`/cities/search?q=${encodeURIComponent(q)}`)
      .then(r => r.json())
      .then(cities => {
        if (cities.length === 0) {
          this.dropdownTarget.innerHTML = ""
          this.dropdownTarget.classList.add("hidden")
          return
        }

        this.dropdownTarget.innerHTML = cities.map(c =>
          `<li class="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm flex justify-between items-center"
               data-city-id="${c.id}"
               data-city-name="${c.name}"
               data-action="click->city-search#select">
            <span>${c.name}</span>
            <span class="text-gray-400 text-xs">${c.country_code}</span>
          </li>`
        ).join("")

        this.dropdownTarget.classList.remove("hidden")
      })
  }

  select(event) {
    const li = event.currentTarget
    const cityId = li.dataset.cityId
    const cityName = li.dataset.cityName

    this.inputTarget.value = cityName
    this.dropdownTarget.classList.add("hidden")

    // Set city_id in the registration form hidden field
    const hiddenField = document.querySelector('[name="user[city_id]"]')
    if (hiddenField) hiddenField.value = cityId

    // Enable the Join button
    const joinBtn = document.querySelector('[data-modal-target="joinBtn"]')
    if (joinBtn) {
      joinBtn.disabled = false
      joinBtn.classList.remove("cursor-not-allowed", "opacity-40")
      joinBtn.classList.add("cursor-pointer")
    }
  }

  #clearSelection() {
    const hiddenField = document.querySelector('[name="user[city_id]"]')
    if (hiddenField) hiddenField.value = ""

    const joinBtn = document.querySelector('[data-modal-target="joinBtn"]')
    if (joinBtn) {
      joinBtn.disabled = true
      joinBtn.classList.add("cursor-not-allowed", "opacity-40")
      joinBtn.classList.remove("cursor-pointer")
    }
  }
}
