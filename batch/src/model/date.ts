import moment, { DurationInputArg1, DurationInputArg2, Moment } from 'moment'
import 'moment-timezone'

export function parseYearMonthDate(str?: string): YearMonthDate | undefined {
  return str ? YearMonthDate.parse(str) : undefined
}

export class YearMonthDate {
  readonly year: number
  readonly month: number
  readonly date: number

  constructor(year: number, month: number, date: number) {
    this.year = year
    this.month = month
    this.date = date
  }

  encode(delimiter: string) {
    return [this.year, this.month, this.date].join(delimiter)
  }

  moment(timezone: string): Moment {
    return moment.tz(this.encode('-'), timezone)
  }

  subtract(n: DurationInputArg1, unit: DurationInputArg2) {
    return YearMonthDate.fromMoment(this.moment('Asia/Tokyo').subtract(n, unit))
  }

  add(n: DurationInputArg1, unit: DurationInputArg2) {
    return YearMonthDate.fromMoment(this.moment('Asia/Tokyo').add(n, unit))
  }

  clone(): YearMonthDate {
    return new YearMonthDate(this.year, this.month, this.date)
  }

  isSameOrBefore(other: YearMonthDate): boolean {
    return this.moment('Asia/Tokyo').isSameOrBefore(
      other.moment('Asia/Tokyo'),
      'day'
    )
  }

  static today(timezone: string): YearMonthDate {
    return this.fromMoment(moment().tz(timezone).startOf('day'))
  }

  static fromMoment(moment: Moment): YearMonthDate {
    return new YearMonthDate(moment.year(), moment.month() + 1, moment.date())
  }

  static parse(str: string): YearMonthDate | undefined {
    return this.fromMoment(moment.tz(str, 'Azia/Tokyo'))
  }
}
