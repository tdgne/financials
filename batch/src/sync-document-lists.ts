import * as dotenv from 'dotenv'
dotenv.config()

import moment, {Moment} from 'moment'
import { parse } from 'ts-command-line-args'
import { syncEdinetDocumentLists } from './sync.js'

interface ICommandLineArgs {
  from?: string;
  to?: string;
  refresh: boolean;
}

const args = parse<ICommandLineArgs>({
  from   : { type: String, optional: true },
  to     : { type: String, optional: true },
  refresh: { type: Boolean, alias: 'r' }
})

function parseDate(str?: string): Moment | undefined {
  return str ? moment.tz(str, 'Asia/Tokyo') : undefined
}

const startDate = parseDate(args.from)
const endDate = parseDate(args.to)
const refresh = args.refresh

syncEdinetDocumentLists(startDate, endDate, refresh)

