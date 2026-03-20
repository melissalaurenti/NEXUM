import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["dropdown", "pills", "counter", "inputs", "flagMap"]

  connect() {
    this.flagMap = JSON.parse(this.flagMapTarget.textContent)

    // Build initial selected set from pre-rendered hidden inputs
    this.selected = new Map()
    this.inputsTarget.querySelectorAll("input[type=hidden]").forEach(input => {
      const lang = input.dataset.lang
      const flag = input.dataset.flag
      if (lang) this.selected.set(lang, flag)
    })

    this.renderPills()
    this.updateCounter()

    // Highlight pre-selected items after DOM is ready
    setTimeout(() => this.updateDropdownItems(), 0)

    this._outsideClick = (e) => {
      if (!this.element.contains(e.target)) this.closeDropdown()
    }
    document.addEventListener("click", this._outsideClick)
  }

  disconnect() {
    document.removeEventListener("click", this._outsideClick)
  }

  toggleDropdown(event) {
    event.stopPropagation()
    this.dropdownTarget.classList.toggle("hidden")
  }

  closeDropdown() {
    this.dropdownTarget.classList.add("hidden")
  }

  pick(event) {
    event.stopPropagation()
    const lang = event.params.lang
    const flag = event.params.flag

    if (this.selected.has(lang)) {
      this.selected.delete(lang)
    } else {
      if (this.selected.size >= 10) return
      this.selected.set(lang, flag)
    }

    this.renderPills()
    this.updateHiddenInputs()
    this.updateCounter()
    this.updateDropdownItems()
  }

  remove(event) {
    const lang = event.currentTarget.dataset.lang
    this.selected.delete(lang)
    this.renderPills()
    this.updateHiddenInputs()
    this.updateCounter()
    this.updateDropdownItems()
  }

  renderPills() {
    this.pillsTarget.innerHTML = ""
    this.selected.forEach((flag, lang) => {
      const pill = document.createElement("span")
      pill.className = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
      pill.style = "background: rgba(177,119,141,.15); color: var(--um-primary);"
      pill.innerHTML = `
        ${flag} ${lang}
        <button type="button" data-lang="${lang}"
                style="margin-left:2px; opacity:0.6; font-size:0.85em; line-height:1; background:none; border:none; cursor:pointer; color:inherit;"
                aria-label="Remove ${lang}">×</button>
      `
      pill.querySelector("button").addEventListener("click", this.remove.bind(this))
      this.pillsTarget.appendChild(pill)
    })
  }

  updateHiddenInputs() {
    // Remove old hidden inputs, keep flagMap script tag
    this.inputsTarget.querySelectorAll("input[type=hidden]").forEach(el => el.remove())

    this.selected.forEach((flag, lang) => {
      const input = document.createElement("input")
      input.type = "hidden"
      input.name = "user[languages][]"
      input.value = lang
      input.dataset.lang = lang
      input.dataset.flag = flag
      this.inputsTarget.prepend(input)
    })
  }

  updateCounter() {
    this.counterTarget.textContent = `${this.selected.size}/10 selected`
  }

  updateDropdownItems() {
    this.dropdownTarget.querySelectorAll("button[data-languages-select-lang-param]").forEach(btn => {
      const lang = btn.dataset.languagesSelectLangParam
      if (this.selected.has(lang)) {
        btn.style.background = "rgba(177,119,141,.12)"
        btn.style.fontWeight = "600"
      } else {
        btn.style.background = ""
        btn.style.fontWeight = ""
      }
    })
  }
}
