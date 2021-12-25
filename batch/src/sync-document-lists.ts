import 'reflect-metadata'
import { container } from 'tsyringe'

import * as dotenv from 'dotenv'
dotenv.config()

import { parse } from 'ts-command-line-args'
import { SyncService } from './sync'
import { EdinetRepository } from './edinet'
import { S3Repository } from './s3'
import { parseDate, Sleep } from './utils'

interface ICommandLineArgs {
  from?: string;
  to?: string;
  refresh: boolean;
}

const args = parse<ICommandLineArgs>({
  from   : { type: String, optional: true },
  to     : { type: String, optional: true },
  refresh: { type: Boolean, alias: 'r' }
})

const startDate = parseDate(args.from)
const endDate = parseDate(args.to)
const refresh = args.refresh

container.register('EdinetRepository', {
  useClass: EdinetRepository
})

container.register('S3Repository', {
  useClass: S3Repository
})

container.register('Sleep', {
  useClass: Sleep
})

const syncService = container.resolve(SyncService)

syncService.syncEdinetDocumentLists(startDate, endDate, refresh)

