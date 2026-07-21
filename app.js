// ============================================================
// HASARA & SHEHARA â€” Engagement Invitation
// ============================================================

const EVENT = {
  brideParents: "Mr. & Mrs. Liyanawanni Arachchi",
  groomParents: "Mr. & Mrs. Gamage",
  bride: "Hasara",
  groom: "Shehara",
  dateISO: "2026-08-20T09:30:00+05:30", // Sri Lanka time
  dateLabel: "20th August 2026",
  dayLabel: "Thursday",
  timeLabel: "9.30 a.m.",
  registrationTime: "10.05 a.m.",
  rsvpDeadline: "10th August 2026",
  venueName: "Rock Fort Beach Resort",
  hallName: "Blue Ocean Ballroom",
  address: "Dalawella, Unawatuna, Galle",
  mapsQuery: "Rock Fort Beach Resort, Dalawella, Unawatuna, Galle, Sri Lanka",
};

const STORAGE_KEY = "hs-rsvp-2026-responses";

const MAX_SUPPORTED_GUESTS = 10;

function sanitizeInviteeName(value) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 90);
}

function readPersonalInvitation() {
  const params = new URLSearchParams(window.location.search);
  const invitee = sanitizeInviteeName(params.get("invitee") || params.get("to"));
  const parsedGuests = Number.parseInt(params.get("guests") || params.get("g"), 10);
  const hasValidGuestCount = Number.isInteger(parsedGuests) && parsedGuests >= 1;
  const guests = hasValidGuestCount
    ? Math.min(parsedGuests, MAX_SUPPORTED_GUESTS)
    : 1;

  return {
    invitee,
    guests,
    isValid: Boolean(invitee) && hasValidGuestCount,
  };
}

const PERSONAL_INVITATION = readPersonalInvitation();


// ============================================================
// SVG assets (inline, theme-colored via currentColor / CSS vars)
// ============================================================

const cornerOrnamentSVG = `
<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M2 2 L2 24 Q2 2 24 2 Z" fill="none" stroke="var(--gold)" stroke-width="1"/>
  <path d="M2 2 L14 2 M2 2 L2 14" stroke="var(--gold)" stroke-width="1.4"/>
  <circle cx="2" cy="2" r="2.4" fill="var(--gold)"/>
</svg>`;

const dividerOrnamentSVG = `
<svg width="28" height="14" viewBox="0 0 28 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M2 7 Q14 -3 14 7 Q14 17 26 7" stroke="var(--gold)" stroke-width="1" fill="none" opacity="0.8"/>
  <circle cx="14" cy="7" r="2.2" fill="var(--gold)"/>
</svg>`;

const scrollCueSVG = `
<svg width="20" height="30" viewBox="0 0 20 30" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="18" height="28" rx="9" stroke="currentColor" stroke-width="1.2"/>
  <circle cx="10" cy="9" r="2.4" fill="currentColor"/>
</svg>`;

const iconCalendar = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>`;
const iconClock = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>`;
const iconPin = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/></svg>`;
const iconCheck = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`;
const iconWhatsapp = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5C10 9 9.4 7.6 9.1 7c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.1-1.4-.1-.1-.2-.2-.5-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.6 1.4 5.1L2 22l5-1.3c1.4.8 3.1 1.2 4.9 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>`;
const iconShare = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2.8"/><circle cx="6" cy="12" r="2.8"/><circle cx="18" cy="19" r="2.8"/><path d="M8.4 10.6l7.2-4.2M8.4 13.4l7.2 4.2"/></svg>`;
const iconMap = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 20l-6-2V4l6 2 6-2 6 2v14l-6-2-6 2z"/><path d="M9 6v14M15 4v14"/></svg>`;
const iconTap = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12.5V6a2 2 0 1 1 4 0v5M13 11V5a2 2 0 1 1 4 0v7M17 12V9a2 2 0 1 1 4 0v6a7 7 0 0 1-7 7h-1a7 7 0 0 1-5.7-3l-3-4.6a1.8 1.8 0 0 1 2.8-2.2L9 14"/></svg>`;

// Monogram: legible serif H & S, built from precise letterform geometry, drawn on load
const monogramSVG = `
<svg viewBox="0 0 168 168" xmlns="http://www.w3.org/2000/svg">
  <circle class="monogram-ring" cx="84" cy="84" r="78"/>
  <circle class="monogram-ring" cx="84" cy="84" r="70" opacity="0.35"/>
  <g class="monogram-letters">
    <!-- H: two verticals + crossbar, serif feet -->
    <path class="p1" d="
      M 40 46 L 40 100
      M 34 46 L 46 46
      M 34 100 L 46 100
      M 68 46 L 68 100
      M 62 46 L 74 46
      M 62 100 L 74 100
      M 40 73 L 68 73
    "/>
    <!-- S: single continuous serif S-curve -->
    <path class="p2" d="
      M 116 52
      C 100 44, 86 50, 86 62
      C 86 74, 100 72, 108 76
      C 118 81, 120 90, 108 96
      C 98 101, 88 97, 84 90
    "/>
  </g>
</svg>`;

// ============================================================
// Storage helpers (built-in persistent artifact storage)
// ============================================================

// ============================================================
// RSVP submission â€” via Google Apps Script (writes to a Sheet you own)
//
// SETUP REQUIRED (one-time, ~10 min): see the deployment guide.
// Paste your deployed Apps Script Web App URL below. Until you do,
// RSVPs still work and save safely to each guest's own browser â€”
// you just won't see a combined live list yet.
// ============================================================

const APPS_SCRIPT_URL = window.INVITATION_CONFIG?.APPS_SCRIPT_URL || "YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";

function isAppsScriptConfigured() {
  return APPS_SCRIPT_URL && APPS_SCRIPT_URL !== "YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
}

async function saveRSVP(entry) {
  entry.id = "rsvp_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
  entry.submittedAt = new Date().toISOString();

  // Local fallback so nothing is ever silently lost, even if the Apps
  // Script isn't configured yet or the network request fails. This uses
  // the browser's own localStorage, which works on any static host
  // (unlike window.storage, which only exists inside Claude.ai's editor).
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    existing.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    /* localStorage can fail in private browsing; not fatal */
  }

  if (!isAppsScriptConfigured()) {
    // Script not wired up yet â€” entry is still saved locally above, but
    // nothing is sent to a shared Sheet.
    console.warn("Apps Script not configured yet â€” RSVP saved locally only. See setup guide.");
    return entry;
  }

  const body = new URLSearchParams();
  body.append("name", entry.name || "");
  body.append("phone", entry.phone || "");
  body.append("attending", entry.attending === "yes" ? "Yes" : "No");
  body.append("guests", String(entry.guestCount || 0));
  body.append("message", entry.message || "");
  body.append("submittedAt", entry.submittedAt);

  // Apps Script Web Apps redirect once before serving the real response,
  // and that redirect doesn't reliably carry CORS headers guests' browsers
  // will accept. mode: "no-cors" sends the request without asking to read
  // the response back â€” we don't need to read it, since success/failure
  // is instead confirmed by opening the Sheet.
  //
  // This is deliberately its own try/catch, separate from the outer one
  // in wireRSVPForm(). The entry is already safe in localStorage by this
  // point (see above), so a flaky connection, an offline guest, or a
  // mistyped APPS_SCRIPT_URL should never block the guest from seeing
  // their "Thank You" â€” it should only mean this one submission doesn't
  // reach the shared Sheet, silently and without alarming the guest.
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
  } catch (networkErr) {
    console.warn("Could not reach the Apps Script Sheet â€” RSVP is still saved locally.", networkErr);
  }

  return entry;
}

async function getAllRSVPs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

// ============================================================
// Sparkle field (hero background ambience)
// ============================================================

function initSparkleField() {
  const field = document.getElementById("sparkle-field");
  if (!field) return;

  const count = 18;
  let html = "";
  for (let i = 0; i < count; i++) {
    const size = (Math.random() * 3 + 1.5).toFixed(1);
    const left = (Math.random() * 100).toFixed(1);
    const top = (Math.random() * 100).toFixed(1);
    const driftDuration = (Math.random() * 6 + 6).toFixed(1);
    const twinkleDuration = (Math.random() * 3 + 2).toFixed(1);
    const delay = (Math.random() * 6).toFixed(1);
    html += `<div class="sparkle" style="
      width:${size}px; height:${size}px;
      left:${left}%; top:${top}%;
      animation-duration:${driftDuration}s, ${twinkleDuration}s;
      animation-delay:${delay}s, ${delay}s;
    "></div>`;
  }
  field.innerHTML = html;
}

// ============================================================
// Monogram draw-in (measures real path length so the stroke
// animation is always accurate, regardless of path geometry)
// ============================================================

function initMonogramDraw() {
  const paths = document.querySelectorAll(".monogram-letters path");
  paths.forEach((path) => {
    const len = path.getTotalLength();
    path.style.setProperty("--path-len", len);
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    // Force reflow so the browser registers the starting offset before we
    // add the animation class, otherwise the draw-in can flash at full length.
    path.getBoundingClientRect();
    path.classList.add("draw-ready");
  });
}

// ============================================================
// Scroll reveal
// ============================================================

function initScrollReveal() {
  const els = document.querySelectorAll(".fade-up");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  els.forEach((el) => io.observe(el));
}

// ============================================================
// Countdown
// ============================================================

function initCountdown() {
  const el = document.getElementById("countdown-row");
  if (!el) return;
  const target = new Date(EVENT.dateISO).getTime();

  function tick() {
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) {
      el.innerHTML = `<div class="countdown-cell" style="min-width:auto;padding:16px 28px;"><div class="serif" style="font-size:20px;color:var(--gold-deep);">Today is the day! âœ¨</div></div>`;
      clearInterval(timer);
      return;
    }
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    el.innerHTML = [
      { v: d, l: "Days" },
      { v: h, l: "Hours" },
      { v: m, l: "Mins" },
      { v: s, l: "Secs" },
    ]
      .map(
        (u) => `
      <div class="countdown-cell">
        <div class="countdown-num">${String(u.v).padStart(2, "0")}</div>
        <div class="countdown-label">${u.l}</div>
      </div>`
      )
      .join("");
  }
  tick();
  const timer = setInterval(tick, 1000);
}

// ============================================================
// Gate (tap-to-open first impression)
// ============================================================

function wireGate() {
  const gate = document.getElementById("gate");
  if (!gate) return;

  let opened = false;

  function openGate() {
    if (opened) return;
    opened = true;

    gate.classList.add("opening");
    document.body.classList.add("invitation-open");
    initScrollReveal();

    // Give the closing transition time to finish before removing the gate
    // and unlocking scroll, so nothing jumps mid-animation.
    setTimeout(() => {
      document.documentElement.classList.remove("gate-active");
      gate.remove();
    }, 1220);
  }

  gate.addEventListener("click", openGate);
  gate.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openGate();
    }
  });
}

// ============================================================
// Calendar file (.ics) generator â€” "Add to Calendar"
// ============================================================

function downloadICS() {
  const start = "20260820T093000";
  const end = "20260820T140000";
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hasara & Shehara//Engagement//EN",
    "BEGIN:VEVENT",
    "UID:" + Date.now() + "@hasara-shehara.engagement",
    "DTSTAMP:" + new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z",
    "DTSTART;TZID=Asia/Colombo:" + start,
    "DTEND;TZID=Asia/Colombo:" + end,
    "SUMMARY:Hasara & Shehara's Engagement",
    "DESCRIPTION:Join us as we celebrate the engagement of Hasara & Shehara.",
    "LOCATION:" + EVENT.hallName + ", " + EVENT.venueName + ", " + EVENT.address,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Hasara-and-Shehara-Engagement.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================================
// Share invitation link
// ============================================================

async function shareInvite() {
  const url = window.location.href.split("#")[0];
  const inviteeName = PERSONAL_INVITATION.isValid ? PERSONAL_INVITATION.invitee : "Guest";
  const allocatedGuests = PERSONAL_INVITATION.isValid ? PERSONAL_INVITATION.guests : 1;
  const guestText = allocatedGuests === 1 ? "1 guest" : `${allocatedGuests} guests`;

  const text =
    `Dear ${inviteeName},\n\n` +
    `With great pleasure, we warmly invite you to celebrate the engagement ceremony of Hasara and Shehara.\n\n` +
    `Date: ${EVENT.dateLabel}\n` +
    `Venue: ${EVENT.venueName}, Unawatuna, Galle\n\n` +
    `This invitation is reserved for ${guestText}.\n\n` +
    `Please open your personalized invitation and kindly submit your RSVP using the link below.`;

  if (navigator.share) {
    try {
      await navigator.share({ title: "Hasara & Shehara | Engagement Ceremony", text, url });
      return;
    } catch (error) {
      if (error && error.name === "AbortError") return;
    }
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + "\n\n" + url)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}

// ============================================================
// Main render
// ============================================================

function renderMain() {
  const root = document.getElementById("root");

  root.innerHTML = `
    <!-- ============ REFINED OPENING COVER ============ -->
    <div class="gate" id="gate" role="button" tabindex="0" aria-label="Open the engagement ceremony invitation">
      <div class="gate-panel left" aria-hidden="true"></div>
      <div class="gate-panel right" aria-hidden="true"></div>
      <div class="gate-opening-line" aria-hidden="true"></div>
      <div class="wrap">
        <div class="gate-frame">
          <div class="gate-kicker">You Are Cordially Invited To</div>
          <div class="gate-title">OUR<br>ENGAGEMENT<br>CEREMONY</div>
          <div class="gate-date">20 &middot; 08 &middot; 2026</div>
          <div class="gate-rule" aria-hidden="true"></div>
          <div class="gate-cta-text" style="border:none; border-bottom:none; box-shadow:none; background:none;">Tap to Open Invitation</div>
        </div>
      </div>
    </div>

    <!-- ============ FLYER (revealed once the gate opens) ============ -->
    <section class="flyer-section" id="flyer-section">
      <img
        class="flyer-image"
        src="invitation-flyer.jpg"
        alt="Hasara and Shehara engagement invitation, Thursday 20th August 2026 at 9.30 a.m., Rock Fort Beach Resort, Blue Ocean Ballroom, Dalawella, Unawatuna, Galle">
    </section>

    <!-- ============ COUNTDOWN ============ -->
    <section style="padding-top:30px; padding-bottom:64px;">
      <div class="wrap">
        <div class="section-head fade-up">
          <div class="eyebrow">Counting down to</div>
          <div class="section-title serif">Our Special Day</div>
        </div>
        <div class="countdown-row fade-up" id="countdown-row"></div>
      </div>
    </section>

    <!-- ============ VENUE MAP ============ -->
    <section>
      <div class="wrap">
        <div class="section-head fade-up">
          <div class="eyebrow">Find Us</div>
          <div class="section-title serif">The Venue</div>
        </div>

        <div class="venue-card fade-up">
          <iframe
            class="venue-map-frame"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=${encodeURIComponent(EVENT.mapsQuery)}&output=embed">
          </iframe>
          <div class="venue-card-body">
            <div class="venue-name serif">${EVENT.hallName}</div>
            <div class="venue-address">${EVENT.venueName}<br>${EVENT.address}</div>
            <div class="venue-btn-row">
              <a class="btn-gold" target="_blank" rel="noopener"
                 href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(EVENT.mapsQuery)}">
                 ${iconMap} Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ RSVP ============ -->
    <section id="rsvp-section">
      <div class="wrap">
        <div class="section-head fade-up">
          <div class="eyebrow">Kindly Respond</div>
          <div class="section-title serif">Will You Join Us?</div>
        </div>

        <p class="fade-up" style="text-align:center; font-size:12.5px; color:var(--ink-soft); margin-bottom:28px; margin-top:-20px;">
          Kindly respond before ${EVENT.rsvpDeadline}
        </p>

        <div class="rsvp-card fade-up" id="rsvp-card">
          ${rsvpFormHTML()}
        </div>
      </div>
    </section>

    <!-- ============ SHARE ============ -->
    <section style="padding-top:20px;">
      <div class="wrap" style="text-align:center;">
        <p class="fade-up" style="font-size:13px; color:var(--ink-soft); margin-bottom:18px;">
          Know someone else who's invited? Share this invitation with them.
        </p>
        <div class="fade-up" style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
          <button class="btn-gold share-btn-small" id="share-btn" type="button">${iconShare} Share</button>
        </div>
      </div>
    </section>

    <!-- ============ FOOTER ============ -->
    <footer class="footer">
      <div class="wrap">
        <div class="footer-monogram serif">H &amp; S</div>
        <div class="footer-line">With love &amp; gratitude</div>
      </div>
    </footer>
  `;

  document.getElementById("share-btn").addEventListener("click", shareInvite);

  initCountdown();
  wireRSVPForm();
  wireGate(); // starts scroll-reveal once the gate opens (see wireGate)
}

// ============================================================
// RSVP Form
// ============================================================

let rsvpState = {
  attending: null,
  guestCount: 1,
};

function rsvpFormHTML() {
  return `
    <form id="rsvp-form" novalidate>
      <div class="form-group">
        <label class="form-label" for="f-name">Your Name</label>
        <input class="form-input" type="text" id="f-name" name="name"
          placeholder="e.g. Nimal Perera" required autocomplete="name">
        <div class="form-error" id="err-name"></div>
      </div>

      <div class="form-group">
        <label class="form-label" for="f-phone">WhatsApp Number (optional)</label>
        <input class="form-input" type="tel" id="f-phone" name="phone"
          placeholder="e.g. 077 123 4567" autocomplete="tel">
      </div>

      <div class="form-group">
        <label class="form-label">Will you be attending?</label>
        <div class="attend-toggle">
          <button type="button" class="attend-btn" id="btn-yes" data-val="yes">
            <span class="attend-icon">&#10022;</span>Joyfully Accept
          </button>
          <button type="button" class="attend-btn" id="btn-no" data-val="no">
            <span class="attend-icon">&times;</span>Regretfully Decline
          </button>
        </div>
        <div class="form-error" id="err-attend"></div>
      </div>

      <div class="guest-fields" id="guest-fields">
        <div class="form-group">
          <label class="form-label">Number of Guests (including you)</label>
          <div class="guest-stepper">
            <button type="button" class="stepper-btn" id="guest-minus" aria-label="Reduce guest count">âˆ’</button>
            <div class="stepper-count" id="guest-count-display">1</div>
            <button type="button" class="stepper-btn" id="guest-plus" aria-label="Increase guest count">+</button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="f-message">Message for the Couple (optional)</label>
          <input class="form-input" type="text" id="f-message"
            placeholder="Wishing you both a lifetime of happiness...">
        </div>
      </div>

      <button type="submit" class="submit-btn" id="rsvp-submit">Send RSVP</button>
    </form>
  `;
}

function ensureAllocationNote() {
  if (!PERSONAL_INVITATION.isValid) return;
  const guestFields = document.getElementById("guest-fields");
  if (!guestFields || guestFields.querySelector(".allocation-note")) return;

  const note = document.createElement("div");
  note.className = "allocation-note";
  note.textContent = PERSONAL_INVITATION.guests === 1
    ? "Your invitation allocation is limited to 1 guest."
    : `Your invitation allocation is limited to ${PERSONAL_INVITATION.guests} guests.`;
  guestFields.insertAdjacentElement("afterbegin", note);
}

function applyPersonalizationToForm() {
  if (!PERSONAL_INVITATION.isValid) return;

  const nameInput = document.getElementById("f-name");
  if (nameInput) {
    nameInput.value = PERSONAL_INVITATION.invitee;
    nameInput.readOnly = true;
    nameInput.classList.add("invitee-name-locked");
    nameInput.setAttribute("aria-readonly", "true");
  }

  ensureAllocationNote();

  const plusBtn = document.getElementById("guest-plus");
  if (plusBtn) plusBtn.disabled = rsvpState.guestCount >= PERSONAL_INVITATION.guests;
}

function rsvpSuccessHTML(entry) {
  const attendingYes = entry.attending === "yes";
  const safeName = PERSONAL_INVITATION.isValid ? PERSONAL_INVITATION.invitee : entry.name;
  return `
    <div class="rsvp-success">
      <div class="rsvp-success-icon">${iconCheck}</div>
      <div class="rsvp-success-title serif">${attendingYes ? "Thank You!" : "We'll Miss You"}</div>
      <div class="rsvp-success-sub">
        ${attendingYes
          ? `Thank you, ${safeName}. Your RSVP for ${entry.guestCount} ${entry.guestCount === 1 ? "guest" : "guests"} has been received. We can't wait to celebrate with you on ${EVENT.dateLabel}!`
          : `Thank you for letting us know, ${safeName}. You'll be in our thoughts on our special day.`}
      </div>
      <button class="btn-outline" id="edit-rsvp-btn" type="button" style="margin-top:22px;">Edit my response</button>
    </div>
  `;
}

function wireRSVPForm() {
  const yesBtn = document.getElementById("btn-yes");
  const noBtn = document.getElementById("btn-no");
  const guestFields = document.getElementById("guest-fields");
  const guestDisplay = document.getElementById("guest-count-display");
  const minusBtn = document.getElementById("guest-minus");
  const plusBtn = document.getElementById("guest-plus");
  const form = document.getElementById("rsvp-form");
  if (!form || !yesBtn || !noBtn || !guestFields || !guestDisplay || !minusBtn || !plusBtn) return;

  const allowedGuests = PERSONAL_INVITATION.isValid
    ? PERSONAL_INVITATION.guests
    : MAX_SUPPORTED_GUESTS;

  function updateStepper() {
    rsvpState.guestCount = Math.min(Math.max(rsvpState.guestCount, 1), allowedGuests);
    guestDisplay.textContent = String(rsvpState.guestCount);
    minusBtn.disabled = rsvpState.guestCount <= 1;
    plusBtn.disabled = rsvpState.guestCount >= allowedGuests;
  }

  function setAttending(value) {
    rsvpState.attending = value;
    yesBtn.classList.toggle("selected-yes", value === "yes");
    noBtn.classList.toggle("selected-no", value === "no");
    document.getElementById("err-attend").textContent = "";
    guestFields.classList.toggle("open", value === "yes");
  }

  yesBtn.addEventListener("click", () => setAttending("yes"));
  noBtn.addEventListener("click", () => setAttending("no"));

  minusBtn.addEventListener("click", () => {
    if (rsvpState.guestCount > 1) rsvpState.guestCount -= 1;
    updateStepper();
  });

  plusBtn.addEventListener("click", () => {
    if (rsvpState.guestCount < allowedGuests) rsvpState.guestCount += 1;
    updateStepper();
  });

  updateStepper();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nameInput = document.getElementById("f-name");
    const phoneInput = document.getElementById("f-phone");
    const messageInput = document.getElementById("f-message");
    const name = PERSONAL_INVITATION.isValid
      ? PERSONAL_INVITATION.invitee
      : nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const message = messageInput.value.trim();

    document.getElementById("err-name").textContent = "";
    document.getElementById("err-attend").textContent = "";

    let hasError = false;
    if (!name) {
      document.getElementById("err-name").textContent = "Please enter your name.";
      hasError = true;
    }
    if (!rsvpState.attending) {
      document.getElementById("err-attend").textContent = "Please let us know if you can join.";
      hasError = true;
    }
    if (rsvpState.attending === "yes" && rsvpState.guestCount > allowedGuests) {
      document.getElementById("err-attend").textContent = "The selected guest count exceeds your invitation allocation.";
      hasError = true;
    }
    if (hasError) return;

    const submitBtn = document.getElementById("rsvp-submit");
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    // The existing backend fields are preserved exactly.
    const entry = {
      name,
      phone: phone || null,
      attending: rsvpState.attending,
      guestCount: rsvpState.attending === "yes" ? Math.min(rsvpState.guestCount, allowedGuests) : 0,
      message: message || null,
    };

    try {
      const saved = await saveRSVP(entry);
      const card = document.getElementById("rsvp-card");
      card.innerHTML = rsvpSuccessHTML(saved);

      document.getElementById("edit-rsvp-btn").addEventListener("click", () => {
        rsvpState = { attending: null, guestCount: 1 };
        card.innerHTML = rsvpFormHTML();
        wireRSVPForm();
        applyPersonalizationToForm();
      });
    } catch (error) {
      console.error("RSVP submission failed", error);
      submitBtn.disabled = false;
      submitBtn.textContent = "Send RSVP";
      document.getElementById("err-attend").textContent = "Something went wrong. Please try again.";
    }
  });
}

// ============================================================
// Init
// ============================================================

renderMain();

document.addEventListener("DOMContentLoaded", () => {
  applyPersonalizationToForm();
}, { once: true });
