# us-business-days

US federal holidays and business-day maths in one small file with no dependencies.

- The eleven federal holidays set by 5 U.S.C. 6103(a), including Juneteenth.
- Weekend observance as in the OPM schedule: a Saturday holiday is taken on the Friday before, a Sunday holiday on the Monday after (so New Year's Day 2028 is observed on Friday 31 December 2027).
- Add or count business days that skip weekends and observed holidays.

Dates are plain `YYYY-MM-DD` strings treated as calendar days, so time zones never shift a result.

Need it without code? The same rules run the [business days calculator](https://datesahead.com/business-days-calculator/) and [days between dates](https://datesahead.com/days-between-dates/) on [Dates Ahead](https://datesahead.com/).

## Install

```sh
npm install github:Shehrii/us-business-days
```

## Use

```js
import { federalHolidays, holidayOn, isBusinessDay, addBusinessDays, businessDaysBetween } from "us-business-days";

federalHolidays(2027);                       // [{ name, date, observed }, ...] eleven entries
holidayOn("2026-11-26");                     // "Thanksgiving Day"
isBusinessDay("2026-11-21");                 // false (Saturday)
addBusinessDays("2026-11-25", 1);            // "2026-11-27" (skips Thanksgiving)
businessDaysBetween("2025-12-31", "2026-12-31"); // 250 working days in 2026
```

Every function takes an optional last argument `skipHolidays` (default `true`); pass `false` to count weekdays only.

`federal-holidays-2020-2040.json` has every holiday and its observed date for 2020 to 2040 if you only need the data.

## Not included

Inauguration Day (Washington DC area only, every four years), state holidays, and the extra days off a president sometimes grants by executive order.

## License

MIT
