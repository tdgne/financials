import axios from 'axios'
import { Moment } from 'moment'
import { injectable } from 'tsyringe'

const DOCUMENT_LIST_ENDPOINT = 'https://disclosure.edinet-fsa.go.jp/api/v1/documents.json'

export interface IEdinetClient {
  fetchDocumentList(date: Moment): Promise<any>
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

  async fetchDocumentList(_date: Moment) {
    return {
      metadata: {
        status: 200,
        message: 'OK'
      }
    }
  }
}
