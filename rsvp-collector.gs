/**
 * NETHMI & DINUTH - RSVP Collector
 * Google Apps Script Web App backend
 *
 * Compatible with the current app.js fields:
 *   name, phone, attending, guests, message, submittedAt
 *
 * Compatible with the current admin.html GET format:
 *   { ok: true, responses: [...] }
 *
 * Deployment:
 *   Execute as: Me
 *   Who has access: Anyone
 */

const SHEET_NAME = "RSVPs";
const HEADERS = [
  "Submitted At",
  "Name",
  "Attending",
  "Guests",
  "Phone",
  "Message",
];

/**
 * Creates the RSVP sheet and header row when necessary.
 * Safe to run manually more than once.
 */
function setupSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  } else {
    const currentHeaders = sheet
      .getRange(1, 1, 1, HEADERS.length)
      .getDisplayValues()[0];

    const headersAreDifferent = HEADERS.some(function (header, index) {
      return currentHeaders[index] !== header;
    });

    if (headersAreDifferent) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    }
  }

  sheet.setFrozenRows(1);

  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange
    .setFontWeight("bold")
    .setBackground("#f3e8e1")
    .setFontColor("#87531f")
    .setHorizontalAlignment("left");

  sheet.setColumnWidth(1, 185);
  sheet.setColumnWidth(2, 220);
  sheet.setColumnWidth(3, 110);
  sheet.setColumnWidth(4, 80);
  sheet.setColumnWidth(5, 145);
  sheet.setColumnWidth(6, 320);

  return sheet;
}

/**
 * Receives RSVP submissions from app.js.
 */
function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    const sheet = setupSheet();
    const params = e && e.parameter ? e.parameter : {};

    const name = cleanText_(params.name, 90);
    const phone = cleanText_(params.phone, 40);
    const attending = normalizeAttendance_(params.attending);
    const guests = normalizeGuestCount_(params.guests, attending);
    const message = cleanText_(params.message, 500);
    const submittedAt = normalizeSubmittedAt_(params.submittedAt);

    if (!name) {
      return jsonResponse_({
        ok: false,
        result: "error",
        error: "Invitee name is required.",
      });
    }

    if (!attending) {
      return jsonResponse_({
        ok: false,
        result: "error",
        error: "Attendance response must be Yes or No.",
      });
    }

    sheet.appendRow([
      submittedAt,
      name,
      attending,
      guests,
      phone,
      message,
    ]);

    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setNumberFormat("yyyy-mm-dd hh:mm:ss");
    sheet.getRange(lastRow, 4).setNumberFormat("0");

    return jsonResponse_({
      ok: true,
      result: "success",
      message: "RSVP saved successfully.",
    });
  } catch (error) {
    console.error("RSVP submission error", error);

    return jsonResponse_({
      ok: false,
      result: "error",
      error: String(error && error.message ? error.message : error),
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (releaseError) {
      // The lock may not have been acquired if waitLock failed.
    }
  }
}

/**
 * Returns RSVP records for admin.html.
 *
 * Supported URLs:
 *   WEB_APP_URL
 *   WEB_APP_URL?action=list
 *
 * Response format:
 *   { ok: true, responses: [...] }
 */
function doGet(e) {
  try {
    const action = String(
      e && e.parameter && e.parameter.action
        ? e.parameter.action
        : "list"
    ).toLowerCase();

    if (action === "health" || action === "status") {
      return jsonResponse_({
        ok: true,
        status: "RSVP collector is running.",
        couple: "Nethmi & Dinuth",
      });
    }

    if (action !== "list") {
      return jsonResponse_({
        ok: false,
        error: "Unsupported action.",
      });
    }

    const sheet = setupSheet();
    const lastRow = sheet.getLastRow();

    if (lastRow <= 1) {
      return jsonResponse_({
        ok: true,
        responses: [],
        count: 0,
      });
    }

    const rows = sheet
      .getRange(2, 1, lastRow - 1, HEADERS.length)
      .getValues();

    const responses = rows
      .filter(function (row) {
        return row.some(function (value) {
          return value !== "" && value !== null;
        });
      })
      .map(function (row, index) {
        return {
          id: "rsvp-" + (index + 2),
          timestamp: toIsoString_(row[0]),
          submittedAt: toIsoString_(row[0]),
          name: String(row[1] || ""),
          attending: String(row[2] || ""),
          guests: Number(row[3] || 0),
          guestCount: Number(row[3] || 0),
          phone: String(row[4] || ""),
          message: String(row[5] || ""),
        };
      });

    return jsonResponse_({
      ok: true,
      responses: responses,
      count: responses.length,
    });
  } catch (error) {
    console.error("RSVP retrieval error", error);

    return jsonResponse_({
      ok: false,
      responses: [],
      error: String(error && error.message ? error.message : error),
    });
  }
}

/**
 * Converts incoming text to a safe, trimmed value.
 * Spreadsheet formula prefixes are neutralized to prevent formula injection.
 */
function cleanText_(value, maximumLength) {
  let text = String(value == null ? "" : value)
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maximumLength);

  if (/^[=+\-@]/.test(text)) {
    text = "'" + text;
  }

  return text;
}

/**
 * Accepts Yes/No and yes/no values from the current frontend.
 */
function normalizeAttendance_(value) {
  const normalized = String(value || "").trim().toLowerCase();

  if (normalized === "yes") return "Yes";
  if (normalized === "no") return "No";

  return "";
}

/**
 * Ensures a valid guest count. Declined invitations always save as zero.
 */
function normalizeGuestCount_(value, attending) {
  if (attending === "No") return 0;

  const parsed = parseInt(value, 10);
  if (!Number.isFinite(parsed)) return 1;

  return Math.min(Math.max(parsed, 1), 10);
}

/**
 * Converts the submitted ISO date to a Date object.
 * Falls back to the server time when invalid or missing.
 */
function normalizeSubmittedAt_(value) {
  const submitted = value ? new Date(value) : new Date();
  return isNaN(submitted.getTime()) ? new Date() : submitted;
}

/**
 * Produces an ISO timestamp for admin.html.
 */
function toIsoString_(value) {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value.toISOString();
  }

  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? String(value || "") : parsed.toISOString();
}

/**
 * Standard JSON response helper.
 */
function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
