import moment, {Moment} from 'moment'
import 'moment-timezone'
const EDINET_API_FETCH_INTERVAL_MS = parseInt(process.env.EDINET_API_FETCH_INTERVAL_MS || '1000', 10)

export function today(timezone: string): Moment {
  return moment().tz(timezone).startOf('day')
}

export async function sleep(millis?: number) {
  await new Promise(s => setTimeout(s, millis || EDINET_API_FETCH_INTERVAL_MS))
}

