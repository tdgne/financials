import dotenv from "dotenv"
dotenv.config()
import AWS from "aws-sdk"
const s3 = new AWS.S3()

const EDINET_BUCKET_NAME = process.env.EDINET_BUCKET_NAME

function fetchEdinetBucketObjectList() {
  return s3.listObjects({ Bucket: EDINET_BUCKET_NAME }).promise()
}

function uploadToEdinetBucket(Key, Body) {
  return s3.upload({ Bucket: EDINET_BUCKET_NAME, Key, Body }).promise()
}

