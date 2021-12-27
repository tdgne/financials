import * as dotenv from 'dotenv'
import { YearMonthDate } from '../../model/date'
dotenv.config()

import { EdinetDocumentListResponse } from '../../model/document-list'
import { EdinetDocumentsResponse } from '../../model/documents'

const EDINET_RAW_DOCUMENT_LIST_PREFIX =
  process.env.EDINET_RAW_DOCUMENT_LIST_PREFIX || 'edinet/raw/document-list/'
const EDINET_RAW_DOCUMENT_PREFIX =
  process.env.EDINET_RAW_DOCUMENT_PREFIX || 'edinet/raw/document/'

export function documentListKey(date: YearMonthDate) {
  return `${EDINET_RAW_DOCUMENT_LIST_PREFIX}${date.encode('/')}/documents.json`
}

export function documentKey(docID: string) {
  return `${EDINET_RAW_DOCUMENT_PREFIX}${docID}.zip`
}

export interface IS3Client {
  doesEdinetDocumentListResponseExist(date: YearMonthDate): Promise<boolean>
  doesEdinetDocumentsResponseExist(docID: string): Promise<boolean>
  downloadEdinetDocumentListResponse(
    date: YearMonthDate
  ): Promise<EdinetDocumentListResponse>
  uploadEdinetDocumentListResponse(
    date: YearMonthDate,
    response: EdinetDocumentListResponse
  ): Promise<void>
  uploadEdinetDocumentsResponse(
    docID: string,
    response: EdinetDocumentsResponse
  ): Promise<void>
}
