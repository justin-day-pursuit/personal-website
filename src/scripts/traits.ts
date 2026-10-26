/**
 * ============================================================================
 * MORE ON ME: EXPANDABLE TRAIT CARDS (TypeScript)
 * ============================================================================
 * What this script does:
 * 1) Powers the interactive expandable drawer cards in the "More On Me" section.
 * 2) 1-second hover delay before expanding to preview content (encourages click).
 * 3) Clicking locks a card in the open state until clicked again.
 * 4) Manages ARIA accessibility attributes (aria-expanded="true/false").
 *
 * HOW TO MAINTAIN:
 * - Content of each card lives in src/components/MoreOnMe.astro.
 * - If you add a new card, give it class="trait-card" with a .trait-toggle-btn
 *   and .trait-label-side. This script will automatically attach all interactions!
 * ============================================================================
 */

export const HOVER_DELAY_MS = 1000;

export function initTraits(): void {
  const traitCards = document.querySelectorAll<HTMLElement>(".trait-card");

  traitCards.forEach((card) => {
    const toggleBtn = card.querySelector<HTMLButtonElement>(".trait-toggle-btn");
    let hoverTimer: ReturnType<typeof setTimeout> | null = null;

    // Hover entry: wait 1 second before preview expansion
    card.addEventListener("mouseenter", () => {
      if (card.classList.contains("is-locked")) return;

      if (hoverTimer) clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        if (!card.classList.contains("is-locked")) {
          card.classList.add("is-hover-open");
          if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "true");
        }
      }, HOVER_DELAY_MS);
    });

    // Hover exit: close preview if not locked open
    card.addEventListener("mouseleave", () => {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }

      if (card.classList.contains("is-hover-open")) {
        card.classList.remove("is-hover-open");
        if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
      }
    });

    /**
     * Handles clicks on the toggle button or the card label side.
     */
    function handleToggleClick(event: MouseEvent): void {
      const target = event.target as HTMLElement | null;

      // Allow selecting and copying text inside the drawer without closing the card
      if (target?.closest(".trait-drawer") && card.classList.contains("is-locked")) {
        return;
      }

      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }

      // If clicked while hovering, dismiss the preview
      if (card.classList.contains("is-hover-open")) {
        card.classList.remove("is-hover-open");
        if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
        return;
      }

      // Toggle locked open state
      const isLocked = card.classList.toggle("is-locked");
      if (toggleBtn) toggleBtn.setAttribute("aria-expanded", String(isLocked));
    }

    if (toggleBtn) {
      toggleBtn.addEventListener("click", handleToggleClick);
    }

    const labelSide = card.querySelector<HTMLElement>(".trait-label-side");
    if (labelSide) {
      labelSide.addEventListener("click", handleToggleClick);
    }
  });
}

// Automatically initialize when the DOM is ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTraits);
  } else {
    initTraits();
  }
}
