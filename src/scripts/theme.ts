/**
 * ============================================================================
 * THEME SCRIPT: LIGHT / DARK MODE (TypeScript)
 * ============================================================================
 * What this script does:
 * 1) Reads the user's preferred theme from localStorage (key: "resume-site-theme").
 * 2) Applies the theme by adding or removing the "theme-dark" class on <body>.
 * 3) Keeps the toggle checkbox switch synced with the current theme.
 * 4) Saves changes when the user toggles the switch.
 *
 * HOW TO MAINTAIN:
 * - Colors for light and dark modes are declared in src/styles/global.css.
 * - Light mode is the default when no prior choice is saved.
 * ============================================================================
 */

export const THEME_STORAGE_KEY = "resume-site-theme";
export type Theme = "light" | "dark";

export function initTheme(): void {
  const themeToggleInput = document.getElementById("theme-toggle-input") as HTMLInputElement | null;

  /**
   * Applies the chosen theme to the DOM and toggle control.
   */
  function applyTheme(theme: Theme): void {
    const isDark = theme === "dark";
    document.body.classList.toggle("theme-dark", isDark);
    if (themeToggleInput) {
      themeToggleInput.checked = isDark;
    }
  }

  // Load saved preference or fallback to light mode
  const savedTheme = (typeof localStorage !== "undefined"
    ? localStorage.getItem(THEME_STORAGE_KEY)
    : null) as Theme | null;

  if (savedTheme === "dark" || savedTheme === "light") {
    applyTheme(savedTheme);
  } else {
    applyTheme("light");
  }

  // Listen for user toggle events
  if (themeToggleInput) {
    themeToggleInput.addEventListener("change", () => {
      const nextTheme: Theme = themeToggleInput.checked ? "dark" : "light";
      applyTheme(nextTheme);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      } catch (err) {
        console.warn("[Theme] Could not save theme preference to localStorage.", err);
      }
    });
  }
}

// Automatically initialize when the DOM is ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTheme);
  } else {
    initTheme();
  }
}
