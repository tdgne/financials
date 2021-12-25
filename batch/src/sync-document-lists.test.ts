import 'reflect-metadata'
import { container } from 'tsyringe'

import * as dotenv from 'dotenv'
dotenv.config()

import { SyncService } from './sync'
import { MockEdinetClient } from './edinet'
import { MockS3Client } from './s3'
import { MockSleep, parseDate } from './utils'

const startDate = parseDate('2021-12-23')
const endDate = parseDate('2021-12-25')
const refresh = false

container.register('EdinetClient', {
  useClass: MockEdinetClient
})

container.register('S3Client', {
  useClass: MockS3Client
})

container.register('Sleep', {
  useClass: MockSleep
})

const syncService = container.resolve(SyncService)

syncService.syncEdinetDocumentLists(startDate, endDate, refresh)

