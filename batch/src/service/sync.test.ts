import 'reflect-metadata'
import { container } from 'tsyringe'
import { SyncService } from './sync'
import { MockEdinetClient } from '../client/edinet/mock'
import { MockS3Client } from '../client/s3/mock'
import { MockSleep, parseDate } from './utils'
import 'jest'
import { Moment } from 'moment'

container.register('EdinetClient', {
  useClass: MockEdinetClient
})

container.register('S3Client', {
  useClass: MockS3Client
})

container.register('Sleep', {
  useClass: MockSleep
})

function parseDateForTest(dateString?: string): Moment {
  return parseDate(dateString) ?? fail('parseDate returned undefined')
}

describe('syncEdinetDocumentListOfDate', () => {
  beforeEach(() => {
    container.clearInstances()
  })

  it('puts object with correct key', async () => {
    const syncService = container.resolve(SyncService)
    const dateString = '2021-12-25'
    const date = parseDateForTest(dateString)
    const refresh = false
    await syncService.syncEdinetDocumentListOfDate(date, refresh)
    const s3Client = syncService.s3Client as MockS3Client
    expect(Object.keys(s3Client.storage).length).toBe(1)
    expect('edinet/raw/document-list/2021/12/25/documents.json' in s3Client.storage).toBeTruthy()
  })

  it('doesn\'t put object when not found', async () => {
    const syncService = container.resolve(SyncService)
    const dateString = '2021-12-26'
    const date = parseDateForTest(dateString)
    const refresh = false
    await syncService.syncEdinetDocumentListOfDate(date, refresh)
    const s3Client = syncService.s3Client as MockS3Client
    expect(Object.keys(s3Client.storage).length).toBe(0)
  })

  it('overwrites existing object when refresh mode is true', async () => {
    const syncService = container.resolve(SyncService)
    const dateString = '2021-12-25'
    const date = parseDateForTest(dateString)
    const refresh = true
    await syncService.syncEdinetDocumentListOfDate(date, refresh)
    const s3Client = syncService.s3Client as MockS3Client
    const expectedKey = 'edinet/raw/document-list/2021/12/25/documents.json'
    const oldMarker = 'OLD_MARKER'
    expect(Object.keys(s3Client.storage).length).toBe(1)
    expect(expectedKey in s3Client.storage).toBeTruthy()
    expect(s3Client.storage[expectedKey].indexOf(oldMarker)).toBeLessThan(0)
    s3Client.storage[expectedKey] += oldMarker
    expect(s3Client.storage[expectedKey].indexOf(oldMarker)).toBeGreaterThan(0)
    await syncService.syncEdinetDocumentListOfDate(date, refresh)
    expect(Object.keys(s3Client.storage).length).toBe(1)
    expect(s3Client.storage[expectedKey].indexOf(oldMarker)).toBeLessThan(0)
  })
})

describe('syncEdinetDocumentLists', () => {
  beforeEach(() => {
    container.clearInstances()
  })

  it('puts object with correct keys', async () => {
    const syncService = container.resolve(SyncService)
    const fromString = '2021-12-23'
    const from = parseDateForTest(fromString)
    const toString = '2021-12-25'
    const to = parseDateForTest(toString)
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
    const from = parseDateForTest(fromString)
    const toString = '2021-12-27'
    const to = parseDateForTest(toString)
    const refresh = false
    await syncService.syncEdinetDocumentLists(from, to, refresh)
    const s3Client = syncService.s3Client as MockS3Client
    expect(Object.keys(s3Client.storage).length).toBe(3)
    expect('edinet/raw/document-list/2021/12/23/documents.json' in s3Client.storage).toBeTruthy()
    expect('edinet/raw/document-list/2021/12/24/documents.json' in s3Client.storage).toBeTruthy()
    expect('edinet/raw/document-list/2021/12/25/documents.json' in s3Client.storage).toBeTruthy()
  })
})


