import * as dotenv from 'dotenv'
dotenv.config()
import AWS from 'aws-sdk'
import {Moment} from 'moment'
const s3 = new AWS.S3()

const BUCKET_NAME = process.env.BUCKET_NAME as string
const EDINET_RAW_KEY_PREFIX = process.env.EDINET_RAW_KEY_PREFIX || 'edinet/raw/'

function documentListSuffix(date: Moment) {
  if (date.hours() == 0 && date.minutes() == 0 && date.seconds() == 0) {
    return `${date.format('YYYY/MM/DD')}/documents.json`
  } else {
    throw new Error('Only start of a day is allowed')
  }
}

function fetchObjectList(Prefix?: string, StartAfter?: string) {
  return s3.listObjectsV2({ Bucket: BUCKET_NAME, Prefix, StartAfter }).promise()
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

export function fetchEdinetRawObjectList(StartAfter?: string) {
  return fetchObjectList(EDINET_RAW_KEY_PREFIX, StartAfter)
}


function doesEdinetRawObjectExist(suffix: string) {
  return doesObjectExist(`${EDINET_RAW_KEY_PREFIX}${suffix}`)
}


function uploadToEdinetBucket(Key: string, Body: string) {
  return s3.upload({ Bucket: BUCKET_NAME, Key, Body }).promise()
}

function uploadEdinetRawObject(suffix: string, body: string) {
  return uploadToEdinetBucket(`${EDINET_RAW_KEY_PREFIX}${suffix}`, body)
}

export function doesEdinetRawDocumentListExist(date: Moment) {
  return doesEdinetRawObjectExist(documentListSuffix(date))
}

export function uploadEdinetRawDocumentList(date: Moment, json: Object) {
  return uploadEdinetRawObject(documentListSuffix(date), JSON.stringify(json))
}

