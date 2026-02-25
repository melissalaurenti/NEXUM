import { Controller } from "@hotwired/stimulus"

// Coordinates for European capitals (keyed by city name)
const CITY_COORDS = {
  "Andorra la Vella": [42.5063, 1.5218],
  "Vienna":           [48.2082, 16.3738],
  "Brussels":         [50.8503, 4.3517],
  "Sarajevo":         [43.8564, 18.4131],
  "Sofia":            [42.6977, 23.3219],
  "Minsk":            [53.9045, 27.5615],
  "Bern":             [46.9480, 7.4474],
  "Nicosia":          [35.1856, 33.3823],
  "Prague":           [50.0755, 14.4378],
  "Berlin":           [52.5200, 13.4050],
  "Copenhagen":       [55.6761, 12.5683],
  "Tallinn":          [59.4370, 24.7536],
  "Madrid":           [40.4168, -3.7038],
  "Helsinki":         [60.1699, 24.9384],
  "Paris":            [48.8566, 2.3522],
  "London":           [51.5074, -0.1278],
  "Athens":           [37.9838, 23.7275],
  "Zagreb":           [45.8150, 15.9819],
  "Budapest":         [47.4979, 19.0402],
  "Dublin":           [53.3498, -6.2603],
  "Reykjavik":        [64.1355, -21.8954],
  "Rome":             [41.9028, 12.4964],
  "Vaduz":            [47.1410, 9.5215],
  "Vilnius":          [54.6872, 25.2797],
  "Luxembourg":       [49.6116, 6.1319],
  "Riga":             [56.9496, 24.1052],
  "Monaco":           [43.7384, 7.4246],
  "Chisinau":         [47.0105, 28.8638],
  "Podgorica":        [42.4304, 19.2594],
  "Skopje":           [41.9973, 21.4280],
  "Valletta":         [35.8997, 14.5147],
  "Amsterdam":        [52.3676, 4.9041],
  "Oslo":             [59.9139, 10.7522],
  "Warsaw":           [52.2297, 21.0122],
  "Lisbon":           [38.7169, -9.1399],
  "Bucharest":        [44.4268, 26.1025],
  "Belgrade":         [44.7866, 20.4489],
  "Stockholm":        [59.3293, 18.0686],
  "Ljubljana":        [46.0569, 14.5058],
  "Bratislava":       [48.1486, 17.1077],
  "San Marino":       [43.9424, 12.4578],
  "Kyiv":             [50.4501, 30.5234],
  "Vatican City":     [41.9029, 12.4534],
  "Tirana":           [41.3275, 19.8187]
}

// Connects to data-controller="city-map"
export default class extends Controller {
  static targets = ["map", "cityFooter", "cityName", "searchInput", "suggestions"]

  connect() {
    this.initMap()
  }

  initMap() {
    this.map = L.map(this.mapTarget).setView([48, 15], 4)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map)

    this.marker = null

    this.map.on("click", (event) => {
      this.handleMapClick(event.latlng)
    })

    this.loadCityMarkers()
  }

  loadCityMarkers() {
    fetch("/cities")
      .then(r => r.json())
      .then(cities => {
        cities.forEach(city => {
          const coords = CITY_COORDS[city.name]
          if (!coords) return

          const dot = L.circleMarker(coords, {
            radius: 6,
            fillColor: "#5F7367",
            color: "#fff",
            weight: 1.5,
            opacity: 1,
            fillOpacity: 0.9
          }).addTo(this.map)

          dot.bindTooltip(city.name, { direction: "top", offset: [0, -6] })

          dot.on("click", (e) => {
            L.DomEvent.stopPropagation(e)
            this.selectCity(city, coords)
          })
        })
      })
  }

  selectCity(city, coords) {
    if (this.marker) this.marker.remove()
    this.marker = L.marker(coords).addTo(this.map)
    this.map.setView(coords, 9)

    const hiddenField = document.querySelector('[name="user[city_id]"]')
    if (hiddenField) hiddenField.value = city.id

    this.cityNameTarget.textContent = `${city.name}, ${city.country_code}`
    this.cityFooterTarget.classList.remove("hidden")

    const joinBtn = this.element.querySelector('[data-modal-target="joinBtn"]')
    if (joinBtn) {
      joinBtn.disabled = false
      joinBtn.classList.remove("cursor-not-allowed", "opacity-40")
      joinBtn.classList.add("cursor-pointer")
    }
  }

  handleMapClick(latlng) {
    if (this.marker) this.marker.remove()
    this.marker = L.marker(latlng).addTo(this.map)

    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`)
      .then(r => r.json())
      .then(data => {
        if (!data.address) return
        const cityName = data.address.city || data.address.town || data.address.village || data.address.state
        if (!cityName) return
        this.findCity(cityName)
      })
  }

  findCity(name) {
    fetch(`/cities/search?q=${encodeURIComponent(name)}`)
      .then(r => r.json())
      .then(cities => {
        if (!cities.length) return
        const city = cities[0]
        const coords = CITY_COORDS[city.name] || [this.marker.getLatLng().lat, this.marker.getLatLng().lng]
        this.selectCity(city, coords)
      })
  }

  search() {
    clearTimeout(this._searchTimeout)
    this._searchTimeout = setTimeout(() => {
      const q = this.searchInputTarget.value.trim()
      if (q.length < 2) {
        this.suggestionsTarget.classList.add("hidden")
        this.suggestionsTarget.innerHTML = ""
        return
      }

      fetch(`/cities/search?q=${encodeURIComponent(q)}`)
        .then(r => r.json())
        .then(cities => {
          if (!cities.length) {
            this.suggestionsTarget.classList.add("hidden")
            this.suggestionsTarget.innerHTML = ""
            return
          }

          this.suggestionsTarget.innerHTML = cities.map(city =>
            `<button type="button"
                     class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 transition"
                     data-city-id="${city.id}"
                     data-city-name="${city.name}"
                     data-country="${city.country_code}">
               ${city.name}, ${city.country_code}
             </button>`
          ).join("")
          this.suggestionsTarget.classList.remove("hidden")

          this.suggestionsTarget.querySelectorAll("button").forEach(btn => {
            btn.addEventListener("click", () => {
              this.selectCityFromSearch({
                id: btn.dataset.cityId,
                name: btn.dataset.cityName,
                country_code: btn.dataset.country
              })
            })
          })
        })
    }, 300)
  }

  selectCityFromSearch(city) {
    this.suggestionsTarget.classList.add("hidden")
    this.searchInputTarget.value = `${city.name}, ${city.country_code}`

    const known = CITY_COORDS[city.name]
    if (known) {
      this.selectCity(city, known)
      return
    }

    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city.name)}&format=json&limit=1`)
      .then(r => r.json())
      .then(results => {
        if (!results.length) return
        const coords = [parseFloat(results[0].lat), parseFloat(results[0].lon)]
        this.selectCity(city, coords)
      })
  }

  backToMap() {
    this.cityFooterTarget.classList.add("hidden")

    if (this.marker) {
      this.marker.remove()
      this.marker = null
    }

    this.searchInputTarget.value = ""
    this.suggestionsTarget.classList.add("hidden")
    this.suggestionsTarget.innerHTML = ""

    const hiddenField = document.querySelector('[name="user[city_id]"]')
    if (hiddenField) hiddenField.value = ""

    const joinBtn = this.element.querySelector('[data-modal-target="joinBtn"]')
    if (joinBtn) {
      joinBtn.disabled = true
      joinBtn.classList.add("cursor-not-allowed", "opacity-40")
      joinBtn.classList.remove("cursor-pointer")
    }
  }
}
