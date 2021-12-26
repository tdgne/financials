import * as dotenv from 'dotenv'
dotenv.config()

import AWS from 'aws-sdk'
import { Moment } from 'moment'
import { injectable } from 'tsyringe'
import { documentKey, documentListKey, IS3Client } from './interface'
import { EdinetDocumentListResponse } from '../../model/document-list'
import { EdinetDocumentsResponse } from '../../model/documents'
const s3 = new AWS.S3()

const BUCKET_NAME = process.env.BUCKET_NAME as string | undefined

function verifyEnvironmentVariableIsSet(
  name: string,
  value?: string
): asserts value is NonNullable<string> {
  if (!value) {
    throw new Error(`Environment variable ${name} is not set.`)
  }
}

async function doesObjectExist(Key: string): Promise<boolean> {
  verifyEnvironmentVariableIsSet('BUCKET_NAME', BUCKET_NAME)
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

function getObject(Key: string) {
  verifyEnvironmentVariableIsSet('BUCKET_NAME', BUCKET_NAME)
  return s3.getObject({ Bucket: BUCKET_NAME, Key }).promise()
}

function upload(Key: string, Body: string | ArrayBuffer) {
  verifyEnvironmentVariableIsSet('BUCKET_NAME', BUCKET_NAME)
  return s3.upload({ Bucket: BUCKET_NAME, Key, Body }).promise()
}

@injectable()
export class S3Client implements IS3Client {
  constructor() {
    console.log('Constructed real S3Client')
  }

  doesEdinetDocumentListResponseExist(date: Moment) {
    return doesObjectExist(documentListKey(date))
  }

  doesEdinetDocumentsResponseExist(docID: string): Promise<boolean> {
    return doesObjectExist(documentKey(docID))
  }

  async downloadEdinetDocumentListResponse(
    date: Moment
  ): Promise<EdinetDocumentListResponse> {
    const response = await getObject(documentListKey(date))
    if (typeof response.Body == 'object' && response.Body instanceof Buffer) {
      return JSON.parse(response.Body.toString()) as EdinetDocumentListResponse
    }
    if (typeof response.Body == 'string') {
      return JSON.parse(response.Body) as EdinetDocumentListResponse
    }
    throw new Error(
      `S3 Object ${documentListKey(date)} is not a Buffer nor a string.`
    )
  }

  async uploadEdinetDocumentListResponse(
    date: Moment,
    json: EdinetDocumentListResponse
  ) {
    await upload(documentListKey(date), JSON.stringify(json))
  }

  async uploadEdinetDocumentsResponse(
    docID: string,
    response: EdinetDocumentsResponse
  ): Promise<void> {
    await upload(documentKey(docID), response.file)
  }
}
