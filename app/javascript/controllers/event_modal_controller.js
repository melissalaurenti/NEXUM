import { Controller } from "@hotwired/stimulus"

const CITY_COORDS = {
  "Rome":     [41.9028, 12.4964],
  "Berlin":   [52.5200, 13.4050],
  "Paris":    [48.8566, 2.3522],
  "Madrid":   [40.4168, -3.7038],
  "London":   [51.5074, -0.1278],
  "Vienna":   [48.2082, 16.3738],
  "Amsterdam":[52.3676, 4.9041],
  "Lisbon":   [38.7169, -9.1399],
  "Prague":   [50.0755, 14.4378],
  "Warsaw":   [52.2297, 21.0122],
  "Budapest": [47.4979, 19.0402],
  "Athens":   [37.9838, 23.7275],
  "Dublin":   [53.3498, -6.2603],
  "Stockholm":[59.3293, 18.0686],
  "Brussels": [50.8503, 4.3517],
  "Oslo":     [59.9139, 10.7522],
  "Helsinki": [60.1699, 24.9384],
  "Copenhagen":[55.6761, 12.5683],
  "Zurich":   [47.3769, 8.5417]
}

export default class extends Controller {
  static targets = ["modal", "loginModal", "title", "date", "address", "description", "spots", "host", "tags", "map", "image"]
  static values  = { signedIn: Boolean }

  connect() {
    const pending = sessionStorage.getItem("nexum_pending_event")
    if (pending) {
      sessionStorage.removeItem("nexum_pending_event")
      try {
        const d = JSON.parse(pending)
        this._currentEventData = { ...d }
        this._currentEventId = d.eventId
        this._populateModal(d)
        this.modalTarget.classList.remove("hidden")
        document.body.classList.add("overflow-hidden")
        this._initMap(d.eventAddress, d.eventCity)
      } catch (_) {}
    }
  }

  open(event) {
    const card = event.currentTarget
    const d = card.dataset
    this._currentEventData = { ...d }
    this._currentEventId = d.eventId
    this._populateModal(d)
    this.modalTarget.classList.remove("hidden")
    document.body.classList.add("overflow-hidden")
    this._initMap(d.eventAddress, d.eventCity)
  }

  _populateModal(d) {
    this.titleTarget.textContent = d.eventTitle
    this.dateTarget.textContent = d.eventDate + (d.eventEnds ? ` – ${d.eventEnds}` : "")
    this.addressTarget.textContent = d.eventAddress
    this.descriptionTarget.textContent = d.eventDescription || "No description available."
    this.spotsTarget.textContent = `${d.eventAttendees} / ${d.eventCapacity} attending`
    this.hostTarget.textContent = `Hosted by ${d.eventHost}`
    this.imageTarget.src = d.eventImage || ""
    this.imageTarget.alt = d.eventTitle

    let tags = []
    try { tags = JSON.parse(d.eventTags || "[]") } catch (_) {}
    this.tagsTarget.innerHTML = tags.map(t =>
      `<span class="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">${t}</span>`
    ).join("")
  }

  close() {
    this.modalTarget.classList.add("hidden")
    document.body.classList.remove("overflow-hidden")
    if (this._map) {
      this._map.remove()
      this._map = null
    }
  }

  async joinNow(event) {
    event.stopPropagation()
    if (!this.signedInValue) { this._openLogin(); return }
    const btn = event.currentTarget
    await this._postAttendance("attending", btn, "Going!", "Join Now")
  }

  async saveForLater(event) {
    event.stopPropagation()
    if (!this.signedInValue) { this._openLogin(); return }
    const btn = event.currentTarget
    await this._postAttendance("saved", btn, "Saved!", "Save for Later")
  }

  async _postAttendance(status, btn, successLabel, resetLabel) {
    if (!this._currentEventId) return
    const csrf = document.querySelector('meta[name="csrf-token"]')?.content

    btn.disabled = true
    btn.textContent = "..."

    try {
      const res = await fetch("/attendances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrf,
          "Accept": "application/json"
        },
        body: JSON.stringify({ event_id: this._currentEventId, status })
      })

      if (res.ok) {
        btn.textContent = successLabel
        setTimeout(() => {
          btn.disabled = false
          btn.textContent = resetLabel
        }, 2000)
      } else {
        btn.disabled = false
        btn.textContent = resetLabel
      }
    } catch (_) {
      btn.disabled = false
      btn.textContent = resetLabel
    }
  }

  _openLogin() {
    // Save current event data so we can reopen the modal after login redirect
    sessionStorage.setItem("nexum_pending_event", JSON.stringify(this._currentEventData))

    // Set the return URL on the login form so Devise redirects back here
    const form = this.loginModalTarget.querySelector("form")
    let input = form.querySelector("input[name='return_to']")
    if (!input) {
      input = document.createElement("input")
      input.type = "hidden"
      input.name = "return_to"
      form.appendChild(input)
    }
    input.value = window.location.href

    // Show login modal on top — event modal stays visible behind it
    this.loginModalTarget.classList.remove("hidden")
  }

  closeLogin() {
    this.loginModalTarget.classList.add("hidden")
    // Event modal remains open underneath — do not remove overflow-hidden
  }

  stopPropagation(event) {
    event.stopPropagation()
  }

  async _initMap(address, city) {
    if (this._map) {
      this._map.remove()
      this._map = null
    }

    const mapEl = this.mapTarget
    let coords = CITY_COORDS[city] || [48.2, 16.4]
    let zoom = 15

    // Geocode the address via Nominatim
    try {
      const query = encodeURIComponent(`${address}, ${city}`)
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
        { headers: { "Accept-Language": "en" } }
      )
      const data = await res.json()
      if (data.length > 0) {
        coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)]
      } else {
        zoom = 13
      }
    } catch (_) {
      zoom = 13
    }

    this._map = L.map(mapEl, {
      zoomControl: true,
      scrollWheelZoom: false,
      dragging: true
    }).setView(coords, zoom)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this._map)

    L.circleMarker(coords, {
      radius: 10,
      fillColor: "#B1778D",
      color: "#fff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9
    })
      .addTo(this._map)
      .bindPopup(`<strong>${address}</strong>`)
      .openPopup()
  }
}
