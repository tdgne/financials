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
  syncEdinetDocumentLists(
    startDate?: Moment,
    endDate?: Moment,
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

  async syncEdinetDocumentLists(
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
}
