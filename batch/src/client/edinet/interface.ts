import { Moment } from 'moment'
import { EdinetDocumentListResponse } from '../../model/document-list'

export interface IEdinetClient {
  fetchDocumentList(date: Moment): Promise<EdinetDocumentListResponse>
}
