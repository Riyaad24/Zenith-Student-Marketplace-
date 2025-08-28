document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu functionality
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const mobileMenu = document.getElementById("mobileMenu")

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("active")
    })
  }

  // Search functionality
  const searchBtn = document.getElementById("searchBtn")
  const searchContainer = document.getElementById("searchContainer")
  const searchCloseBtn = document.getElementById("searchCloseBtn")
  const searchInput = document.getElementById("searchInput")

  if (searchBtn && searchContainer) {
    searchBtn.addEventListener("click", () => {
      searchContainer.classList.add("active")
      searchBtn.style.display = "none"
      if (searchInput) {
        searchInput.focus()
      }
    })
  }

  if (searchCloseBtn && searchContainer) {
    searchCloseBtn.addEventListener("click", () => {
      searchContainer.classList.remove("active")
      searchBtn.style.display = "flex"
      if (searchInput) {
        searchInput.value = ""
      }
    })
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", (event) => {
    if (mobileMenu && mobileMenu.classList.contains("active")) {
      if (!mobileMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
        mobileMenu.classList.remove("active")
      }
    }
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        })
      }
    })
  })

  // Add loading states for buttons
  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      // Only add loading state for form submissions, not navigation
      if (this.type === "submit" || this.classList.contains("submit-btn")) {
        this.style.opacity = "0.7"
        this.style.pointerEvents = "none"

        // Reset after 2 seconds (adjust based on your needs)
        setTimeout(() => {
          this.style.opacity = "1"
          this.style.pointerEvents = "auto"
        }, 2000)
      }
    })
  })
})
