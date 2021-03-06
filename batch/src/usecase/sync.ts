import * as dotenv from 'dotenv'
dotenv.config()

import { inject, injectable } from 'tsyringe'
import { IEdinetClient } from '../client/edinet/interface'
import { IS3Client, S3ClientError } from '../client/s3/interface'
import { TOKYO_TIMEZONE, YearMonthDate } from '../model/date'
import { EdinetDocumentListResponse } from '../model/document-list'
import { ISleep } from './sleep'

export interface ISyncUseCase {
  syncEdinetDocumentListOfDate(
    targetDate: YearMonthDate,
    refresh?: boolean
  ): void
  syncEdinetDocumentListsOfDateRange(
    startDate?: YearMonthDate,
    endDate?: YearMonthDate,
    refresh?: boolean
  ): void
  syncEdinetDocument(docID: string, refresh?: boolean): void
  syncEdinetDocumentsOfDate(targetDate: YearMonthDate, refresh?: boolean): void
  syncEdinetDocumentsOfDateRange(
    startDate: YearMonthDate,
    endDate: YearMonthDate,
    refresh?: boolean
  ): void
}

@injectable()
export class SyncUseCase implements ISyncUseCase {
  constructor(
    @inject('EdinetClient') public edinetClient: IEdinetClient,
    @inject('S3Client') public s3Client: IS3Client,
    @inject('Sleep') public sleep: ISleep
  ) {}

  async syncEdinetDocumentListOfDate(
    targetDate: YearMonthDate,
    refresh?: boolean
  ) {
    const targetDateString = targetDate.encode('-')
    if (
      !refresh &&
      (await this.s3Client.doesEdinetDocumentListResponseExist(targetDate))
    ) {
      console.log(`Document list of ${targetDateString} exists.`)
      return
    }
    const documentList: EdinetDocumentListResponse =
      await this.edinetClient.fetchDocumentList(targetDate)
    const { status, message } = documentList.metadata
    console.log(
      `Fetched document list of ${targetDateString} (${status}, ${message}).`
    )
    if (status == 200) {
      await this.s3Client.uploadEdinetDocumentListResponse(
        targetDate,
        documentList
      )
      console.log(`Uploaded document list of ${targetDateString} to S3.`)
    } else {
      console.log(`Skipped uploading document list of ${targetDateString}.`)
    }
  }

  async syncEdinetDocumentListsOfDateRange(
    startDate?: YearMonthDate,
    endDate?: YearMonthDate,
    refresh?: boolean
  ) {
    const _startDate =
      startDate ?? YearMonthDate.today(TOKYO_TIMEZONE).subtract(5, 'years')
    const _endDate = endDate ?? YearMonthDate.today(TOKYO_TIMEZONE)
    let targetDate = _startDate
    const startDateString = _startDate.encode('-')
    const endDateString = _endDate.encode('-')
    console.log(
      `Syncing EDINET Document lists from ${startDateString} to ${endDateString}.`
    )
    while (targetDate.isSameOrBefore(_endDate)) {
      await this.syncEdinetDocumentListOfDate(targetDate.clone(), refresh)
      await this.sleep.sleep()
      targetDate = targetDate.add(1, 'day')
    }
  }

  async syncEdinetDocument(docID: string, refresh?: boolean) {
    if (
      !refresh &&
      (await this.s3Client.doesEdinetDocumentsResponseExist(docID))
    ) {
      console.log(`Document of docID ${docID} exists.`)
      return
    }
    try {
      const response = await this.edinetClient.fetchDocuments(docID)
      console.log(`Fetched document of docID ${docID}.`)
      await this.s3Client.uploadEdinetDocumentsResponse(docID, response)
      console.log(`Uploaded document of docID ${docID}.`)
      await this.sleep.sleep()
    } catch (e) {
      console.error(e)
    }
  }

  async syncEdinetDocumentsOfDate(
    targetDate: YearMonthDate,
    refresh?: boolean
  ) {
    const targetDateString = targetDate.encode('-')
    let list
    try {
      list = await this.s3Client.downloadEdinetDocumentListResponse(targetDate)
    } catch (e: any) {
      if (typeof e == 'object' && e instanceof S3ClientError) {
        if (e.reason == 'NotFound') {
          console.warn(
            `Document list of ${targetDateString} not found, please sync it first.`
          )
        } else {
          throw e
        }
      } else {
        throw e
      }
    }

    // ???????????? ??????????????????????????????????????????????????????????????????????????????????????????????????? ?????????
    // see https://qiita.com/XBRLJapan/items/27e623b8ca871740f352
    const docIDs =
      list?.results?.filter((result) => {
        if (result.ordinanceCode != '010') {
          return false
        }
        return ['030000', '030001', '043000', '043001'].includes(
          result.formCode
        )
      }) ?? []
    console.log(
      `${docIDs.length} documents for ${targetDateString} to by synced.`
    )
    for (const result of docIDs) {
      await this.syncEdinetDocument(result.docID, refresh)
    }
  }

  async syncEdinetDocumentsOfDateRange(
    startDate?: YearMonthDate,
    endDate?: YearMonthDate,
    refresh?: boolean
  ) {
    const _startDate =
      startDate ?? YearMonthDate.today(TOKYO_TIMEZONE).subtract(5, 'years')
    const _endDate = endDate ?? YearMonthDate.today(TOKYO_TIMEZONE)
    const startDateString = _startDate.encode('-')
    const endDateString = _endDate.encode('-')
    console.log(
      `Syncing EDINET Documents from ${startDateString} to ${endDateString}.`
    )
    let targetDate = _startDate.clone()
    while (targetDate.isSameOrBefore(_endDate)) {
      await this.syncEdinetDocumentsOfDate(targetDate.clone(), refresh)
      targetDate = targetDate.add(1, 'day')
    }
  }
}
