import 'reflect-metadata'
import { container } from 'tsyringe'

import * as dotenv from 'dotenv'
dotenv.config()

import { parse } from 'ts-command-line-args'
import { SyncUseCase } from './usecase/sync'
import { EdinetClient } from './client/edinet/impl'
import { S3Client } from './client/s3/impl'
import { Sleep } from './usecase/sleep'
import { YearMonthDate } from './model/date'

interface ICommandLineArgs {
  from?: string
  to?: string
  refresh: boolean
}

const args = parse<ICommandLineArgs>({
  from: { type: String, optional: true },
  to: { type: String, optional: true },
  refresh: { type: Boolean, alias: 'r' },
})

const startDate = args.from ? YearMonthDate.parse(args.from) : undefined
const endDate = args.to ? YearMonthDate.parse(args.to) : undefined
const refresh = args.refresh

container.register('EdinetClient', {
  useClass: EdinetClient,
})

container.register('S3Client', {
  useClass: S3Client,
})

container.register('Sleep', {
  useClass: Sleep,
})

const syncService = container.resolve(SyncUseCase)

syncService.syncEdinetDocumentListsOfDateRange(startDate, endDate, refresh)
