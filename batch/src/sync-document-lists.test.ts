import 'reflect-metadata'
import { container } from 'tsyringe'
import { SyncService } from './sync'
import { MockEdinetClient } from './edinet'
import { MockS3Client } from './s3'
import { MockSleep, parseDate } from './utils'
import 'jest'

container.register('EdinetClient', {
  useClass: MockEdinetClient
})

container.register('S3Client', {
  useClass: MockS3Client
})

container.register('Sleep', {
  useClass: MockSleep
})

describe('syncEdinetDocumentListOfDate', () => {
  beforeEach(() => {
    container.clearInstances()
  })

  it('puts object with correct key', async () => {
    const syncService = container.resolve(SyncService)
    const dateString = '2021-12-25'
    const date = parseDate(dateString) ?? fail('parseDate returned undefined')
    const refresh = false
    await syncService.syncEdinetDocumentListOfDate(date, refresh)
    const s3Client = syncService.s3Client as MockS3Client
    expect(Object.keys(s3Client.storage).length).toBe(1)
    expect('edinet/raw/document-list/2021/12/25/documents.json' in s3Client.storage).toBeTruthy()
  })

  it('doesn\'t put object when not found', async () => {
    const syncService = container.resolve(SyncService)
    const dateString = '2021-12-26'
    const date = parseDate(dateString) ?? fail('parseDate returned undefined')
    const refresh = false
    await syncService.syncEdinetDocumentListOfDate(date, refresh)
    const s3Client = syncService.s3Client as MockS3Client
    expect(Object.keys(s3Client.storage).length).toBe(0)
  })
})

describe('syncEdinetDocumentLists', () => {
  beforeEach(() => {
    container.clearInstances()
  })

  it('puts object with correct keys', async () => {
    const syncService = container.resolve(SyncService)
    const fromString = '2021-12-23'
    const from = parseDate(fromString) ?? fail('parseDate returned undefined')
    const toString = '2021-12-25'
    const to = parseDate(toString) ?? fail('parseDate returned undefined')
    const refresh = false
    await syncService.syncEdinetDocumentLists(from, to, refresh)
    const s3Client = syncService.s3Client as MockS3Client
    expect(Object.keys(s3Client.storage).length).toBe(3)
    expect('edinet/raw/document-list/2021/12/23/documents.json' in s3Client.storage).toBeTruthy()
    expect('edinet/raw/document-list/2021/12/24/documents.json' in s3Client.storage).toBeTruthy()
    expect('edinet/raw/document-list/2021/12/25/documents.json' in s3Client.storage).toBeTruthy()
  })

  it('doesn\'t put object when not found', async () => {
    const syncService = container.resolve(SyncService)
    const fromString = '2021-12-23'
    const from = parseDate(fromString) ?? fail('parseDate returned undefined')
    const toString = '2021-12-27'
    const to = parseDate(toString) ?? fail('parseDate returned undefined')
    const refresh = false
    await syncService.syncEdinetDocumentLists(from, to, refresh)
    const s3Client = syncService.s3Client as MockS3Client
    expect(Object.keys(s3Client.storage).length).toBe(3)
    expect('edinet/raw/document-list/2021/12/23/documents.json' in s3Client.storage).toBeTruthy()
    expect('edinet/raw/document-list/2021/12/24/documents.json' in s3Client.storage).toBeTruthy()
    expect('edinet/raw/document-list/2021/12/25/documents.json' in s3Client.storage).toBeTruthy()
  })
})


