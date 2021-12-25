import 'reflect-metadata'
import { container } from 'tsyringe'

import * as dotenv from 'dotenv'
dotenv.config()

import { SyncService } from './sync'
import { MockEdinetRepository } from './edinet'
import { MockS3Repository } from './s3'
import { MockSleep, parseDate } from './utils'

const startDate = parseDate('2021-12-23')
const endDate = parseDate('2021-12-25')
const refresh = false

container.register('EdinetRepository', {
  useClass: MockEdinetRepository
})

container.register('S3Repository', {
  useClass: MockS3Repository
})

container.register('Sleep', {
  useClass: MockSleep
})

const syncService = container.resolve(SyncService)

syncService.syncEdinetDocumentLists(startDate, endDate, refresh)

