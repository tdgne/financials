import * as dotenv from 'dotenv'
dotenv.config()

import moment, {Moment} from 'moment'
import { fetchDocumentList } from './edinet.js'
import {doesEdinetRawDocumentListExist, uploadEdinetRawDocumentList} from './s3.js'
import { parse } from 'ts-command-line-args'
import {sleep, today} from './utils.js'

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
  const _startDate = (startDate?.clone() || today('Asia/Tokyo').subtract(5, 'years')).startOf('day')
  const _endDate = (endDate?.clone() || today('Asia/Tokyo')).startOf('day')
  let targetDate = _startDate.clone()
  while(targetDate.isSameOrBefore(_endDate, 'day')) {
    await syncEdinetDocumentListOfDate(targetDate.clone(), refresh)
    await sleep()
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
  return str ? moment.tz(str, 'Asia/Tokyo') : undefined
}

const startDate = parseDate(args.from)
const endDate = parseDate(args.to)
const refresh = args.refresh

syncEdinetDocumentLists(startDate, endDate, refresh)

