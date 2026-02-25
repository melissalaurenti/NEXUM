import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="modal"
export default class extends Controller {
  static targets = [
    "loginModal", "forgotModal", "getStartedModal", "interestsModal", "cityModal", "avatarModal",
    "nextStepBtn", "cityIdField", "joinBtn",
    "createAccountBtn", "regName", "regEmail", "regPassword", "regConfirm", "passwordError",
    "avatarUrlField", "avatarOption", "uploadArea", "uploadPreview", "uploadPlaceholder", "profilePictureInput"
  ]

  openLogin(event) {
    event.preventDefault()
    this.forgotModalTarget.classList.add("hidden")
    this.getStartedModalTarget.classList.add("hidden")
    this.interestsModalTarget.classList.add("hidden")
    this.cityModalTarget.classList.add("hidden")
    this.avatarModalTarget.classList.add("hidden")
    this.loginModalTarget.classList.remove("hidden")
  }

  openForgot(event) {
    event.preventDefault()
    this.loginModalTarget.classList.add("hidden")
    this.getStartedModalTarget.classList.add("hidden")
    this.interestsModalTarget.classList.add("hidden")
    this.cityModalTarget.classList.add("hidden")
    this.avatarModalTarget.classList.add("hidden")
    this.forgotModalTarget.classList.remove("hidden")
  }

  openGetStarted(event) {
    event.preventDefault()
    this.loginModalTarget.classList.add("hidden")
    this.forgotModalTarget.classList.add("hidden")
    this.interestsModalTarget.classList.add("hidden")
    this.cityModalTarget.classList.add("hidden")
    this.avatarModalTarget.classList.add("hidden")
    this.getStartedModalTarget.classList.remove("hidden")
  }

  openAvatar(event) {
    event.preventDefault()
    this.cityModalTarget.classList.add("hidden")
    this.avatarModalTarget.classList.remove("hidden")
  }

  triggerFileUpload() {
    this.profilePictureInputTarget.click()
  }

  previewFile() {
    const file = this.profilePictureInputTarget.files[0]
    if (!file) return

    // Clear any preset avatar selection
    this.avatarUrlFieldTarget.value = ""
    this.avatarOptionTargets.forEach(btn => btn.style.borderColor = "transparent")

    const reader = new FileReader()
    reader.onload = (e) => {
      this.uploadPreviewTarget.src = e.target.result
      this.uploadPreviewTarget.classList.remove("hidden")
      this.uploadPlaceholderTarget.classList.add("hidden")
    }
    reader.readAsDataURL(file)
    this._updateJoinBtn()
  }

  selectAvatar(event) {
    const btn = event.currentTarget
    const url = btn.dataset.avatarUrl

    // Set the hidden avatar_url field in the registration form
    this.avatarUrlFieldTarget.value = url

    // Clear any file upload
    this.profilePictureInputTarget.value = ""
    this.uploadPreviewTarget.classList.add("hidden")
    this.uploadPlaceholderTarget.classList.remove("hidden")

    // Highlight selected, reset others
    this.avatarOptionTargets.forEach(b => b.style.borderColor = "transparent")
    btn.style.borderColor = "#5F7367"
    this._updateJoinBtn()
  }

  _updateJoinBtn() {
    const hasFile = this.profilePictureInputTarget.files.length > 0
    const hasAvatar = this.avatarUrlFieldTarget.value.trim().length > 0
    const btn = this.joinBtnTarget
    if (hasFile || hasAvatar) {
      btn.disabled = false
      btn.classList.remove("cursor-not-allowed", "opacity-40")
      btn.classList.add("cursor-pointer")
    } else {
      btn.disabled = true
      btn.classList.add("cursor-not-allowed", "opacity-40")
      btn.classList.remove("cursor-pointer")
    }
  }

  checkRegistration() {
    const name = this.regNameTarget.value.trim()
    const email = this.regEmailTarget.value.trim()
    const password = this.regPasswordTarget.value
    const confirm = this.regConfirmTarget.value
    const btn = this.createAccountBtnTarget

    const passwordsMatch = password === confirm
    const allFilled = name.length > 0 && email.length > 0 && password.length > 0 && confirm.length > 0

    // Show/hide mismatch error only when confirm has something typed
    if (confirm.length > 0 && !passwordsMatch) {
      this.passwordErrorTarget.classList.remove("hidden")
    } else {
      this.passwordErrorTarget.classList.add("hidden")
    }

    if (allFilled && passwordsMatch) {
      btn.disabled = false
      btn.classList.remove("cursor-not-allowed", "opacity-40")
      btn.classList.add("cursor-pointer")
    } else {
      btn.disabled = true
      btn.classList.add("cursor-not-allowed", "opacity-40")
      btn.classList.remove("cursor-pointer")
    }
  }

  openInterests(event) {
    event.preventDefault()

    const gsModal = this.getStartedModalTarget
    const intModal = this.interestsModalTarget

    // Copy registration form values into the interests modal hidden fields
    intModal.querySelector('[data-interests-field="name"]').value =
      gsModal.querySelector('[name="user[name]"]').value
    intModal.querySelector('[data-interests-field="email"]').value =
      gsModal.querySelector('[name="user[email]"]').value
    intModal.querySelector('[data-interests-field="password"]').value =
      gsModal.querySelector('[name="user[password]"]').value
    intModal.querySelector('[data-interests-field="password_confirmation"]').value =
      gsModal.querySelector('[name="user[password_confirmation]"]').value

    this.getStartedModalTarget.classList.add("hidden")
    this.cityModalTarget.classList.add("hidden")
    this.interestsModalTarget.classList.remove("hidden")
  }

  openCity(event) {
    event.preventDefault()
    const anyChecked = this.interestsModalTarget.querySelectorAll('input[type="checkbox"]:checked').length > 0
    if (!anyChecked) return
    this.interestsModalTarget.classList.add("hidden")
    this.cityModalTarget.classList.remove("hidden")

    // Leaflet can't measure the container while it's hidden, so invalidate after it's visible
    setTimeout(() => {
      const cityMapEl = this.cityModalTarget.querySelector('[data-controller="city-map"]')
      if (cityMapEl) {
        const cityMapController = this.application.getControllerForElementAndIdentifier(cityMapEl, "city-map")
        if (cityMapController && cityMapController.map) {
          cityMapController.map.invalidateSize()
        }
      }
    }, 100)
  }

  checkInterests() {
    const anyChecked = this.interestsModalTarget.querySelectorAll('input[type="checkbox"]:checked').length > 0
    const btn = this.nextStepBtnTarget
    if (anyChecked) {
      btn.disabled = false
      btn.classList.remove("cursor-not-allowed", "opacity-40")
      btn.classList.add("cursor-pointer")
    } else {
      btn.disabled = true
      btn.classList.add("cursor-not-allowed", "opacity-40")
      btn.classList.remove("cursor-pointer")
    }
  }

  submitRegistration() {
    document.getElementById("registration-form").submit()
  }

  close() {
    this.loginModalTarget.classList.add("hidden")
    this.forgotModalTarget.classList.add("hidden")
    this.getStartedModalTarget.classList.add("hidden")
    this.interestsModalTarget.classList.add("hidden")
    this.cityModalTarget.classList.add("hidden")
    this.avatarModalTarget.classList.add("hidden")
  }

  stopPropagation(event) {
    event.stopPropagation()
  }
}
