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
  if (!targetSection) return; // Safety check: do nothing if section does not exist.

  // targetPosition = section top position in full page coordinates.
  const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY;

  // Offset keeps heading visible below sticky nav.
  const offsetPosition = targetPosition - getHeaderHeight() - 14;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth"
  });
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
