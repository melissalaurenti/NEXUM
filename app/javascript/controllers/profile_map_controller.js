import { Controller } from "@hotwired/stimulus"

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

// Connects to data-controller="profile-map"
export default class extends Controller {
  static values = { city: String }

  connect() {
    const coords = CITY_COORDS[this.cityValue] || [48, 15]
    const zoom = CITY_COORDS[this.cityValue] ? 11 : 4

    this.map = L.map(this.element, {
      zoomControl: true,
      scrollWheelZoom: false,
      dragging: true
    }).setView(coords, zoom)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map)

    if (CITY_COORDS[this.cityValue]) {
      L.circleMarker(coords, {
        radius: 8,
        fillColor: "#B1778D",
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      })
        .addTo(this.map)
        .bindTooltip(this.cityValue, { permanent: true, direction: "top", offset: [0, -8] })
    }
  }

  disconnect() {
    if (this.map) {
      this.map.remove()
    }
  }
}
