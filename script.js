/*
  ==================================================
  NAVIGATION SCROLL SCRIPT (FOR MAINTENANCE)
  ==================================================
  What this script does:
  1) Finds all nav buttons in the sticky navigation bar
  2) Reads each button's data-target value (an id in index.html)
  3) Smoothly scrolls to that section when clicked
  4) Offsets scroll position so sticky header does not cover the section title

  If you add a new section:
  - Give section an id in HTML, example id="projects"
  - Add a new nav button with data-target="projects"
  - No JS changes needed, it will work automatically
*/

// Collect every tab button that should trigger scrolling.
const navTabs = document.querySelectorAll(".nav-tab");
const stickyNav = document.querySelector(".sticky-nav");
const toTopButton = document.getElementById("to-top-button");
const themeToggleInput = document.getElementById("theme-toggle-input");
const contactForm = document.getElementById("contact-form");
const contactFormStatus = document.getElementById("contact-form-status");
const THEME_STORAGE_KEY = "resume-site-theme";

/**
 * Returns current sticky navigation bar height.
 * We calculate this dynamically in case nav size changes on smaller screens.
 */
function getHeaderHeight() {
  const stickyNav = document.querySelector(".sticky-nav");
  return stickyNav ? stickyNav.offsetHeight : 0;
}

/**
 * Scrolls the page to a target section id while accounting for sticky nav.
 * @param {string} sectionId - id of target section (without #)
 */
function scrollToSection(sectionId) {
  const targetSection = document.getElementById(sectionId);
  if (!targetSection) return false; // Safety check: do nothing if section does not exist.

  // targetPosition = section top position in full page coordinates.
  const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY;

  // Offset keeps heading visible below sticky nav.
  const offsetPosition = targetPosition - getHeaderHeight() - 14;

  // Clamp to valid page range so near-bottom sections always scroll correctly.
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const clampedPosition = Math.min(Math.max(offsetPosition, 0), Math.max(maxScroll, 0));

  window.scrollTo({
    top: clampedPosition,
    behavior: "smooth"
  });
  return true;
}

// Attach click behavior to each navigation tab.
navTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const sectionId = tab.dataset.target;
    scrollToSection(sectionId);
  });
});

/*
  Sticky-nav visual state:
  - Keep nav transparent when page is at very top
  - Add background/border once user starts scrolling down
*/
if (stickyNav) {
  function updateStickyNavState() {
    const isStuck = window.scrollY > 8;
    stickyNav.classList.toggle("is-stuck", isStuck);
  }

  updateStickyNavState();
  window.addEventListener("scroll", updateStickyNavState, { passive: true });
  window.addEventListener("resize", updateStickyNavState);
}

/*
  Floating "to top" button behavior:
  - Click: smooth scroll to top of page
  - Hover/focus: ensure tooltip label stays "To top"
*/
if (toTopButton) {
  // Defensive visibility setup in case another stylesheet hides generic buttons.
  function ensureToTopButtonVisible() {
    toTopButton.style.display = "inline-flex";
    toTopButton.style.visibility = "visible";
    toTopButton.style.opacity = "1";
    toTopButton.style.pointerEvents = "auto";
  }

  ensureToTopButtonVisible();
  window.addEventListener("load", ensureToTopButtonVisible);

  toTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // Keep tooltip text explicit for users and accessibility tools.
  toTopButton.addEventListener("mouseenter", () => {
    toTopButton.title = "To top";
  });

  toTopButton.addEventListener("focus", () => {
    toTopButton.title = "To top";
  });
}

/*
  Light/Dark mode behavior:
  - Uses light mode as default
  - Toggles a body class for theme colors
  - Persists user preference in localStorage
*/
if (themeToggleInput) {
  function applyTheme(theme) {
    const isDark = theme === "dark";
    document.body.classList.toggle("theme-dark", isDark);
    themeToggleInput.checked = isDark;
  }

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "dark" || savedTheme === "light") {
    applyTheme(savedTheme);
  } else {
    applyTheme("light");
  }

  themeToggleInput.addEventListener("change", () => {
    const nextTheme = themeToggleInput.checked ? "dark" : "light";
    applyTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  });
}

/*
  Contact form behavior:
  - Sends form data directly via fetch (no external mail app)
  - Uses a form endpoint that forwards to the recipient inbox
*/
if (contactForm) {
  const submitButton = contactForm.querySelector('button[type="submit"]');

  // Return true only when every required field has content and passes native validation.
  function areRequiredFieldsFilled() {
    const requiredFields = contactForm.querySelectorAll("[required]");
    return Array.from(requiredFields).every((field) => {
      const value = typeof field.value === "string" ? field.value.trim() : "";
      return value.length > 0 && field.checkValidity();
    });
  }

  function updateSubmitEnabledState() {
    if (!submitButton) return;
    submitButton.disabled = !areRequiredFieldsFilled();
  }

  contactForm.addEventListener("input", updateSubmitEnabledState);
  contactForm.addEventListener("change", updateSubmitEnabledState);
  updateSubmitEnabledState();

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const recipient = contactForm.dataset.recipient || "";
    const returnEmailInput = document.getElementById("contact-return-email");
    const subjectInput = document.getElementById("contact-subject");
    const messageInput = document.getElementById("contact-message");

    const returnEmail = returnEmailInput ? returnEmailInput.value.trim() : "";
    const subject = subjectInput ? subjectInput.value.trim() : "";
    const inquiry = messageInput ? messageInput.value.trim() : "";

    // Inline status keeps user informed without redirecting away from the page.
    if (contactFormStatus) {
      contactFormStatus.textContent = "Sending...";
    }
    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      // FormSubmit expects standard form fields and special underscore options.
      const payload = new FormData();
      payload.append("Return Email", returnEmail);
      payload.append("Subject", subject);
      payload.append("Inquiry", inquiry);
      payload.append("_subject", `Portfolio inquiry: ${subject}`);
      payload.append("_replyto", returnEmail);
      payload.append("_captcha", "false");

      const response = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json"
          },
          body: payload
        }
      );

      const result = await response.json();
      if (!response.ok || result.success !== "true") {
        throw new Error("Email submission failed");
      }

      contactForm.reset();
      updateSubmitEnabledState();
      if (contactFormStatus) {
        contactFormStatus.textContent = "Message sent. Thank you for reaching out.";
      }
    } catch (error) {
      if (contactFormStatus) {
        contactFormStatus.textContent =
          "Unable to send right now. Please try again shortly.";
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}

