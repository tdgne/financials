import axios from 'axios'
import moment, { Moment } from 'moment'
import { injectable } from 'tsyringe'

const DOCUMENT_LIST_ENDPOINT = 'https://disclosure.edinet-fsa.go.jp/api/v1/documents.json'

export interface HasMetadata {
  data: {
    metadata: {
      status: number,
      message: string
    }
  }
}

export interface IEdinetClient {
  fetchDocumentList(date: Moment): Promise<HasMetadata>
}

@injectable()
export class EdinetClient implements IEdinetClient {
  constructor() {
    console.log('Constructed real EdinetClient')
  }

  fetchDocumentList(date: Moment) {
    return axios.get(DOCUMENT_LIST_ENDPOINT, {
      params: {
        date: date.format('YYYY-MM-DD'),
        type: 2
      }
    })
  }
}

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
