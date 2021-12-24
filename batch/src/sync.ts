import moment, {Moment} from 'moment'
import { fetchDocumentList } from './edinet.js'
import {doesEdinetRawDocumentListExist, uploadEdinetRawDocumentList} from './s3.js'
const EDINET_API_FETCH_INTERVAL_MS = parseInt(process.env.EDINET_API_FETCH_INTERVAL_MS || '1000', 10)
import { parse } from 'ts-command-line-args'

async function sleep(millis: number) {
  await new Promise(s => setTimeout(s, millis))
}

async function syncEdinetDocumentListOfDate(targetDate: Moment, refresh?: boolean) {
  const _targetDate = targetDate.clone().startOf('day')
  const targetDateString = _targetDate.format('YYYY-MM-DD')
  if (!refresh && await doesEdinetRawDocumentListExist(_targetDate)) {
    console.log(`Document list of ${targetDateString} exists.`)
    return
  }
  const { data } = await fetchDocumentList(_targetDate)
  const { status, message } = data.metadata
  console.log(`Fetched document list of ${targetDateString} (${status}, ${message}).`)
  if (status == 200) {
    await uploadEdinetRawDocumentList(_targetDate, data)
    console.log(`Uploaded document list of ${targetDateString} to S3.`)
  } else {
    console.log(`Skipped uploading document list of ${targetDateString}.`)
  }
}

async function syncEdinetDocumentLists(startDate?: Moment, endDate?: Moment, refresh?: boolean) {
  const _startDate = (startDate?.clone() || moment().subtract(5, 'years')).startOf('day')
  const _endDate = (endDate?.clone() || moment()).startOf('day')
  let targetDate = _startDate.clone()
  while(targetDate.isSameOrBefore(_endDate)) {
    await syncEdinetDocumentListOfDate(targetDate.clone(), refresh)
    await sleep(EDINET_API_FETCH_INTERVAL_MS)
    targetDate = targetDate.add(1, 'day')
  }
}

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
  return str ? moment(str, 'YYYY-MM-DD') : undefined
}

const startDate = parseDate(args.from)
const endDate = parseDate(args.to)
const refresh = args.refresh

syncEdinetDocumentLists(startDate, endDate, refresh)

