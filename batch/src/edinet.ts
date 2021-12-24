import axios from 'axios'
import { Moment } from 'moment'

const DOCUMENT_LIST_ENDPOINT = 'https://disclosure.edinet-fsa.go.jp/api/v1/documents.json'

export function fetchDocumentList(date: Moment) {
  return axios.get(DOCUMENT_LIST_ENDPOINT, {
    params: {
      date: date.format('YYYY-MM-DD'),
      type: 2
    }
  })
}
