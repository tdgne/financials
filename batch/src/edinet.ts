import axios from 'axios'
import { Moment } from 'moment'
import { injectable } from 'tsyringe'

const DOCUMENT_LIST_ENDPOINT = 'https://disclosure.edinet-fsa.go.jp/api/v1/documents.json'

export interface IEdinetRepository {
  fetchDocumentList(date: Moment): Promise<any>
}

@injectable()
export class EdinetRepository implements IEdinetRepository {
  constructor() {
    console.log('Constructed real EdinetRepository')
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
export class MockEdinetRepository implements IEdinetRepository {
  constructor() {
    console.log('Constructed mock EdinetRepository')
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
