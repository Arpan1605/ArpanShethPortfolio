// Not a public route: files prefixed with "_" inside /functions are excluded from both
// Cloudflare Pages routing and static-asset publishing, so this string is never sent to a
// browser except through functions/ge-healthcare.html.js after a verified access cookie.
export const protectedBody = `
    <div class="ge-case-shell">
      <aside class="ge-case-leftnav" aria-label="Case study phases">
        <div class="ge-case-leftnav__inner">
          <a href="#overview" class="ge-case-leftnav__item">Overview</a>
          <span class="ge-case-leftnav__rule"></span>
          <a href="#problem" class="ge-case-leftnav__item">Problem</a>
          <span class="ge-case-leftnav__rule"></span>
          <a href="#approach" class="ge-case-leftnav__item">Approach</a>
          <span class="ge-case-leftnav__rule"></span>
          <a href="#outcome" class="ge-case-leftnav__item">Outcome</a>
        </div>
      </aside>

      <main class="ge-case-main">
        <nav class="ge-case-rightnav" aria-label="Quick navigation">
          <a href="index.html">WORK</a>
          <a href="#overview">ABOUT</a>
          <a href="resume.pdf" target="_blank" rel="noreferrer">RESUME</a>
          <a href="index.html#contact">CONTACT</a>
        </nav>

        <section class="ge-slide ge-slide--hero" id="overview">
          <div class="ge-hero-copy">
            <h1>Scaling an Enterprise Healthcare Platform from 50 to 2,000+ Global Users</h1>
            <p>
              A global enterprise healthcare platform needed to scale its core operational
              workflows &mdash; lease, loan, end-of-term, remarketing, and financial processes &mdash; as its
              user base grew more than 40x, from roughly 50 to over 2,000 users worldwide. I led
              UX design across this growth, working to keep increasingly complex, high-volume
              workflows usable rather than letting complexity compound as the platform scaled.
            </p>
          </div>

          <p class="pareexa-metrics-note pareexa-metrics-note--centered">
            This case study covers proprietary enterprise workflows under NDA. Screens shown are
            sanitized/abstracted; figures below are approximate and directional. Exact metrics
            available under NDA on request.
          </p>

          <div class="ge-meta-grid">
            <article>
              <h2>Category</h2>
              <p>Healthcare &amp; Enterprise Operations</p>
            </article>
            <article>
              <h2>Role</h2>
              <p>UX/UI Designer (via Tata Consultancy Services)</p>
            </article>
            <article>
              <h2>Duration</h2>
              <p>October 2022 &ndash; Present</p>
            </article>
          </div>

          <div class="ge-shot-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <rect x="3" y="4" width="18" height="16" rx="2"></rect>
              <circle cx="8.5" cy="9.5" r="1.5"></circle>
              <path d="M21 16l-5.5-5.5a2 2 0 0 0-2.83 0L4 19"></path>
            </svg>
            <span class="ge-shot-placeholder__label">Hero image</span>
            <span class="ge-shot-placeholder__note">High-fidelity abstracted dashboard screen &mdash; logos and branding scrubbed. Coming soon.</span>
          </div>
        </section>

        <section class="ge-slide" id="problem">
          <div class="ge-statement">
            <h2>
              Workflows built for a small internal team started
              <span>showing strain</span>
              as adoption scaled more than 40x.
            </h2>
          </div>

          <div class="ge-problem-layout">
            <div class="ge-document-stack" aria-hidden="true">
              <div class="ge-document ge-document--back"></div>
              <div class="ge-document ge-document--mid"></div>
              <div class="ge-document ge-document--front">
                <div class="ge-document__lines"></div>
              </div>
            </div>

            <div class="ge-problem-copy">
              <p class="ge-problem-copy__lead">Where the platform was breaking down</p>
              <ul>
                <li>Invoice cancellation involved multi-step exception handling that had become difficult for operational users to track</li>
                <li>Reporting was fragmented across disconnected views, making it harder for stakeholders to act quickly on operational data</li>
                <li>The challenge wasn't building new features &mdash; it was redesigning core workflows to hold up at 40x the original scale</li>
              </ul>
            </div>
          </div>
        </section>

        <section class="ge-slide">
          <div class="ge-statement ge-statement--compact">
            <h2>Discovery: finding where workflows were actually breaking down.</h2>
          </div>

          <div class="ge-split-text ge-split-text--large">
            <p>
              I worked directly with Product Owners, Business Analysts, and engineering to
              understand where workflows were breaking down at scale, running stakeholder
              workshops and requirement-gathering sessions to surface the specific friction points
              operational teams were hitting.
            </p>
            <p>
              I also used AI-assisted synthesis to speed up analysis of stakeholder feedback and
              usability testing sessions, allowing faster iteration between research rounds.
            </p>
          </div>

          <div class="ge-shot-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <rect x="3" y="4" width="18" height="16" rx="2"></rect>
              <circle cx="8.5" cy="9.5" r="1.5"></circle>
              <path d="M21 16l-5.5-5.5a2 2 0 0 0-2.83 0L4 19"></path>
            </svg>
            <span class="ge-shot-placeholder__label">Discovery artifact</span>
            <span class="ge-shot-placeholder__note">Journey map or workshop output, abstracted. Coming soon.</span>
          </div>
        </section>

        <section class="ge-slide" id="approach">
          <div class="ge-statement ge-statement--compact">
            <h2>Two workflows carried most of the redesign.</h2>
          </div>

          <div class="golfpac-approach-row">
            <div class="ge-shot-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                <circle cx="8.5" cy="9.5" r="1.5"></circle>
                <path d="M21 16l-5.5-5.5a2 2 0 0 0-2.83 0L4 19"></path>
              </svg>
              <span class="ge-shot-placeholder__label">Before/after wireframes</span>
              <span class="ge-shot-placeholder__note">Abstracted invoice cancellation flow. Coming soon.</span>
            </div>
            <div class="golfpac-approach-row__text">
              <h3>Invoice cancellation</h3>
              <p>
                Early exploration focused on the invoice cancellation workflow specifically, since
                it had the most reported confusion. I explored ways to simplify the multi-step
                exception-handling process and make processing status visible at a glance, rather
                than requiring users to interpret disconnected system states.
              </p>
            </div>
          </div>

          <div class="golfpac-approach-row">
            <div class="golfpac-approach-row__text">
              <h3>Dashboard consolidation</h3>
              <p>
                In parallel, I explored consolidating fragmented reporting views into unified
                operational dashboards, working through what information stakeholders actually
                needed surfaced versus what had simply accumulated over time.
              </p>
            </div>
            <div class="ge-shot-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                <circle cx="8.5" cy="9.5" r="1.5"></circle>
                <path d="M21 16l-5.5-5.5a2 2 0 0 0-2.83 0L4 19"></path>
              </svg>
              <span class="ge-shot-placeholder__label">Dashboard consolidation wireframes</span>
              <span class="ge-shot-placeholder__note">Abstracted. Coming soon.</span>
            </div>
          </div>
        </section>

        <section class="ge-slide">
          <div class="ge-statement ge-statement--compact">
            <h2>What I shipped</h2>
          </div>

          <div class="ge-module-grid">
            <article>
              <h3>Invoice cancellation workflow</h3>
              <p>Simplified exception handling and improved visibility into processing status for operational users.</p>
            </article>
            <article>
              <h3>Consolidated dashboards</h3>
              <p>Brought key workflow and business metrics into a single view, reducing how long it took stakeholders to act on reporting data.</p>
            </article>
            <article>
              <h3>Reusable design system</h3>
              <p>Built shared components and patterns to keep the growing set of application modules consistent, rather than each new module reinventing its own UI conventions.</p>
            </article>
          </div>

          <div class="ge-shot-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <rect x="3" y="4" width="18" height="16" rx="2"></rect>
              <circle cx="8.5" cy="9.5" r="1.5"></circle>
              <path d="M21 16l-5.5-5.5a2 2 0 0 0-2.83 0L4 19"></path>
            </svg>
            <span class="ge-shot-placeholder__label">Design system / component library</span>
            <span class="ge-shot-placeholder__note">Abstracted. Coming soon.</span>
          </div>
        </section>

        <section class="ge-slide">
          <div class="ge-statement ge-statement--compact">
            <h2>Technical &amp; engineering collaboration</h2>
          </div>

          <div class="ge-split-text ge-split-text--large">
            <p>
              Working at this scale meant designing within real technical constraints, not just
              visual ones &mdash; coordinating closely with Angular-based engineering teams on what was
              implementable within existing architecture, and using that technical fluency to make
              handoff faster and reduce rework.
            </p>
            <p>
              I contributed hands-on Angular development myself and used Git/GitHub for version
              control, keeping design and implementation tightly coupled through handoff rather
              than working from static screens alone.
            </p>
          </div>
        </section>

        <section class="ge-slide" id="outcome">
          <div class="ge-statement ge-statement--compact">
            <h2>Redesigned to hold up at 40x scale.</h2>
          </div>

          <div class="ge-impact-grid">
            <article>
              <strong>50 &rarr; 2,000+</strong>
              <span>Growth in supported users</span>
            </article>
            <article>
              <strong>Invoice cancellation</strong>
              <span>Simplified exception handling and status visibility</span>
            </article>
            <article>
              <strong>Unified dashboards</strong>
              <span>Consolidated fragmented reporting into one view</span>
            </article>
          </div>

          <div class="ge-reflection">
            <p>
              The platform scaled from roughly 50 to 2,000+ global users during this period.
              Stakeholders reported improved visibility into workflow status and faster ability to
              act on operational data following the dashboard consolidation.
            </p>
          </div>

          <p class="pareexa-status-note">
            Exact performance metrics are confidential under NDA &mdash; the figures above are
            directional. This case study covers proprietary enterprise workflows; screens shown
            are sanitized and abstracted, and more detail is available on request for recruiters
            and hiring managers.
          </p>

          <div class="ge-access-modal__ctas ge-access-modal__ctas--centered">
            <a class="ge-access-modal__request" href="mailto:mrarpansheth@gmail.com?subject=GE%20Healthcare%20case%20study%20access">
              Request Full Case Study
            </a>
          </div>
        </section>
      </main>
    </div>
    <script>
      (function () {
        const leftNavLinks = Array.from(document.querySelectorAll(".ge-case-leftnav__item"));
        const observedSections = leftNavLinks
          .map((link) => {
            const targetId = link.getAttribute("href");
            if (!targetId || !targetId.startsWith("#")) {
              return null;
            }
            const section = document.querySelector(targetId);
            return section ? { link, section } : null;
          })
          .filter(Boolean);

        if (!observedSections.length) {
          return;
        }

        function setActiveSection(id) {
          leftNavLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
          });
        }

        const observer = new IntersectionObserver(
          (entries) => {
            const visibleEntries = entries
              .filter((entry) => entry.isIntersecting)
              .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

            if (!visibleEntries.length) {
              return;
            }

            setActiveSection(visibleEntries[0].target.id);
          },
          {
            rootMargin: "-30% 0px -45% 0px",
            threshold: [0.2, 0.35, 0.55]
          }
        );

        observedSections.forEach(({ section }) => observer.observe(section));

        function syncActiveSectionFromScroll() {
          let currentSection = observedSections[0].section.id;

          observedSections.forEach(({ section }) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.32) {
              currentSection = section.id;
            }
          });

          setActiveSection(currentSection);
        }

        syncActiveSectionFromScroll();
        window.addEventListener("scroll", syncActiveSectionFromScroll, { passive: true });
      })();
    </script>
`;
