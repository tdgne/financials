import moment, { Moment } from 'moment'
import { injectable } from 'tsyringe'
import { IEdinetClient } from './interface'

@injectable()
export class MockEdinetClient implements IEdinetClient {
  constructor() {
    console.log('Constructed mock EdinetClient')
  }

  async fetchDocumentList(date: Moment) {
    if (date.isSameOrBefore(moment('2021-12-25').tz('Asia/Tokyo'))) {
      return {
        data: {
          metadata: {
            status: 200,
            message: 'OK'
          }
        }
      }
    }
    return {
      data: {
        metadata: {
          status: 404,
          message: 'NotFound'
        }
      }
    }
  }
}
