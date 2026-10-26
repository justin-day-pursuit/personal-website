/**
 * ============================================================================
 * CONTACT FORM SCRIPT (TypeScript)
 * ============================================================================
 * What this script does:
 * 1) Validates input fields in real time.
 * 2) Enables the "Let's Connect" button only when all required inputs are valid.
 * 3) Sends submissions asynchronously via fetch to FormSubmit (no external email client required).
 * 4) Shows clear status messages without redirecting away from the portfolio.
 *
 * HOW TO MAINTAIN:
 * - Recipient email address is defined on the <form> in src/components/Contact.astro
 *   via the `data-recipient` attribute (default: "justin.day@pursuit.org").
 * - Change that attribute if you need submissions sent to a different address.
 * ============================================================================
 */

export function initContactForm(): void {
  const contactForm = document.getElementById("contact-form") as HTMLFormElement | null;
  const contactFormStatus = document.getElementById("contact-form-status") as HTMLElement | null;

  if (!contactForm) return;

  const submitButton = contactForm.querySelector<HTMLButtonElement>('button[type="submit"]');

  /**
   * Returns true only when every required field has non-empty text and passes HTML validation.
   */
  function areRequiredFieldsFilled(): boolean {
    if (!contactForm) return false;
    const requiredFields = contactForm.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[required]");
    return Array.from(requiredFields).every((field) => {
      const value = typeof field.value === "string" ? field.value.trim() : "";
      return value.length > 0 && field.checkValidity();
    });
  }

  /**
   * Updates disabled state of the submit button based on current field validation.
   */
  function updateSubmitEnabledState(): void {
    if (!submitButton) return;
    submitButton.disabled = !areRequiredFieldsFilled();
  }

  contactForm.addEventListener("input", updateSubmitEnabledState);
  contactForm.addEventListener("change", updateSubmitEnabledState);
  updateSubmitEnabledState();

  contactForm.addEventListener("submit", async (event: SubmitEvent) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const recipient = contactForm.dataset.recipient || "";
    const returnEmailInput = document.getElementById("contact-return-email") as HTMLInputElement | null;
    const subjectInput = document.getElementById("contact-subject") as HTMLInputElement | null;
    const messageInput = document.getElementById("contact-message") as HTMLTextAreaElement | null;

    const returnEmail = returnEmailInput ? returnEmailInput.value.trim() : "";
    const subject = subjectInput ? subjectInput.value.trim() : "";
    const inquiry = messageInput ? messageInput.value.trim() : "";

    if (contactFormStatus) {
      contactFormStatus.textContent = "Sending...";
    }
    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
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
        contactFormStatus.textContent = "Unable to send right now. Please try again shortly.";
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}

// Automatically initialize when the DOM is ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initContactForm);
  } else {
    initContactForm();
  }
}
