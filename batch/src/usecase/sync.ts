import * as dotenv from 'dotenv'
dotenv.config()

import { Moment } from 'moment'
import { inject, injectable } from 'tsyringe'
import { IEdinetClient } from '../client/edinet/interface'
import { IS3Client } from '../client/s3/interface'
import { EdinetDocumentListResponse } from '../model/document-list'
import { ISleep, today } from '../utils'

export interface ISyncService {
  syncEdinetDocumentListOfDate(targetDate: Moment, refresh?: boolean): void
  syncEdinetDocumentListsOfDateRange(
    startDate?: Moment,
    endDate?: Moment,
    refresh?: boolean
  ): void
  syncEdinetDocument(docID: string, refresh?: boolean): void
  syncEdinetDocumentsOfDate(targetDate: Moment, refresh?: boolean): void
  syncEdinetDocumentsOfDateRange(
    startDate: Moment,
    endDate: Moment,
    refresh?: boolean
  ): void
}

@injectable()
export class SyncService implements ISyncService {
  constructor(
    @inject('EdinetClient') public edinetClient: IEdinetClient,
    @inject('S3Client') public s3Client: IS3Client,
    @inject('Sleep') public sleep: ISleep
  ) {}

  async syncEdinetDocumentListOfDate(targetDate: Moment, refresh?: boolean) {
    const _targetDate = targetDate.clone().startOf('day')
    const targetDateString = _targetDate.format('YYYY-MM-DD')
    if (
      !refresh &&
      (await this.s3Client.doesEdinetDocumentListResponseExist(_targetDate))
    ) {
      console.log(`Document list of ${targetDateString} exists.`)
      return
    }
    const documentList: EdinetDocumentListResponse =
      await this.edinetClient.fetchDocumentList(_targetDate)
    const { status, message } = documentList.metadata
    console.log(
      `Fetched document list of ${targetDateString} (${status}, ${message}).`
    )
    if (status == 200) {
      await this.s3Client.uploadEdinetDocumentListResponse(
        _targetDate,
        documentList
      )
      console.log(`Uploaded document list of ${targetDateString} to S3.`)
    } else {
      console.log(`Skipped uploading document list of ${targetDateString}.`)
    }
  }

  async syncEdinetDocumentListsOfDateRange(
    startDate?: Moment,
    endDate?: Moment,
    refresh?: boolean
  ) {
    const _startDate = (
      startDate?.clone() || today('Asia/Tokyo').subtract(5, 'years')
    ).startOf('day')
    const _endDate = (endDate?.clone() || today('Asia/Tokyo')).startOf('day')
    let targetDate = _startDate.clone()
    while (targetDate.isSameOrBefore(_endDate, 'day')) {
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

  async syncEdinetDocumentsOfDate(targetDate: Moment, refresh?: boolean) {
    const _targetDate = targetDate.clone().startOf('day')
    const targetDateString = _targetDate.format('YYYY-MM-DD')
    const list = await this.s3Client.downloadEdinetDocumentListResponse(
      _targetDate
    )

    // ひとまず 有価証券報告書、訂正有価証券報告書、四半期報告書、訂正四半期報告書 に絞る
    // see https://qiita.com/XBRLJapan/items/27e623b8ca871740f352
    const docIDs =
      list.results?.filter((result) => {
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
    startDate?: Moment,
    endDate?: Moment,
    refresh?: boolean
  ) {
    const _startDate = (
      startDate?.clone() || today('Asia/Tokyo').subtract(5, 'years')
    ).startOf('day')
    const _endDate = (endDate?.clone() || today('Asia/Tokyo')).startOf('day')
    let targetDate = _startDate.clone()
    while (targetDate.isSameOrBefore(_endDate, 'day')) {
      await this.syncEdinetDocumentsOfDate(targetDate.clone(), refresh)
      targetDate = targetDate.add(1, 'day')
    }
  }
}
