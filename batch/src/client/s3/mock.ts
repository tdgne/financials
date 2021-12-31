import * as dotenv from 'dotenv'
dotenv.config()

import { injectable } from 'tsyringe'
import { YearMonthDate } from '../../model/date'
import { EdinetDocumentListResponse } from '../../model/document-list'
import { EdinetDocumentsResponse } from '../../model/documents'
import { documentKey, documentListKey, IS3Client } from './interface'

@injectable()
export class MockS3Client implements IS3Client {
  public storage: any = {}

  constructor() {
    console.log('Constructed mock S3Client')
  }

  async doesEdinetDocumentListResponseExist(date: YearMonthDate) {
    return documentListKey(date) in this.storage
  }

  async doesEdinetDocumentsResponseExist(docID: string) {
    return documentKey(docID) in this.storage
  }

  async downloadEdinetDocumentListResponse(
    date: YearMonthDate
  ): Promise<EdinetDocumentListResponse> {
    return {
      metadata: {
        status: 200,
        message: 'OK',
        parameter: {
          date: date.encode('-'),
          type: '2',
        },
      },
      results: [
        {
          docID: 'test_doc_1',
        },
        {
          docID: 'test_doc_2',
        },
        {
          docID: 'test_doc_3',
        },
      ],
    } as EdinetDocumentListResponse
  }

  async uploadEdinetDocumentListResponse(date: YearMonthDate, json: object) {
    this.storage[documentListKey(date)] = JSON.stringify(json)
  }

  async uploadEdinetDocumentsResponse(
    docID: string,
    response: EdinetDocumentsResponse
  ): Promise<void> {
    this.storage[documentKey(docID)] = response
  }
}
