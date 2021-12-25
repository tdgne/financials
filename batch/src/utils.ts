import moment, {Moment} from 'moment'
import 'moment-timezone'
import { injectable } from 'tsyringe'
const EDINET_API_FETCH_INTERVAL_MS = parseInt(process.env.EDINET_API_FETCH_INTERVAL_MS || '1000', 10)

export function today(timezone: string): Moment {
  return moment().tz(timezone).startOf('day')
}

export interface ISleep {
  sleep(millis?: number): Promise<void>
}

@injectable()
export class Sleep {
  constructor () {
    console.log('Constructed real Sleep')
  }

  async sleep(millis?: number) {
    await new Promise(s => setTimeout(s, millis || EDINET_API_FETCH_INTERVAL_MS))
  }
}

@injectable()
export class MockSleep {
  constructor () {
    console.log('Constructed mock Sleep')
  }

  async sleep(_millis?: number) {
    // do nothing
  }
}

export function parseDate(str?: string): Moment | undefined {
  return str ? moment.tz(str, 'Asia/Tokyo') : undefined
}

