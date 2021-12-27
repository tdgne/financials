import 'jest'
import moment from 'moment'
import 'moment-timezone'
import { YearMonthDate } from './date'

describe('YearMonthDate', () => {
  it('parses correctly', () => {
    const str = '2021-12-25'
    const ymd: YearMonthDate = YearMonthDate.parse(str)
    expect(ymd.year).toBe(2021)
    expect(ymd.month).toBe(12)
    expect(ymd.date).toBe(25)
  })

  it('converts from Moment correctly', () => {
    const str = '2021-12-25'
    const m = moment.tz(str, 'Asia/Tokyo')
    const ymds: YearMonthDate = YearMonthDate.parse(str)
    const ymdm: YearMonthDate = YearMonthDate.fromMoment(m)
    expect(ymdm.year).toBe(2021)
    expect(ymdm.month).toBe(12)
    expect(ymdm.date).toBe(25)
    expect(ymds.year).toBe(ymdm.year)
    expect(ymds.month).toBe(ymdm.month)
    expect(ymds.date).toBe(ymdm.date)
  })

  it('isSameOrBefore is correct', () => {
    const a = '2021-12-25'
    const b = '2021-12-26'
    const c = '2022-12-25'
    const d = '2021-11-25'
    const ymdA: YearMonthDate = YearMonthDate.parse(a)
    const ymdB: YearMonthDate = YearMonthDate.parse(b)
    const ymdC: YearMonthDate = YearMonthDate.parse(c)
    const ymdD: YearMonthDate = YearMonthDate.parse(d)
    expect(ymdA.isSameOrBefore(ymdA)).toBeTruthy()
    expect(ymdA.isSameOrBefore(ymdB)).toBeTruthy()
    expect(ymdA.isSameOrBefore(ymdC)).toBeTruthy()
    expect(ymdA.isSameOrBefore(ymdD)).toBeFalsy()
    expect(ymdB.isSameOrBefore(ymdA)).toBeFalsy()
    expect(ymdB.isSameOrBefore(ymdB)).toBeTruthy()
    expect(ymdB.isSameOrBefore(ymdC)).toBeTruthy()
    expect(ymdB.isSameOrBefore(ymdD)).toBeFalsy()
  })

  it('add is correct', () => {
    const str = '2021-12-31'
    const ymd: YearMonthDate = YearMonthDate.parse(str)
    expect(ymd.year).toBe(2021)
    expect(ymd.month).toBe(12)
    expect(ymd.date).toBe(31)
    const added = ymd.add(1, 'day')
    expect(ymd.year).toBe(2021)
    expect(ymd.month).toBe(12)
    expect(ymd.date).toBe(31)
    expect(added.year).toBe(2022)
    expect(added.month).toBe(1)
    expect(added.date).toBe(1)
  })
})
