/*
  ==================================================
  NAVIGATION SCROLL SCRIPT (FOR MAINTENANCE)
  ==================================================
  What this script does:
  1) Finds all nav buttons in the header
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

/**
 * Returns current sticky header height.
 * We calculate this dynamically in case header size changes on smaller screens.
 */
function getHeaderHeight() {
  const header = document.querySelector(".site-header");
  return header ? header.offsetHeight : 0;
}

/**
 * Scrolls the page to a target section id while accounting for sticky header.
 * @param {string} sectionId - id of target section (without #)
 */
function scrollToSection(sectionId) {
  const targetSection = document.getElementById(sectionId);
  if (!targetSection) return; // Safety check: do nothing if section does not exist.

  // targetPosition = section top position in full page coordinates.
  const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY;

  // Offset keeps heading visible below sticky header.
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
