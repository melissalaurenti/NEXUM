import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["monthLabel", "calendarGrid"]
  static values  = { dates: Array }

  connect() {
    this._current = new Date()
    this._current.setDate(1)
    this._renderCalendar()
  }

  prevMonth() {
    this._current.setMonth(this._current.getMonth() - 1)
    this._renderCalendar()
  }

  nextMonth() {
    this._current.setMonth(this._current.getMonth() + 1)
    this._renderCalendar()
  }

  _renderCalendar() {
    const year  = this._current.getFullYear()
    const month = this._current.getMonth()

    this.monthLabelTarget.textContent = new Date(year, month, 1)
      .toLocaleDateString("en", { month: "long", year: "numeric" })

    const eventDates = new Set(this.datesValue)
    const firstWeekday = new Date(year, month, 1).getDay()
    const offset = firstWeekday === 0 ? 6 : firstWeekday - 1
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const today = new Date()

    let html = ""

    for (let i = 0; i < offset; i++) {
      html += `<div></div>`
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const isToday   = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
      const hasEvent  = eventDates.has(dateStr)

      let dayClass = "relative flex flex-col items-center justify-center h-8 w-8 mx-auto rounded-full text-sm"
      let dotHtml  = ""

      if (isToday) {
        dayClass += " bg-black text-white font-bold"
      } else if (hasEvent) {
        dayClass += " font-semibold text-gray-900"
        dotHtml = `<span class="absolute bottom-0.5 h-1.5 w-1.5 rounded-full" style="background: var(--um-primary);"></span>`
      } else {
        dayClass += " text-gray-400"
      }

      html += `<div class="text-center py-0.5"><div class="${dayClass}">${day}${dotHtml}</div></div>`
    }

    this.calendarGridTarget.innerHTML = html
  }

  async removeAttendance(event) {
    const btn = event.currentTarget
    const id  = btn.dataset.attendanceId
    const card = btn.closest("[data-attendance-id]")?.parentElement?.parentElement

    const csrf = document.querySelector('meta[name="csrf-token"]')?.content

    try {
      const res = await fetch(`/attendances/${id}`, {
        method: "DELETE",
        headers: {
          "X-CSRF-Token": csrf,
          "Accept": "application/json"
        }
      })

      if (res.ok) {
        // Find and remove the card element
        const cardEl = btn.closest(".bg-white.rounded-2xl")
        if (cardEl) {
          cardEl.style.transition = "opacity 0.3s"
          cardEl.style.opacity = "0"
          setTimeout(() => cardEl.remove(), 300)
        }
      }
    } catch (_) {
      // silently fail
    }
  }
}
