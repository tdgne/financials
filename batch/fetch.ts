import moment, {Moment} from 'moment'
import { fetchDocumentList } from './src/edinet.js'
import {doesEdinetRawDocumentListExist, uploadEdinetRawDocumentList} from './src/s3.js'
const EDINET_API_FETCH_INTERVAL_MS = parseInt(process.env.EDINET_API_FETCH_INTERVAL_MS || '1000', 10)

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
  await uploadEdinetRawDocumentList(_targetDate, data)
  console.log(`Uploaded document list of ${targetDateString} to S3.`)
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


syncEdinetDocumentLists()

