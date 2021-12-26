import axios from 'axios'
import { Moment } from 'moment'
import { injectable } from 'tsyringe'
import { EdinetDocumentsResponse } from '../../model/documents'
import { IEdinetClient } from './interface'

const DOCUMENT_LIST_ENDPOINT =
  'https://disclosure.edinet-fsa.go.jp/api/v1/documents.json'
const DOCUMENTS_ENDPOINT =
  'https://disclosure.edinet-fsa.go.jp/api/v1/documents/'

@injectable()
export class EdinetClient implements IEdinetClient {
  constructor() {
    console.log('Constructed real EdinetClient')
  }

  async fetchDocumentList(date: Moment) {
    return (
      await axios.get(DOCUMENT_LIST_ENDPOINT, {
        params: {
          date: date.format('YYYY-MM-DD'),
          type: 2,
        },
      })
    ).data
  }

  async fetchDocuments(docID: string): Promise<EdinetDocumentsResponse> {
    const response = await axios.get(`${DOCUMENTS_ENDPOINT}${docID}`, {
      params: {
        type: 1,
      },
      responseType: 'arraybuffer',
    })
    return {
      file: response.data,
    }
  }
}
