import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "dropdown"]
  static values = { navigateTo: String }

  #selectedCityId = null

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
    this.#selectedCityId = cityId

    if (this.hasNavigateToValue && this.navigateToValue) return

    const hiddenField = document.querySelector('[name="user[city_id]"]')
    if (hiddenField) hiddenField.value = cityId

    const joinBtn = document.querySelector('[data-modal-target="joinBtn"]')
    if (joinBtn) {
      joinBtn.disabled = false
      joinBtn.classList.remove("cursor-not-allowed", "opacity-40")
      joinBtn.classList.add("cursor-pointer")
    }
  }

  navigate() {
    if (!this.#selectedCityId) return
    window.location.href = `${this.navigateToValue}?city_id=${this.#selectedCityId}`
  }

  #clearSelection() {
    this.#selectedCityId = null

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
