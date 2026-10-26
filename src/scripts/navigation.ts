/**
 * ============================================================================
 * NAVIGATION & SCROLL SCRIPT (TypeScript)
 * ============================================================================
 * What this script does:
 * 1) Connects navigation tabs in the sticky top bar to their page sections.
 * 2) Smoothly scrolls to the requested section with offset so titles aren't cut off.
 * 3) Toggles the "is-stuck" visual style (background/border) as the user scrolls.
 * 4) Manages the floating "to top" button at the bottom-right corner.
 *
 * HOW TO MAINTAIN / ADD A NEW SECTION:
 * - If you add a new section in src/components/, give its HTML <section> an id,
 *   e.g. id="certifications".
 * - In src/components/StickyNav.astro, add a button with data-target="certifications".
 * - This script will automatically find it and scroll to it smoothly!
 * ============================================================================
 */

export function initNavigation(): void {
  // Collect all navigation tab buttons
  const navTabs = document.querySelectorAll<HTMLButtonElement>(".nav-tab");
  const stickyNav = document.querySelector<HTMLElement>(".sticky-nav");
  const toTopButton = document.getElementById("to-top-button") as HTMLButtonElement | null;

  /**
   * Returns current sticky navigation bar height in pixels.
   * Dynamically measured to handle responsive screen resizing.
   */
  function getHeaderHeight(): number {
    return stickyNav ? stickyNav.offsetHeight : 0;
  }

  /**
   * Scrolls the viewport to a target section element by its ID.
   * Accounts for the sticky nav height and provides extra breathing room.
   */
  function scrollToSection(sectionId: string): boolean {
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) {
      console.warn(`[Navigation] Target section "#${sectionId}" was not found.`);
      return false;
    }

    // Calculate section's absolute top coordinate on the page
    const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY;

    // Offset leaves the section title visible below the sticky bar
    const offsetPosition = targetPosition - getHeaderHeight() - 14;

    // Prevent scrolling past the maximum page height
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const clampedPosition = Math.min(Math.max(offsetPosition, 0), Math.max(maxScroll, 0));

    window.scrollTo({
      top: clampedPosition,
      behavior: "smooth"
    });
    return true;
  }

  // Attach click listener to each navigation button
  navTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const sectionId = tab.dataset.target;
      if (sectionId) {
        scrollToSection(sectionId);
      }
    });
  });

  // Sticky navigation appearance on scroll
  if (stickyNav) {
    function updateStickyNavState(): void {
      const isStuck = window.scrollY > 8;
      stickyNav?.classList.toggle("is-stuck", isStuck);
    }

    updateStickyNavState();
    window.addEventListener("scroll", updateStickyNavState, { passive: true });
    window.addEventListener("resize", updateStickyNavState);
  }

  // Floating "To Top" button functionality
  if (toTopButton) {
    function ensureToTopButtonVisible(): void {
      if (!toTopButton) return;
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

    toTopButton.addEventListener("mouseenter", () => {
      toTopButton.title = "To top";
    });

    toTopButton.addEventListener("focus", () => {
      toTopButton.title = "To top";
    });
  }
}

// Automatically initialize when the DOM is ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavigation);
  } else {
    initNavigation();
  }
}
