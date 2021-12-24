import * as dotenv from 'dotenv'
dotenv.config()

import { Moment } from 'moment'
import { inject, injectable } from 'tsyringe'
import { IEdinetRepository } from './edinet.js'
import { IS3Repository } from './s3.js'
import { sleep, today } from './utils.js'

export interface ISyncService {
  syncEdinetDocumentListOfDate(targetDate: Moment, refresh?: boolean): void
  syncEdinetDocumentLists(startDate?: Moment, endDate?: Moment, refresh?: boolean): void
}

@injectable()
export class SyncService implements ISyncService {
  constructor(
    @inject('EdinetRepository') private edinetRepository: IEdinetRepository,
    @inject('S3Repository') private s3Repository: IS3Repository,
  ) {}

  async syncEdinetDocumentListOfDate(targetDate: Moment, refresh?: boolean) {
    const _targetDate = targetDate.clone().startOf('day')
    const targetDateString = _targetDate.format('YYYY-MM-DD')
    if (!refresh && await this.s3Repository.doesEdinetRawDocumentListExist(_targetDate)) {
      console.log(`Document list of ${targetDateString} exists.`)
      return
    }
    const { data } = await this.edinetRepository.fetchDocumentList(_targetDate)
    const { status, message } = data.metadata
    console.log(`Fetched document list of ${targetDateString} (${status}, ${message}).`)
    if (status == 200) {
      await this.s3Repository.uploadEdinetRawDocumentList(_targetDate, data)
      console.log(`Uploaded document list of ${targetDateString} to S3.`)
    } else {
      console.log(`Skipped uploading document list of ${targetDateString}.`)
    }
  }

  async syncEdinetDocumentLists(startDate?: Moment, endDate?: Moment, refresh?: boolean) {
    const _startDate = (startDate?.clone() || today('Asia/Tokyo').subtract(5, 'years')).startOf('day')
    const _endDate = (endDate?.clone() || today('Asia/Tokyo')).startOf('day')
    let targetDate = _startDate.clone()
    while(targetDate.isSameOrBefore(_endDate, 'day')) {
      await this.syncEdinetDocumentListOfDate(targetDate.clone(), refresh)
      await sleep()
      targetDate = targetDate.add(1, 'day')
    }
  }
}

