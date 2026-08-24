/**
 * CensusPagePO — Page Object for data.census.gov state profile pages
 * (https://data.census.gov/profile/<StateName>?g=040XX00US<FIPS>).
 *
 * A per-state demographic profile: gov banner + app header (search, nav tabs),
 * a map, a profile header (state name, description, neighbor-state links,
 * Share Profile), a sticky highlights/jump-links bar with a Display Sources
 * toggle, lazily-loaded topic sections (featured stats, charts with MoE
 * toggles / Show Table / Share-Embed), and a footer.
 *
 * CAVEATS baked into method design:
 *  - Sections load lazily on scroll; unloaded ones show .LoadingScreen placeholders.
 *  - The searchbar, highlights bar, and #census-home-link are each duplicated in
 *    the DOM (header + landing variant, main + sticky jump-links) — locators use .first().
 *  - The Display Sources toggle only responds to clicks on its inner .wrapper.
 */
class CensusPagePO {
  /**
   * @param {import('playwright').Page} page
   */
  constructor(page) {
    this.page = page;

    // ─────────────────────────────────────────────────────────────────────────────
    // Gov Banner  (see concepts/gov-banner.md)
    // ─────────────────────────────────────────────────────────────────────────────
    this._govBanner = page.locator('.gov-banner').first();
    this._howYouKnowBtn = page.locator('.gov-banner .menu-activator').first();
    this._govMenu = page.locator('.gov-banner .gov-menu').first();

    // ─────────────────────────────────────────────────────────────────────────────
    // Header / Search / Nav Tabs  (see concepts/header.md, concepts/searchbar.md)
    // ─────────────────────────────────────────────────────────────────────────────
    this._header = page.locator('header.AppHeader').first();
    this._logo = page.locator('header.AppHeader a[aria-label*="census.gov home page"]').first();
    this._searchWrapper = page.locator('.searchbar-wrapper').first();
    this._searchInput = page.locator('.searchbar-wrapper input[type="text"]').first();
    this._searchClear = page.locator('.searchbar-wrapper .clear-button-container').first();
    this._searchButton = page.locator('.searchbar-wrapper .search-button').first();
    this._searchDropdown = page.locator('.searchbar-wrapper #aqua-searchbar-dropdown').first();
    this._searchSuggestion = page.locator('.searchbar-wrapper #aqua-searchbar-dropdown [role="option"], .searchbar-wrapper #aqua-searchbar-dropdown .aqua-menu-item');
    this._exploreFilters = page.locator('a.advanced-search-button').first();
    this._navTabs = page.locator('a.aqua-tab.header');
    this._homeLink = page.locator('header.AppHeader a[href="/"]').first();
    this._appsLink = page.locator('header.AppHeader a[href^="/app"]').first();
    this._helpButton = page.locator('button.help-button').first();

    // ─────────────────────────────────────────────────────────────────────────────
    // Profile Header  (see concepts/profile-header.md)
    // ─────────────────────────────────────────────────────────────────────────────
    this._profileHeader = page.locator('.ProfileHeader').first();
    this._stateName = page.locator('.ProfileHeader h1.AquaText').first();
    this._profileType = page.locator('.ProfileHeader .profile-type').first();
    this._description = page.locator('.ProfileHeader .header-description').first();
    this._neighborLinks = page.locator('.ProfileHeader .header-description a.dynamic-link');
    this._shareButton = page.locator('button[id^="share-button_"]').first();

    // ─────────────────────────────────────────────────────────────────────────────
    // Map  (see concepts/map.md)
    // ─────────────────────────────────────────────────────────────────────────────
    this._map = page.locator('#map-section').first();
    this._zoomIn = page.locator('button.maplibregl-ctrl-zoom-in').first();
    this._zoomOut = page.locator('button.maplibregl-ctrl-zoom-out').first();

    // ─────────────────────────────────────────────────────────────────────────────
    // Highlights / Jump-Links Bar  (see concepts/highlights-bar.md)
    // ─────────────────────────────────────────────────────────────────────────────
    this._highlightsBar = page.locator('.ProfileHighlights.main-highlights').first();
    this._breadcrumbs = page.locator('.ProfileHighlights.main-highlights .aqua-breadcrumbs').first();
    this._usBreadcrumb = page.locator('.ProfileHighlights.main-highlights .aqua-breadcrumbs a').first();
    this._sourceToggle = page.locator('.AquaToggle.source-toggle').first();
    this._sourceToggleWrapper = page.locator('.AquaToggle.source-toggle .wrapper').first();
    this._sectionJumpButtons = page.locator('.ProfileHighlights.main-highlights [id^="measure-section-"] button[aria-label$=" section"]');
    this._highlightCards = page.locator('.ProfileHighlights.main-highlights [id^="measure-highlight-"]');

    // ─────────────────────────────────────────────────────────────────────────────
    // Profile Sections  (see concepts/profile-sections.md)
    // ─────────────────────────────────────────────────────────────────────────────
    this._sections = page.locator('section.section');
    this._sectionTitles = page.locator('section.section h2.AquaText');
    this._sectionLinks = page.locator('a.section-link');
    this._subtopicTitles = page.locator('h3.topic-title');
    this._featuredStats = page.locator('.FeaturedStatEstimate');
    this._chartTitles = page.locator('h4.chart-title');
    this._shareEmbedButtons = page.locator('button.share-embed-button');
    this._moeToggles = page.locator('.moe-toggle-button');
    this._pyramidMoeButton = page.locator('button.pyramid-moe-button').first();
    this._showTableButtons = page.locator('button.chart-table-button');
    this._chartContainers = page.locator('.TopicChartContainer');
    this._subtopics = page.locator('.SubTopic');
    this._sourceFields = page.locator('a.source-field');
    this._tablePopup = page.locator('.preview-table-popup').first();
    this._tablePopupClose = page.locator('.preview-table-popup .close-popover').first();
    this._tablePopupTitle = page.locator('.preview-table-popup .table-title').first();
    this._tablePopupHeaders = page.locator('.preview-table-popup .ag-header-cell-text');
    this._tablePopupRows = page.locator('.preview-table-popup .ag-row');
    this._nearbyProfileLinks = page.locator('section.section .RelatedProfiles a.related-profile-link');

    // ─────────────────────────────────────────────────────────────────────────────
    // Dialogs / Footer / Misc  (see concepts/profile-header.md, concepts/footer.md)
    // ─────────────────────────────────────────────────────────────────────────────
    this._dialog = page.locator('.aqua-card.aqua-dialog').first();
    this._dialogClose = page.locator('.aqua-dialog-close-button').first();
    this._copyUrlButton = page.locator('button[title="Copy url to clipboard"]').first();
    this._socialShareButtons = page.locator('.SocialShareButton');
    this._footer = page.locator('.PageFooter').first();
    this._footerLinks = page.locator('.PageFooter a');
    this._skipLinks = page.locator('button.skip-main');
    this._accessibilityPanelButton = page.locator('.acc-button').first();

    this.anchors = {
      govBanner: this._govBanner,
      header: this._header,
      searchWrapper: this._searchWrapper,
      profileHeader: this._profileHeader,
      map: this._map,
      highlightsBar: this._highlightsBar,
      sections: this._sections,
      footer: this._footer,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Readiness / Navigation
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Waits for the profile SPA to finish rendering after a navigation (goto,
   * search-suggestion click, neighbor-link click). Asserts the profile root —
   * the state-name H1 — plus the sections shell, and fails LOUDLY if the page
   * never becomes ready (e.g. wrong URL, non-profile page, or slow render).
   * Call before any section read; waitForSections() calls this internally.
   * @param {number} [timeoutMs=15000] overall readiness budget
   * @returns {Promise<string>} the rendered state name (e.g. "Alabama")
   */
  async waitForReady(timeoutMs = 15000) {
    const deadline = Date.now() + timeoutMs;
    let lastErr = '';
    while (Date.now() < deadline) {
      const h1Count = await this._stateName.count().catch(() => 0);
      if (h1Count > 0) {
        const name = ((await this._stateName.first().textContent({ timeout: 2000 }).catch(() => '')) || '').trim();
        const sections = await this._sections.count().catch(() => 0);
        if (name && sections > 0) return name;
        lastErr = `H1 rendered ("${name}") but only ${sections} section shells present`;
      } else {
        lastErr = 'state-name H1 (.ProfileHeader h1.AquaText) not found (count=0)';
      }
      await this.page.waitForTimeout(500);
    }
    throw new Error(
      `CensusPagePO.waitForReady() timed out after ${timeoutMs}ms — the profile SPA never became ready. ` +
      `Last observation: ${lastErr}. ` +
      `Check the URL is a /profile/<State>?g=... page (current: ${this.page.url()}); ` +
      `if it is, retry after page.waitForLoadState("networkidle") or increase timeoutMs.`
    );
  }

  /**
   * Navigates to any state profile URL and waits for SPA readiness.
   * @param {string} url e.g. "https://data.census.gov/profile/Alabama?g=040XX00US01"
   *   (any state — nothing is hardcoded)
   * @param {number} [timeoutMs=15000] readiness budget passed to waitForReady()
   * @returns {Promise<string>} the rendered state name
   * @user-tasks open a state's profile by URL, goto the Texas profile
   */
  async gotoProfile(url, timeoutMs = 15000) {
    if (!/\/profile\//.test(url)) {
      throw new Error(
        `gotoProfile: URL "${url}" does not look like a profile page. ` +
        `Expected https://data.census.gov/profile/<StateName>?g=040XX00US<FIPS>.`
      );
    }
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    return await this.waitForReady(timeoutMs);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Validation
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Runs a checklist of every section root + critical locator; throws ONE
   * aggregated error listing all missing selectors. Called automatically on
   * tab open and navigation. Note: profile sections load lazily — only the
   * first section's shell is expected at load; use waitForSections() before
   * acting on later sections.
   * @returns {Promise<boolean>} true when every critical selector resolves.
   */
  async validate() {
    const issues = [];
    const checks = [
      ['govBanner', this._govBanner],
      ['header', this._header],
      ['searchInput', this._searchInput],
      ['navTabs', this._navTabs],
      ['profileHeader', this._profileHeader],
      ['stateName', this._stateName],
      ['shareButton', this._shareButton],
      ['highlightsBar', this._highlightsBar],
      ['sourceToggle', this._sourceToggle],
      ['sections', this._sections],
      ['footer', this._footer],
    ];
    for (const [name, loc] of checks) {
      const count = await loc.count().catch(() => 0);
      if (count === 0) issues.push({ name, count });
    }
    if (issues.length) {
      const advise = 'Some elements may need more time to render — try waiting for networkidle or scrolling. ' +
        'If the URL is not a /profile/<State> page, this PO does not apply.';
      throw new Error(
        `CensusPagePO.validate() failed — missing selectors:\n` +
        issues.map(i => `  - ${i.name} (count=${i.count})`).join('\n') +
        `\n${advise}`
      );
    }
    return true;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Gov Banner  (see concepts/gov-banner.md)
  // ─────────────────────────────────────────────────────────────────────────────

  /** The "An official website of the United States government" banner. */
  getGovBanner() { return this._govBanner; }

  /**
   * Expands the "Here's how you know" explanation (.gov / HTTPS guidance).
   * Defensive no-op if already expanded or the banner is absent.
   * @returns {Promise<boolean>} true if the menu is now visible.
   */
  async expandHowYouKnow() {
    const visible = await this._govMenu.isVisible({ timeout: 2000 }).catch(() => false);
    if (visible) return true;
    await this._howYouKnowBtn.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
    await this._howYouKnowBtn.click({ timeout: 5000 });
    return await this._govMenu.isVisible({ timeout: 3000 }).catch(() => false);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Header / Search / Nav Tabs  (see concepts/header.md, concepts/searchbar.md)
  // ─────────────────────────────────────────────────────────────────────────────

  /** App header root (logo, search, tabs, help links). */
  getHeader() { return this._header; }

  /** Census logo link (navigates away to census.gov). @aliases the logo, census home */
  getLogoLink() { return this._logo; }

  /** Click the logo — navigates AWAY to https://www.census.gov. */
  async clickLogo() {
    await this._logo.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
    await this._logo.click({ timeout: 5000 });
  }

  /** The type-in search input ("Search for an area, a topic, or both"). */
  getSearchInput() { return this._searchInput; }

  /**
   * Types a query into the search bar (does NOT submit). Suggestions appear in
   * the dropdown after ~1s debounce — use getSearchSuggestions().
   * @param {string} query e.g. "Texas", "median income"
   */
  async search(query) {
    await this._searchInput.click({ timeout: 5000 });
    await this._searchInput.fill(query);
  }

  /**
   * Returns the dropdown suggestion texts (areas, topics, profiles) after the
   * debounce. Empty array if the dropdown never opens.
   * @returns {Promise<string[]>}
   */
  async getSearchSuggestions() {
    await this.page.waitForTimeout(1200); // suggestion debounce/fetch
    const count = await this._searchSuggestion.count().catch(() => 0);
    const out = [];
    for (let i = 0; i < count; i++) {
      const t = await this._searchSuggestion.nth(i).textContent({ timeout: 2000 }).catch(() => '');
      if (t && t.trim()) out.push(t.trim());
    }
    return out;
  }

  /**
   * Clicks a search suggestion by (partial, case-insensitive) text — e.g.
   * "Texas Profile" navigates to that state's profile page.
   * @param {string} name partial text of the suggestion
   */
  async clickSearchSuggestion(name) {
    const count = await this._searchSuggestion.count().catch(() => 0);
    for (let i = 0; i < count; i++) {
      const t = (await this._searchSuggestion.nth(i).textContent({ timeout: 2000 }).catch(() => '')) || '';
      if (t.toLowerCase().includes(name.toLowerCase())) {
        await this._searchSuggestion.nth(i).click({ timeout: 5000 });
        return;
      }
    }
    throw new Error(`clickSearchSuggestion: no suggestion matched "${name}". Use getSearchSuggestions() to list available suggestions.`);
  }

  /** Clears the search input via the Clear Text button. Defensive no-op if empty. */
  async clearSearch() {
    const v = await this._searchInput.inputValue({ timeout: 2000 }).catch(() => '');
    if (!v) return;
    await this._searchClear.click({ timeout: 5000 });
  }

  /** Submits the search via the Search Button. Navigates to search results. */
  async submitSearch() {
    await this._searchButton.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
    await this._searchButton.click({ timeout: 5000 });
  }

  /** "Explore Filters" link — navigates to /advanced (Advanced Search). */
  getExploreFiltersLink() { return this._exploreFilters; }

  /** Nav tab links: All / Tables / Maps / Charts / Profiles / Pages. */
  getNavTabs() { return this._navTabs; }

  /**
   * Clicks a nav tab by name — navigates within data.census.gov keeping the
   * current geography (?g=...).
   * @param {string} name one of "All" | "Tables" | "Maps" | "Charts" | "Profiles" | "Pages"
   * @user-tasks go to tables, open the maps tab
   */
  async clickNavTab(name) {
    const count = await this._navTabs.count().catch(() => 0);
    for (let i = 0; i < count; i++) {
      const t = (await this._navTabs.nth(i).textContent({ timeout: 2000 }).catch(() => '')) || '';
      if (t.trim().toLowerCase() === name.toLowerCase()) {
        await this._navTabs.nth(i).click({ timeout: 5000 });
        return;
      }
    }
    throw new Error(`clickNavTab: no tab named "${name}". Tabs are All, Tables, Maps, Charts, Profiles, Pages — use getNavTabs() to inspect.`);
  }

  /** data.census.gov home link (help-links cluster). Navigates to /. */
  getHomeLink() { return this._homeLink; }

  /** Apps link — navigates to /app. */
  getAppsLink() { return this._appsLink; }

  /** Help dropdown button (opens the Help menu overlay). */
  getHelpButton() { return this._helpButton; }

  // ─────────────────────────────────────────────────────────────────────────────
  // Profile Header  (see concepts/profile-header.md)
  // ─────────────────────────────────────────────────────────────────────────────

  /** Profile header root (type, name, description, neighbors, share). */
  getProfileHeader() { return this._profileHeader; }

  /** The state name H1 (e.g. "Kansas"). @returns {Promise<string>} */
  async getStateName() {
    return ((await this._stateName.textContent({ timeout: 3000 }).catch(() => '')) || '').trim();
  }

  /** The geography type label (e.g. "State"). @returns {Promise<string>} */
  async getProfileType() {
    return ((await this._profileType.textContent({ timeout: 3000 }).catch(() => '')) || '').trim();
  }

  /** The narrative description (land/water area, rank, bordering states). */
  async getDescription() {
    return ((await this._description.textContent({ timeout: 3000 }).catch(() => '')) || '').replace(/\s+/g, ' ').trim();
  }

  /** Links to bordering states' profiles (e.g. Nebraska, Missouri...). */
  getNeighborStateLinks() { return this._neighborLinks; }

  /**
   * Returns [{name, href}] for bordering-state profile links.
   * @returns {Promise<{name: string, href: string}[]>}
   */
  async getNeighborStates() {
    const count = await this._neighborLinks.count().catch(() => 0);
    const out = [];
    for (let i = 0; i < count; i++) {
      const name = ((await this._neighborLinks.nth(i).textContent({ timeout: 2000 }).catch(() => '')) || '').trim();
      const href = await this._neighborLinks.nth(i).getAttribute('href', { timeout: 2000 }).catch(() => null);
      out.push({ name, href: href || '' });
    }
    return out;
  }

  /**
   * Navigates to a bordering state's profile by name.
   * @param {string} name e.g. "Nebraska"
   * @user-tasks go to the neighboring state, open Oklahoma's profile
   */
  async clickNeighborState(name) {
    const count = await this._neighborLinks.count().catch(() => 0);
    for (let i = 0; i < count; i++) {
      const t = ((await this._neighborLinks.nth(i).textContent({ timeout: 2000 }).catch(() => '')) || '').trim();
      if (t.toLowerCase() === name.toLowerCase()) {
        await this._neighborLinks.nth(i).click({ timeout: 5000 });
        return;
      }
    }
    throw new Error(`clickNeighborState: no bordering state matched "${name}". Use getNeighborStates() to list them.`);
  }

  /** The "Share Profile" button (id embeds the state slug: share-button_kansas). */
  getShareButton() { return this._shareButton; }

  /**
   * Opens the Share Profile dialog (social buttons + copy-URL).
   * See flow share-profile.md. Close with closeDialog().
   */
  async openShareDialog() {
    if (await this._dialog.isVisible({ timeout: 1000 }).catch(() => false)) return;
    await this._shareButton.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
    await this._shareButton.click({ timeout: 5000 });
    await this._dialog.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  }

  /** Social share targets in the dialog (X, Facebook, ...). */
  getSocialShareButtons() { return this._socialShareButtons; }

  /** Copies the profile URL to the clipboard from the open Share dialog. */
  async copyShareUrl() {
    if (!(await this._dialog.isVisible({ timeout: 2000 }).catch(() => false))) {
      throw new Error('copyShareUrl: the Share dialog is not open. Call openShareDialog() first.');
    }
    await this._copyUrlButton.click({ timeout: 5000 });
  }

  /**
   * Closes any open aqua dialog (Share dialog, chart Share/Embed, Help).
   * NOTE: clicking the backdrop does NOT close it — only the close button does.
   * Defensive no-op when no dialog is open.
   */
  async closeDialog() {
    if (!(await this._dialog.isVisible({ timeout: 1000 }).catch(() => false))) return;
    await this._dialogClose.click({ timeout: 5000 });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Map  (see concepts/map.md)
  // ─────────────────────────────────────────────────────────────────────────────

  /** The MapLibre map canvas container for the state. */
  getMap() { return this._map; }

  /** Zooms the map in one step. */
  async zoomInMap() {
    await this._zoomIn.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
    await this._zoomIn.click({ timeout: 5000 });
  }

  /** Zooms the map out one step. */
  async zoomOutMap() {
    await this._zoomOut.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
    await this._zoomOut.click({ timeout: 5000 });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Highlights / Jump-Links Bar  (see concepts/highlights-bar.md)
  // ─────────────────────────────────────────────────────────────────────────────

  /** The sticky highlights bar (breadcrumbs, sources toggle, jump cards). */
  getHighlightsBar() { return this._highlightsBar; }

  /** "United States" breadcrumb — navigates to the US profile. */
  getUsBreadcrumbLink() { return this._usBreadcrumb; }

  /**
   * Returns the Display Sources toggle state.
   * @returns {Promise<boolean>} true = sources shown.
   */
  async isSourceToggleOn() {
    const v = await this._sourceToggle.getAttribute('aria-checked', { timeout: 2000 }).catch(() => null);
    return v === 'true';
  }

  /**
   * Sets the Display Sources toggle. Defensive no-op when already in state.
   * GOTCHA: only clicks on the inner .wrapper land — the toggle root ignores clicks.
   * @param {boolean} on
   */
  async setDisplaySources(on) {
    if ((await this.isSourceToggleOn()) === on) return;
    await this._sourceToggleWrapper.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
    await this._sourceToggleWrapper.click({ timeout: 5000 });
    await this.page.waitForTimeout(300); // CSS transition on source links
  }

  /** Jump-link buttons for each topic section (by section name). */
  getSectionJumpButtons() { return this._sectionJumpButtons; }

  /**
   * Scrolls to a topic section via its jump-link button (e.g. "Education").
   * Also triggers the section's lazy load.
   * @param {string} sectionName e.g. "Housing"
   * @user-tasks jump to the Health section, scroll to Education
   */
  async jumpToSection(sectionName) {
    const count = await this._sectionJumpButtons.count().catch(() => 0);
    for (let i = 0; i < count; i++) {
      const label = (await this._sectionJumpButtons.nth(i).getAttribute('aria-label', { timeout: 2000 }).catch(() => '')) || '';
      if (label.toLowerCase().startsWith(sectionName.toLowerCase())) {
        await this._sectionJumpButtons.nth(i).scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
        await this._sectionJumpButtons.nth(i).click({ timeout: 5000 });
        return;
      }
    }
    throw new Error(`jumpToSection: no section matched "${sectionName}". Use getSectionNames() to list sections.`);
  }

  /**
   * Returns the key highlight stats shown on the cards (e.g. Total Population
   * 2,937,880; Median Household Income $75,514).
   * @returns {Promise<{label: string, value: string}[]>}
   */
  async getHighlights() {
    const count = await this._highlightCards.count().catch(() => 0);
    const out = [];
    for (let i = 0; i < count; i++) {
      const card = this._highlightCards.nth(i);
      const label = ((await card.locator('.highlight-label').first().textContent({ timeout: 2000 }).catch(() => '')) || '').trim();
      const value = ((await card.locator('.highlight-value').first().textContent({ timeout: 2000 }).catch(() => '')) || '').trim();
      if (label || value) out.push({ label, value });
    }
    return out;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Profile Sections  (see concepts/profile-sections.md)
  // ─────────────────────────────────────────────────────────────────────────────

  /** All topic <section> elements (Populations and People ... Nearby States). */
  getSections() { return this._sections; }

  /**
   * Names of all topic sections (h2 titles).
   * @returns {Promise<string[]>}
   */
  async getSectionNames() {
    const count = await this._sectionTitles.count().catch(() => 0);
    const out = [];
    for (let i = 0; i < count; i++) {
      const t = ((await this._sectionTitles.nth(i).textContent({ timeout: 2000 }).catch(() => '')) || '').trim();
      if (t) out.push(t);
    }
    return out;
  }

  /**
   * How many sections have finished lazy-loading (no .LoadingScreen placeholder).
   * @returns {Promise<number>}
   */
  async getLoadedSectionCount() {
    const total = await this._sections.count().catch(() => 0);
    let loaded = 0;
    for (let i = 0; i < total; i++) {
      const has = await this._sections.nth(i).locator('.LoadingScreen').count().catch(() => 0);
      if (has === 0) loaded++;
    }
    return loaded;
  }

  /**
   * Internal: case-insensitive FUZZY name matcher — exact match wins, then
   * substring containment (so "Population" matches "Populations and People",
   * "housing" matches "Housing"). Throws a rich error listing candidates.
   * @param {string[]} candidates rendered names
   * @param {string} query user-supplied name
   * @param {string} methodName for error messages
   * @returns {number} index into candidates
   */
  _matchName(candidates, query, methodName) {
    const q = query.toLowerCase().trim();
    let idx = candidates.findIndex(n => n.toLowerCase() === q);
    if (idx === -1) idx = candidates.findIndex(n => n.toLowerCase().includes(q));
    if (idx === -1) {
      throw new Error(
        `${methodName}: no name matched "${query}" (matching is case-insensitive exact-or-substring). ` +
        `Available: ${candidates.join(', ') || '(none — page may not be ready; call waitForReady()/waitForSections())'}.`
      );
    }
    return idx;
  }

  /**
   * Scrolls through the page to force every section to lazy-load, then waits.
   * FAILS LOUDLY if the profile SPA is not rendered yet (asserts the state-name
   * H1 and at least one section shell BEFORE scrolling) — so a non-loaded page
   * can never silently "succeed" with zero sections.
   * Call before reading stats in later sections (Housing, Health, ...).
   * @param {number} [settleMs=1500] wait after the final scroll for XHR + render
   */
  async waitForSections(settleMs = 1500) {
    await this.waitForReady();
    const total = await this._sections.count().catch(() => 0);
    if (total === 0) {
      throw new Error(
        `waitForSections: 0 section shells found on a rendered profile — ` +
        `unexpected for ${this.page.url()}. The SPA may still be hydrating; retry or call waitForReady() first.`
      );
    }
    for (let i = 0; i < total; i++) {
      await this._sections.nth(i).scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
      await this.page.waitForTimeout(250);
    }
    await this.page.waitForTimeout(settleMs);
  }

  /**
   * Permalink (anchor) href of a section, e.g. ...#education.
   * @param {string} sectionName
   * @returns {Promise<string|null>}
   */
  async getSectionLink(sectionName) {
    const names = await this.getSectionNames();
    const idx = names.findIndex(n => n.toLowerCase() === sectionName.toLowerCase());
    if (idx === -1) {
      throw new Error(`getSectionLink: no section matched "${sectionName}". Use getSectionNames() to list sections.`);
    }
    return await this._sectionLinks.nth(idx).getAttribute('href', { timeout: 2000 }).catch(() => null);
  }

  /**
   * Subtopic (h3) titles within a section, e.g. "Age and Sex", "Veterans".
   * @param {string} sectionName
   * @returns {Promise<string[]>}
   */
  async getSubtopics(sectionName) {
    const names = await this.getSectionNames();
    const idx = this._matchName(names, sectionName, 'getSubtopics');
    const titles = this._sections.nth(idx).locator('h3.topic-title');
    const count = await titles.count().catch(() => 0);
    const out = [];
    for (let i = 0; i < count; i++) {
      const t = ((await titles.nth(i).textContent({ timeout: 2000 }).catch(() => '')) || '').trim();
      if (t) out.push(t);
    }
    return out;
  }

  /**
   * Featured stats (estimate ± MoE + description) inside a section — the
   * state value first, the US comparison second.
   * @param {string} sectionName
   * @returns {Promise<{value: string, moe: string, description: string}[]>}
   */
  async getSectionStats(sectionName) {
    const names = await this.getSectionNames();
    const idx = this._matchName(names, sectionName, 'getSectionStats');
    const stats = this._sections.nth(idx).locator('.FeaturedStatEstimate');
    const count = await stats.count().catch(() => 0);
    const out = [];
    for (let i = 0; i < count; i++) {
      const s = stats.nth(i);
      const value = ((await s.locator('.measure-estimate-value').first().textContent({ timeout: 2000 }).catch(() => '')) || '').trim();
      const moe = ((await s.locator('.measure-moe').first().textContent({ timeout: 2000 }).catch(() => '')) || '').replace(/\s+/g, ' ').trim();
      const description = ((await s.locator('.measure-description').first().textContent({ timeout: 2000 }).catch(() => '')) || '').trim();
      out.push({ value, moe, description });
    }
    return out;
  }

  /**
   * Chart titles within a section (h4, e.g. "Population Pyramid: Population by
   * Age and Sex").
   * @param {string} sectionName
   * @returns {Promise<string[]>}
   */
  async getSectionChartTitles(sectionName) {
    const names = await this.getSectionNames();
    const idx = names.findIndex(n => n.toLowerCase() === sectionName.toLowerCase());
    if (idx === -1) {
      throw new Error(`getSectionChartTitles: no section matched "${sectionName}". Use getSectionNames() to list sections.`);
    }
    const titles = this._sections.nth(idx).locator('h4.chart-title');
    const count = await titles.count().catch(() => 0);
    const out = [];
    for (let i = 0; i < count; i++) {
      const t = ((await titles.nth(i).textContent({ timeout: 2000 }).catch(() => '')) || '').trim();
      if (t) out.push(t);
    }
    return out;
  }

  /**
   * Clicks a chart's "Show Table" button — opens an inline .preview-table-popup
   * (ag-grid data table) under the chart. Close with closeTablePopup().
   * @param {number} index 0-based chart index within the whole page (chart order)
   * @user-tasks show the data table for a chart
   */
  async showChartTable(index = 0) {
    const count = await this._showTableButtons.count().catch(() => 0);
    if (index >= count) {
      throw new Error(`showChartTable: index ${index} out of range (${count} Show Table buttons). Charts with tables start at the 2nd chart; use getSectionChartTitles() to orient.`);
    }
    await this._showTableButtons.nth(index).scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
    await this._showTableButtons.nth(index).click({ timeout: 5000 });
    await this.page.waitForTimeout(800); // ag-grid table render
  }

  /** Closes the open chart data-table popup. Defensive no-op if none open. */
  async closeTablePopup() {
    if (!(await this._tablePopup.isVisible({ timeout: 1000 }).catch(() => false))) return;
    await this._tablePopupClose.click({ timeout: 5000 });
  }

  /**
   * Toggles "Display Margin of Error" for a chart (0-based index across the
   * page). GOTCHA: like the sources toggle, clicks land on the inner .wrapper.
   * @param {number} index
   * @param {boolean} on
   */
  async setChartMoe(index, on) {
    const count = await this._moeToggles.count().catch(() => 0);
    if (index >= count) {
      throw new Error(`setChartMoe: index ${index} out of range (${count} MoE toggles).`);
    }
    const t = this._moeToggles.nth(index);
    const cur = (await t.getAttribute('aria-checked', { timeout: 2000 }).catch(() => null)) === 'true';
    if (cur === on) return;
    await t.locator('.wrapper').first().scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
    await t.locator('.wrapper').first().click({ timeout: 5000 });
    await this.page.waitForTimeout(400); // chart re-render
  }

  /**
   * Opens a chart's "Share / Embed" dialog. Close with closeDialog().
   * @param {number} index 0-based share-embed button index
   */
  async openChartShareEmbed(index = 0) {
    const count = await this._shareEmbedButtons.count().catch(() => 0);
    if (index >= count) {
      throw new Error(`openChartShareEmbed: index ${index} out of range (${count} Share/Embed buttons).`);
    }
    await this._shareEmbedButtons.nth(index).scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
    await this._shareEmbedButtons.nth(index).click({ timeout: 5000 });
    await this._dialog.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Profile Sections — by-title / by-subtopic accessors  (see concepts/profile-sections.md)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Internal: resolves a chart's .TopicChartContainer by its h4 title via
   * _matchName (case-insensitive exact-or-substring). Throws a rich error
   * naming available titles on miss.
   * @param {string} chartTitle
   * @returns {Promise<import('playwright').Locator>}
   */
  async _chartContainerByTitle(chartTitle) {
    const count = await this._chartContainers.count().catch(() => 0);
    const titles = [];
    for (let i = 0; i < count; i++) {
      const t = ((await this._chartContainers.nth(i).locator('h4.chart-title').first()
        .textContent({ timeout: 1000 }).catch(() => '')) || '').trim();
      titles.push(t);
    }
    const idx = this._matchName(titles, chartTitle, '_chartContainerByTitle');
    return this._chartContainers.nth(idx);
  }

  /**
   * Opens a chart's data table by chart TITLE (state-independent) — no index
   * arithmetic needed. Read it with getTablePopupData(); close with closeTablePopup().
   * @param {string} chartTitle e.g. "Housing Value", "Veterans by Sex"
   * @user-tasks show the table for the Housing Value chart
   */
  async showChartTableByTitle(chartTitle) {
    const c = await this._chartContainerByTitle(chartTitle);
    const btn = c.locator('button.chart-table-button').first();
    if (!(await btn.count().catch(() => 0))) {
      throw new Error(`showChartTableByTitle: chart "${chartTitle}" has no Show Table button (the population pyramid and chart-less sections don't).`);
    }
    await btn.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
    await btn.click({ timeout: 5000 });
    await this.page.waitForTimeout(800); // ag-grid table render
  }

  /**
   * Toggles "Display Margin of Error" for a chart by TITLE.
   * GOTCHA: like the sources toggle, clicks land on the inner .wrapper — and
   * synthetic (untrusted) JS clicks are ignored; only real (Playwright) clicks work.
   * @param {string} chartTitle
   * @param {boolean} on
   */
  async setChartMoeByTitle(chartTitle, on) {
    const c = await this._chartContainerByTitle(chartTitle);
    const t = c.locator('.moe-toggle-button').first();
    if (!(await t.count().catch(() => 0))) {
      throw new Error(`setChartMoeByTitle: chart "${chartTitle}" has no MoE toggle.`);
    }
    const cur = (await t.getAttribute('aria-checked', { timeout: 2000 }).catch(() => null)) === 'true';
    if (cur === on) return;
    await t.locator('.wrapper').first().scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
    await t.locator('.wrapper').first().click({ timeout: 5000 });
    await this.page.waitForTimeout(400); // chart re-render
  }

  /**
   * Opens a chart's Share/Embed dialog by TITLE. Close with closeDialog().
   * @param {string} chartTitle
   */
  async openChartShareEmbedByTitle(chartTitle) {
    const c = await this._chartContainerByTitle(chartTitle);
    const btn = c.locator('button.share-embed-button').first();
    await btn.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
    await btn.click({ timeout: 5000 });
    await this._dialog.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  }

  /**
   * Featured stats scoped to ONE subtopic (h3) of a section — e.g.
   * getSubtopicStats("Health", "Health Insurance") → the state + US estimates
   * for just that subtopic. Requires the section to be loaded (waitForSections()).
   * @param {string} sectionName
   * @param {string} subtopicName
   * @returns {Promise<{value: string, moe: string, description: string}[]>}
   */
  async getSubtopicStats(sectionName, subtopicName) {
    const sub = await this._subtopicLocator(sectionName, subtopicName, 'getSubtopicStats');
    const stats = sub.locator('.FeaturedStatEstimate');
    const count = await stats.count().catch(() => 0);
    const out = [];
    for (let i = 0; i < count; i++) {
      const s = stats.nth(i);
      const value = ((await s.locator('.measure-estimate-value').first().textContent({ timeout: 2000 }).catch(() => '')) || '').trim();
      const moe = ((await s.locator('.measure-moe').first().textContent({ timeout: 2000 }).catch(() => '')) || '').replace(/\s+/g, ' ').trim();
      const description = ((await s.locator('.measure-description').first().textContent({ timeout: 2000 }).catch(() => '')) || '').trim();
      out.push({ value, moe, description });
    }
    return out;
  }

  /**
   * Chart titles belonging to ONE subtopic of a section.
   * @param {string} sectionName
   * @param {string} subtopicName
   * @returns {Promise<string[]>}
   */
  async getSubtopicChartTitles(sectionName, subtopicName) {
    const sub = await this._subtopicLocator(sectionName, subtopicName, 'getSubtopicChartTitles');
    const titles = sub.locator('h4.chart-title');
    const count = await titles.count().catch(() => 0);
    const out = [];
    for (let i = 0; i < count; i++) {
      const t = ((await titles.nth(i).textContent({ timeout: 2000 }).catch(() => '')) || '').trim();
      if (t) out.push(t);
    }
    return out;
  }

  /** Internal: resolves a .SubTopic block by section + subtopic name. */
  async _subtopicLocator(sectionName, subtopicName, methodName) {
    const names = await this.getSectionNames();
    const idx = names.findIndex(n => n.toLowerCase() === sectionName.toLowerCase());
    if (idx === -1) {
      throw new Error(`${methodName}: no section matched "${sectionName}". Use getSectionNames() to list sections.`);
    }
    const subs = this._sections.nth(idx).locator('.SubTopic');
    const count = await subs.count().catch(() => 0);
    for (let i = 0; i < count; i++) {
      const t = ((await subs.nth(i).locator('h3.topic-title').first().textContent({ timeout: 1000 }).catch(() => '')) || '').trim();
      if (t.toLowerCase() === subtopicName.toLowerCase()) return subs.nth(i);
    }
    throw new Error(`${methodName}: no subtopic "${subtopicName}" in section "${sectionName}". Use getSubtopics("${sectionName}") to list subtopics.`);
  }

  /**
   * Source citations inside a section: [{table, dataset, href}] — the census
   * table id (e.g. "DP04"), dataset name, and the /table/... deep link.
   * Duplicates possible (featured stats + charts cite the same table).
   * @param {string} sectionName
   * @returns {Promise<{table: string, dataset: string, href: string}[]>}
   */
  async getSectionSourceLinks(sectionName) {
    const names = await this.getSectionNames();
    const idx = this._matchName(names, sectionName, 'getSectionSourceLinks');
    const links = this._sections.nth(idx).locator('a.source-field');
    const count = await links.count().catch(() => 0);
    const out = [];
    for (let i = 0; i < count; i++) {
      const l = links.nth(i);
      const table = ((await l.textContent({ timeout: 1000 }).catch(() => '')) || '').trim();
      const href = await l.getAttribute('href', { timeout: 1000 }).catch(() => null);
      const isTable = await l.evaluate(e => e.classList.contains('table')).catch(() => false);
      if (isTable) out.push({ table, dataset: '', href: href || '' });
      else if (out.length) out[out.length - 1].dataset = table;
    }
    return out;
  }

  /**
   * Reads the open chart data-table popup: {title, headers, rows} where rows
   * are arrays of cell strings (ag-grid). Empty title means no popup is open.
   * @returns {Promise<{title: string, headers: string[], rows: string[][]}>}
   */
  async getTablePopupData() {
    const open = await this._tablePopup.isVisible({ timeout: 1000 }).catch(() => false);
    if (!open) {
      throw new Error('getTablePopupData: no table popup is open. Call showChartTable(i) or showChartTableByTitle(title) first.');
    }
    const title = ((await this._tablePopupTitle.textContent({ timeout: 2000 }).catch(() => '')) || '').trim();
    const headers = await this._tablePopupHeaders.evaluateAll(els => els.map(e => e.textContent.trim())).catch(() => []);
    const rows = await this._tablePopupRows.evaluateAll(
      els => els.map(r => [...r.querySelectorAll('.ag-cell')].map(c => c.textContent.trim()))
    ).catch(() => []);
    return { title, headers, rows };
  }

  /**
   * The "Nearby States" final section: bordering-state profile cards.
   * @returns {Promise<{name: string, href: string}[]>}
   */
  async getNearbyStateProfiles() {
    const count = await this._nearbyProfileLinks.count().catch(() => 0);
    const out = [];
    for (let i = 0; i < count; i++) {
      const l = this._nearbyProfileLinks.nth(i);
      const t = ((await l.textContent({ timeout: 1000 }).catch(() => '')) || '').trim();
      const href = await l.getAttribute('href', { timeout: 1000 }).catch(() => null);
      if (t && t.toLowerCase() !== 'view profile' && !out.some(o => o.name === t)) {
        out.push({ name: t, href: href || '' });
      }
    }
    return out;
  }

  /**
   * Navigates to a nearby state's profile card link (final section).
   * @param {string} name e.g. "Oklahoma"
   * @user-tasks open the neighboring state card at the bottom of the page
   */
  async clickNearbyState(name) {
    const links = await this.getNearbyStateProfiles();
    const hit = links.find(l => l.name.toLowerCase() === name.toLowerCase());
    if (!hit) {
      throw new Error(`clickNearbyState: no nearby state matched "${name}". Use getNearbyStateProfiles() to list them.`);
    }
    const count = await this._nearbyProfileLinks.count().catch(() => 0);
    for (let i = 0; i < count; i++) {
      const t = ((await this._nearbyProfileLinks.nth(i).textContent({ timeout: 1000 }).catch(() => '')) || '').trim();
      if (t.toLowerCase() === name.toLowerCase()) {
        await this._nearbyProfileLinks.nth(i).click({ timeout: 5000 });
        return;
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Footer / Misc  (see concepts/footer.md)
  // ─────────────────────────────────────────────────────────────────────────────

  /** Page footer root (Accessibility, FOIA, ... links — all EXTERNAL). */
  getFooter() { return this._footer; }

  /**
   * Footer links [{text, href}] — all navigate away to census.gov/commerce.gov.
   * @returns {Promise<{text: string, href: string}[]>}
   */
  async getFooterLinks() {
    const count = await this._footerLinks.count().catch(() => 0);
    const out = [];
    for (let i = 0; i < count; i++) {
      const text = ((await this._footerLinks.nth(i).textContent({ timeout: 2000 }).catch(() => '')) || '').trim();
      const href = await this._footerLinks.nth(i).getAttribute('href', { timeout: 2000 }).catch(() => null);
      out.push({ text, href: href || '' });
    }
    return out;
  }

  /**
   * Clicks a footer link by partial text. WARNING: navigates AWAY from the profile.
   * @param {string} name e.g. "Accessibility", "FOIA"
   */
  async clickFooterLink(name) {
    const links = await this.getFooterLinks();
    const hit = links.find(l => l.text.toLowerCase().includes(name.toLowerCase()));
    if (!hit) {
      throw new Error(`clickFooterLink: no footer link matched "${name}". Use getFooterLinks() to list them.`);
    }
    await this._footerLinks.nth(links.indexOf(hit)).click({ timeout: 5000 });
  }

  /** "Skip to main content" buttons (top + bottom of page). */
  getSkipLinks() { return this._skipLinks; }

  /** The Accessibility panel opener (person icon, left of content). */
  getAccessibilityPanelButton() { return this._accessibilityPanelButton; }

  // ─────────────────────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * @typedef {Object} CensusPagePOState
   * @property {string} url - current page URL
   * @property {string} stateName - profiled state's H1 text (e.g. "Kansas")
   * @property {string} profileType - geography type label (e.g. "State")
   * @property {boolean} sourceToggleOn - Display Sources switch state
   * @property {number} sectionCount - total topic sections rendered
   * @property {number} loadedSectionCount - sections with content (no LoadingScreen)
   * @property {{label: string, value: string}[]} highlights - key stat cards
   * @property {number} neighborStateCount - bordering-state links
   * @property {string} searchQuery - current search input value
   * @property {boolean} shareDialogOpen - any aqua dialog visible
   * @property {boolean} tablePopupOpen - chart data-table popup visible
   * @property {number} moeTogglesOnCount - charts with MoE displayed
   * @property {number} chartCount - rendered charts (.TopicChartContainer)
   * @property {number} subtopicCount - rendered subtopic blocks (.SubTopic)
   */

  /**
   * Side-effect-free snapshot of all dynamic state. Never throws — every read
   * is defensively caught.
   * @returns {Promise<CensusPagePOState>}
   */
  async gatherState() {
    const [url, stateName, profileType, sourceToggleOn, sectionCount, loadedSectionCount,
           highlights, neighborStateCount, searchQuery, shareDialogOpen, tablePopupOpen,
           moeTogglesOnCount, chartCount, subtopicCount] = await Promise.all([
      this.page.url(),
      this.getStateName(),
      this.getProfileType(),
      this._sourceToggle.getAttribute('aria-checked', { timeout: 2000 }).catch(() => null).then(v => v === 'true'),
      this._sections.count().catch(() => 0),
      this.getLoadedSectionCount().catch(() => 0),
      this.getHighlights().catch(() => []),
      this._neighborLinks.count().catch(() => 0),
      this._searchInput.inputValue({ timeout: 2000 }).catch(() => ''),
      this._dialog.isVisible({ timeout: 1000 }).catch(() => false),
      this._tablePopup.isVisible({ timeout: 1000 }).catch(() => false),
      this._moeToggles.evaluateAll(els => els.filter(e => e.getAttribute('aria-checked') === 'true').length).catch(() => 0),
      this._chartContainers.count().catch(() => 0),
      this._subtopics.count().catch(() => 0),
    ]);
    return { url, stateName, profileType, sourceToggleOn, sectionCount, loadedSectionCount,
             highlights, neighborStateCount, searchQuery, shareDialogOpen, tablePopupOpen,
             moeTogglesOnCount, chartCount, subtopicCount };
  }

  /**
   * Polling observer; fires onChange(prev, next) only on real diffs.
   * @param {(prev: CensusPagePOState, next: CensusPagePOState) => void} onChange
   * @param {number} [intervalMs=1000]
   * @returns {() => void} unsubscribe
   */
  watchState(onChange, intervalMs = 1000) {
    let prev = null;
    let stopped = false;
    const poll = async () => {
      if (stopped) return;
      try {
        const next = await this.gatherState();
        if (prev !== null && JSON.stringify(prev) !== JSON.stringify(next)) {
          onChange(prev, next);
        }
        prev = next;
      } catch { /* best-effort */ }
      if (!stopped) setTimeout(poll, intervalMs);
    };
    poll();
    return () => { stopped = true; };
  }

  /**
   * Direct HTTP wrappers. NOTE: the profile's data XHR endpoints (Census API
   * behind data.census.gov) were not captured during authoring — the UI reads
   * are the reliable path. Public Census API docs: api.census.gov.
   */
  api = {
    /**
     * Fetch a URL from the page's origin (inherits cookies). Generic escape
     * hatch for discovered endpoints.
     * @param {{url: string}} args
     * @returns {Promise<any>}
     * @example await po.api.fetchJson({ url: 'https://api.census.gov/data/...' })
     */
    fetchJson: async ({ url }) => {
      return await this.page.evaluate(async (u) => (await (await fetch(u)).json()), url);
    },
  };
}

return CensusPagePO;

