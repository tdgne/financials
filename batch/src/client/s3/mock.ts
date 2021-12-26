import * as dotenv from 'dotenv'
dotenv.config()

import { Moment } from 'moment'
import { injectable } from 'tsyringe'
import { EdinetDocumentListResponse } from '../../model/document-list'
import { EdinetDocumentsResponse } from '../../model/documents'
import { documentKey, documentListKey, IS3Client } from './interface'

@injectable()
export class MockS3Client implements IS3Client {
  public storage: any = {}

  constructor() {
    console.log('Constructed mock S3Client')
  }

  async doesEdinetDocumentListResponseExist(date: Moment) {
    return documentListKey(date) in this.storage
  }

  async doesEdinetDocumentsResponseExist(docID: string) {
    return documentKey(docID) in this.storage
  }

  async downloadEdinetDocumentListResponse(
    date: Moment
  ): Promise<EdinetDocumentListResponse> {
    return {
      metadata: {
        status: 200,
        message: 'OK',
        parameter: {
          date: date.format('YYYY-MM-DD'),
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

  async uploadEdinetDocumentListResponse(date: Moment, json: object) {
    this.storage[documentListKey(date)] = JSON.stringify(json)
  }

  async uploadEdinetDocumentsResponse(
    docID: string,
    response: EdinetDocumentsResponse
  ): Promise<void> {
    this.storage[documentKey(docID)] = response.file
  }
}
