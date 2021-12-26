import moment, { Moment } from 'moment'
import { injectable } from 'tsyringe'
import { EdinetDocumentListResponse } from '../../model/document-list'
import { IEdinetClient } from './interface'

@injectable()
export class MockEdinetClient implements IEdinetClient {
  constructor() {
    console.log('Constructed mock EdinetClient')
  }

  async fetchDocumentList(date: Moment): Promise<EdinetDocumentListResponse> {
    const ok = date.isSameOrBefore(moment('2021-12-25').tz('Asia/Tokyo'))
    return {
      metadata: {
        status: ok ? 200 : 404,
        message: ok ? 'OK' : 'NotFound',
        parameter: {
          date: date.format('YYYY-MM-DD'),
          type: '2',
        },
      },
    }
  }
}
