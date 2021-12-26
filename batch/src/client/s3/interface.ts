import * as dotenv from 'dotenv'
dotenv.config()

import { Moment } from 'moment'
import { EdinetDocumentListResponse } from '../../model/document-list'

const EDINET_RAW_DOCUMENT_LIST_PREFIX =
  process.env.EDINET_RAW_DOCUMENT_LIST_PREFIX || 'edinet/raw/document-list/'

export function documentListKey(date: Moment) {
  if (date.hours() == 0 && date.minutes() == 0 && date.seconds() == 0) {
    return `${EDINET_RAW_DOCUMENT_LIST_PREFIX}${date.format(
      'YYYY/MM/DD'
    )}/documents.json`
  } else {
    throw new Error('Only start of a day is allowed')
  }
}

export interface IS3Client {
  doesEdinetDocumentListResponseExist(date: Moment): Promise<boolean>
  uploadEdinetDocumentListResponse(
    date: Moment,
    json: EdinetDocumentListResponse
  ): Promise<void>
}
