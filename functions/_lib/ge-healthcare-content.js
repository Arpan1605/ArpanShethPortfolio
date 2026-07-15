// Not a public route: files prefixed with "_" inside /functions are excluded from both
// Cloudflare Pages routing and static-asset publishing, so this string is never sent to a
// browser except through functions/ge-healthcare.html.js after a verified access cookie.
export const protectedBody = `
    <div class="ge-case-shell">
      <aside class="ge-case-leftnav" aria-label="Case study phases">
        <div class="ge-case-leftnav__inner">
          <a href="#overview" class="ge-case-leftnav__item">Overview</a>
          <span class="ge-case-leftnav__rule"></span>
          <a href="#research" class="ge-case-leftnav__item">Research</a>
          <span class="ge-case-leftnav__rule"></span>
          <a href="#solution" class="ge-case-leftnav__item">Solution</a>
          <span class="ge-case-leftnav__rule"></span>
          <a href="#impact" class="ge-case-leftnav__item">Impact</a>
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
            <h1>To design an enterprise asset lifecycle platform for healthcare operations</h1>
            <p>
              Transform GE Healthcare&rsquo;s lease, loan, end-of-term, remarketing, and financial
              workflows into one clearer operational system that reduces fragmentation and improves visibility.
            </p>
          </div>

          <div class="ge-hero-spacer"></div>

          <div class="ge-meta-grid">
            <article>
              <h2>Team</h2>
              <p>Cross-functional collaboration across PMO, FAS, Cash, Inventory, Sales, Syndication, Remarketing, and Operations.</p>
            </article>
            <article>
              <h2>My Role</h2>
              <p>Workflow mapping, UX structuring, information architecture, wireframing, prototyping, dashboard strategy, and design system transition support.</p>
            </article>
            <article>
              <h2>Platform Growth</h2>
              <p>Scaled from roughly 50 users to 2,000+ users while evolving from Edison into Ethos and from 2 workflows into a broader enterprise ecosystem.</p>
            </article>
          </div>
        </section>

        <section class="ge-slide" id="research">
          <div class="ge-statement">
            <h2>
              Healthcare teams were managing
              <span>vast, complex, and fragmented</span>
              asset information across multiple systems, approvals, and manual handoffs.
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
              <p class="ge-problem-copy__lead">Operational pain points</p>
              <ul>
                <li>Manual coordination slowed down decision-making</li>
                <li>Limited visibility across queues, statuses, and approvals</li>
                <li>Time-consuming follow-ups across many teams</li>
                <li>High-value medical equipment needed stronger oversight</li>
              </ul>
            </div>
          </div>
        </section>

        <section class="ge-slide">
          <div class="ge-statement ge-statement--compact">
            <h2>Who shaped this product?</h2>
          </div>

          <div class="ge-stakeholder-row">
            <div>PMO</div>
            <div>FAS Team</div>
            <div>Cash Team</div>
            <div>Inventory</div>
            <div>Sales</div>
            <div>Syndication</div>
            <div>Remarketing</div>
            <div>Operations</div>
          </div>

          <div class="ge-split-text">
            <p>
              Discovery involved 2 to 3 months of stakeholder workshops, workflow mapping,
              requirement gathering, and process understanding across multiple business units.
            </p>
            <p>
              The challenge was less about making individual screens attractive and more about
              helping users understand where work was stuck, who needed to act, and what came next.
            </p>
          </div>
        </section>

        <section class="ge-slide" id="solution">
          <div class="ge-statement ge-statement--compact">
            <h2>The platform became one connected lifecycle instead of isolated tools.</h2>
          </div>

          <div class="ge-lifecycle-band">
            <div>Lease / Loan</div>
            <div>End of Term</div>
            <div>Buyout or Return</div>
            <div>Remarketing</div>
            <div>Asset Reuse / Resale</div>
            <div>Financial Processing</div>
          </div>
        </section>

        <section class="ge-slide">
          <div class="ge-statement ge-statement--compact">
            <h2>How the platform evolved</h2>
          </div>

          <div class="ge-evolution-grid">
            <article>
              <span>Version 1</span>
              <h3>Lease + Loan</h3>
              <p>Focused on foundational workflows, early wireframes, and Edison design system patterns.</p>
            </article>
            <article>
              <span>Version 2</span>
              <h3>End of Term + Remarketing</h3>
              <p>Expanded into downstream operational complexity with stronger approval and queue visibility.</p>
            </article>
            <article>
              <span>Version 3</span>
              <h3>Invoice Cancellation + Activity Management</h3>
              <p>Added financial exception handling and broader workflow monitoring to support scaling needs.</p>
            </article>
          </div>
        </section>

        <section class="ge-slide">
          <div class="ge-statement ge-statement--compact">
            <h2>Users needed a clearer source of truth.</h2>
          </div>

          <div class="ge-dashboard-story">
            <div class="ge-ring-chart">
              <div class="ge-ring-chart__center">Unified Dashboard</div>
            </div>

            <div class="ge-dashboard-story__copy">
              <p>
                Dashboard exploration focused on what gave teams the clearest operational overview.
                Requests, approvals, queues, and bottlenecks had to be visible without forcing users
                to jump between disconnected views.
              </p>
              <p>
                As the product matured, three separate dashboards were consolidated into one unified
                experience to reduce navigation and create a single source of truth.
              </p>
            </div>
          </div>
        </section>

        <section class="ge-slide">
          <div class="ge-statement ge-statement--compact">
            <h2>Three modules became especially important to the platform.</h2>
          </div>

          <div class="ge-module-grid">
            <article>
              <h3>End of Term</h3>
              <p>Quote creation, submissions, multi-team approvals, buyout, and return decisions for lease and loan completion.</p>
            </article>
            <article>
              <h3>Remarketing</h3>
              <p>Returned asset details, expenses, pickup, warehouse tracking, and finalization to reduce revenue delays.</p>
            </article>
            <article>
              <h3>Invoice Cancellation</h3>
              <p>Financial exception management with clearer request tracking, transparency, and centralized monitoring.</p>
            </article>
          </div>
        </section>

        <section class="ge-slide">
          <div class="ge-statement ge-statement--compact">
            <h2>What changed over time?</h2>
          </div>

          <div class="ge-split-text ge-split-text--large">
            <p>
              The design system transitioned from Edison to Ethos, improving consistency, scalability,
              accessibility, and modernization across an increasingly complex product.
            </p>
            <p>
              More importantly, the platform evolved from a focused workflow application into a
              full enterprise asset lifecycle ecosystem, where orchestration mattered as much as visuals.
            </p>
          </div>
        </section>

        <section class="ge-slide" id="impact">
          <div class="ge-statement ge-statement--compact">
            <h2>Enterprise UX that scaled with the business.</h2>
          </div>

          <div class="ge-impact-grid ge-impact-grid--quad">
            <article>
              <strong>50 &rarr; 2,000+</strong>
              <span>Growth in supported users</span>
            </article>
            <article>
              <strong>2 &rarr; Multi-module</strong>
              <span>Expanded workflow ecosystem</span>
            </article>
            <article>
              <strong>40% faster</strong>
              <span>Quote turnaround time</span>
            </article>
            <article>
              <strong>30% higher</strong>
              <span>Stakeholder satisfaction scores</span>
            </article>
          </div>

          <div class="ge-reflection">
            <p>
              The biggest learning from this project was designing for systems, not just screens.
              Consolidating queues, statuses, and approvals into one source of truth cut down on
              manual coordination and gave teams visibility they didn't have before — it sharpened
              my ability to structure workflows, work across cross-functional teams, and turn
              operational complexity into clearer digital experiences.
            </p>
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
