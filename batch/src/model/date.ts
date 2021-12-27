import moment, { DurationInputArg1, DurationInputArg2, Moment } from 'moment'
import 'moment-timezone'

export const TOKYO_TIMEZONE = 'Asia/Tokyo'

export const DEFAULT_TIMEZONE = TOKYO_TIMEZONE

export function parseYearMonthDate(str?: string): YearMonthDate | undefined {
  return str ? YearMonthDate.parse(str) : undefined
}

export class YearMonthDate {
  readonly year: number
  readonly month: number // 1-based numbering (1, 2, .., 12)
  readonly date: number

  constructor(year: number, month: number, date: number) {
    this.year = year
    this.month = month
    this.date = date
  }

  encode(delimiter: string) {
    return [this.year, this.month, this.date].join(delimiter)
  }

  moment(timezone?: string): Moment {
    return moment.tz(this.encode('-'), timezone || DEFAULT_TIMEZONE)
  }

  subtract(n: DurationInputArg1, unit: DurationInputArg2) {
    return YearMonthDate.fromMoment(
      this.moment(DEFAULT_TIMEZONE).subtract(n, unit)
    )
  }

  add(n: DurationInputArg1, unit: DurationInputArg2) {
    return YearMonthDate.fromMoment(this.moment(DEFAULT_TIMEZONE).add(n, unit))
  }

  clone(): YearMonthDate {
    return new YearMonthDate(this.year, this.month, this.date)
  }

  isSameOrBefore(other: YearMonthDate): boolean {
    return this.moment().isSameOrBefore(other.moment(), 'day')
  }

  static today(timezone?: string): YearMonthDate {
    return this.fromMoment(
      moment()
        .tz(timezone || DEFAULT_TIMEZONE)
        .startOf('day')
    )
  }

  static fromMoment(moment: Moment): YearMonthDate {
    return new YearMonthDate(moment.year(), moment.month() + 1, moment.date())
  }

  static parse(str: string): YearMonthDate | undefined {
    return this.fromMoment(moment.tz(str, DEFAULT_TIMEZONE))
  }
}
