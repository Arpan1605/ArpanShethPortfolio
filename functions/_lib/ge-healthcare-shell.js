const HEAD = `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GE Healthcare Asset Lifecycle Management | Arpan Sheth</title>
    <meta
      name="description"
      content="Case study: GE Healthcare Asset Lifecycle Management platform. Enterprise UX for lease, loan, end-of-term, remarketing, and financial operations."
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Special+Elite&display=swap"
      rel="stylesheet"
    />
    <link rel="icon" type="image/svg+xml" href="favicon-as.svg" />
    <link rel="stylesheet" href="styles.css" />
`;

const TOPBAR = `
    <header class="topbar ge-case-topbar">
      <a class="brand" href="index.html">
        <span class="brand__mark">AS</span>
        <span class="brand__text">ARPAN SHETH</span>
      </a>

      <nav class="topbar__nav" aria-label="Case study navigation">
        <a href="index.html">Portfolio</a>
        <a href="index.html#contact">Contact</a>
        <a href="resume.pdf" target="_blank" rel="noreferrer">Resume</a>
      </nav>

      <div class="topbar__actions">
        <a class="submit-button" href="index.html">Back Home</a>
      </div>
    </header>
`;

export function lockedBody(errored) {
  return `
    <div class="ge-case-lock is-open" role="dialog" aria-modal="true">
      <div class="ge-case-lock__card">
        <p class="ge-access-modal__eyebrow">Healthcare &amp; Enterprise Operations</p>
        <h1>Scaling an Enterprise Healthcare Platform from 50 to 2,000+ Global Users</h1>
        <div class="ge-access-modal__tags">
          <span class="ge-access-modal__tag">Enterprise SaaS</span>
          <span class="ge-access-modal__tag">Workflow Design</span>
          <span class="ge-access-modal__tag">Design Systems</span>
          <span class="ge-access-modal__tag">Stakeholder Research</span>
        </div>
        <p class="ge-access-modal__copy">
          Led UX design across lease, loan, end-of-term, remarketing, and financial workflows for a
          global enterprise healthcare platform — consolidating fragmented processes into a
          consistent, scalable design system as the user base grew more than 40x.
        </p>
        <p class="ge-access-modal__nda">
          This case study covers proprietary enterprise workflows under NDA with GE Healthcare. The
          scope, role, and design approach above are shareable — detailed screens, internal data, and
          specific outcome metrics are available on request.
        </p>
        <div class="ge-access-modal__ctas">
          <a class="ge-access-modal__request" href="mailto:mrarpansheth@gmail.com?subject=GE%20Healthcare%20case%20study%20access">
            Request Full Case Study
          </a>
        </div>
        <form class="ge-access-modal__form" id="geCaseLockForm">
          <label class="ge-access-modal__label" for="geCasePassword">Already have the password?</label>
          <input
            class="ge-access-modal__input"
            id="geCasePassword"
            name="password"
            type="password"
            autocomplete="current-password"
            placeholder="Enter password"
            required
          />
          <p class="ge-access-modal__error" id="geCaseLockError" ${errored ? "" : "hidden"}>Incorrect password. Please try again.</p>
          <button class="submit-button ge-access-modal__submit" type="submit" id="geCaseLockSubmit">Unlock case study</button>
        </form>
      </div>
    </div>
    <script>
      (function () {
        const form = document.getElementById("geCaseLockForm");
        const password = document.getElementById("geCasePassword");
        const error = document.getElementById("geCaseLockError");
        const submit = document.getElementById("geCaseLockSubmit");

        password?.focus();

        form?.addEventListener("submit", async (event) => {
          event.preventDefault();
          submit.disabled = true;
          submit.textContent = "Checking...";

          try {
            const response = await fetch("/api/ge-unlock", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ password: password.value }),
            });
            const data = await response.json();

            if (data.ok) {
              window.location.reload();
              return;
            }

            error.hidden = false;
            password.select();
          } catch (err) {
            error.hidden = false;
          } finally {
            submit.disabled = false;
            submit.textContent = "Unlock case study";
          }
        });
      })();
    </script>
`;
}

export function renderPage(bodyHtml, { bodyClass = "ge-case-page" } = {}) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>${HEAD}
  </head>
  <body class="${bodyClass}">
    ${TOPBAR}
    ${bodyHtml}
  </body>
</html>
`;
}
