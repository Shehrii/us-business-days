import { test } from "node:test";
import assert from "node:assert/strict";
import { federalHolidays, holidayOn, addBusinessDays, businessDaysBetween, isBusinessDay } from "./index.js";

test("eleven holidays with weekend observance", () => {
  const h = federalHolidays(2027);
  assert.equal(h.length, 11);
  // Christmas 2027 is a Saturday, observed Friday 24 December.
  assert.deepEqual(h.at(-1), { name: "Christmas Day", date: "2027-12-25", observed: "2027-12-24" });
  // New Year's Day 2028 is a Saturday, observed Friday 31 December 2027.
  assert.equal(holidayOn("2027-12-31"), "New Year's Day");
});
test("Thanksgiving 2026 is 26 November", () => assert.equal(holidayOn("2026-11-26"), "Thanksgiving Day"));
test("business days", () => {
  assert.equal(isBusinessDay("2026-11-21"), false); // Saturday
  assert.equal(addBusinessDays("2026-11-25", 1), "2026-11-27"); // skips Thanksgiving
  assert.equal(businessDaysBetween("2025-12-31", "2026-12-31"), 251);
});
