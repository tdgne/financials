import * as dotenv from 'dotenv'
dotenv.config()

import { Moment } from 'moment'
import { injectable } from 'tsyringe'
import { documentListKey, IS3Client } from './interface'

@injectable()
export class MockS3Client implements IS3Client {
  public storage: any = {}

  constructor() {
    console.log('Constructed mock S3Client')
  }

  async doesEdinetDocumentListResponseExist(date: Moment) {
    return documentListKey(date) in this.storage
  }

  async uploadEdinetDocumentListResponse(date: Moment, json: object) {
    this.storage[documentListKey(date)] = JSON.stringify(json)
  }
}
