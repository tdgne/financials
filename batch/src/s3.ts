import * as dotenv from 'dotenv'
dotenv.config()

import AWS from 'aws-sdk'
import {Moment} from 'moment'
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

async function doesObjectExist(Key: string) {
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

export function doesEdinetRawDocumentListExist(date: Moment) {
  return doesObjectExist(documentListKey(date))
}

export function uploadEdinetRawDocumentList(date: Moment, json: Object) {
  return upload(documentListKey(date), JSON.stringify(json))
}

