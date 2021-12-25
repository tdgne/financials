import * as dotenv from 'dotenv'
dotenv.config()

import AWS from 'aws-sdk'
import { Moment } from 'moment'
import { injectable } from 'tsyringe'
const s3 = new AWS.S3()

const BUCKET_NAME = process.env.BUCKET_NAME as string
const EDINET_RAW_DOCUMENT_LIST_PREFIX = process.env.EDINET_RAW_DOCUMENT_LIST_PREFIX || 'edinet/raw/document-list/'

function documentListKey(date: Moment) {
  if (date.hours() == 0 && date.minutes() == 0 && date.seconds() == 0) {
    return `${EDINET_RAW_DOCUMENT_LIST_PREFIX}${date.format('YYYY/MM/DD')}/documents.json`
  } else {
    throw new Error('Only start of a day is allowed')
  }
}

async function doesObjectExist(Key: string): Promise<boolean> {
  try {
    await s3.headObject({ Bucket: BUCKET_NAME, Key }).promise()
  } catch (e: any) {
    if (e.code == 'NotFound') {
      return false
    }
    throw e
  }
  return true
}

function upload(Key: string, Body: string) {
  return s3.upload({ Bucket: BUCKET_NAME, Key, Body }).promise()
}

export interface IS3Client {
  doesEdinetRawDocumentListExist(date: Moment): Promise<boolean>
  uploadEdinetRawDocumentList(date: Moment, json: Object): Promise<void>
}

@injectable()
export class S3Client implements IS3Client {
  constructor() {
    console.log('Constructed real S3Client')
  }

  doesEdinetRawDocumentListExist(date: Moment) {
    return doesObjectExist(documentListKey(date))
  }

  async uploadEdinetRawDocumentList(date: Moment, json: Object) {
    await upload(documentListKey(date), JSON.stringify(json))
  }
}

@injectable()
export class MockS3Client implements IS3Client {
  constructor() {
    console.log('Constructed mock S3Client')
  }

  async doesEdinetRawDocumentListExist(_date: Moment) {
    return true
  }

  async uploadEdinetRawDocumentList(_date: Moment, _json: Object) {
  }
}
