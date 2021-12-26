import axios from 'axios'
import { Moment } from 'moment'
import { injectable } from 'tsyringe'
import { IEdinetClient } from './interface'

const DOCUMENT_LIST_ENDPOINT =
  'https://disclosure.edinet-fsa.go.jp/api/v1/documents.json'

@injectable()
export class EdinetClient implements IEdinetClient {
  constructor() {
    console.log('Constructed real EdinetClient')
  }

  fetchDocumentList(date: Moment) {
    return axios.get(DOCUMENT_LIST_ENDPOINT, {
      params: {
        date: date.format('YYYY-MM-DD'),
        type: 2,
      },
    })
  }
}
