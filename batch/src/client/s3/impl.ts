import * as dotenv from 'dotenv'
dotenv.config()

import AWS from 'aws-sdk'
import { Moment } from 'moment'
import { injectable } from 'tsyringe'
import { documentListKey, IS3Client } from './interface'
const s3 = new AWS.S3()

const BUCKET_NAME = process.env.BUCKET_NAME as string

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

@injectable()
export class S3Client implements IS3Client {
  constructor() {
    console.log('Constructed real S3Client')
  }

  doesEdinetRawDocumentListExist(date: Moment) {
    return doesObjectExist(documentListKey(date))
  }

  async uploadEdinetRawDocumentList(date: Moment, json: object) {
    await upload(documentListKey(date), JSON.stringify(json))
  }
}

