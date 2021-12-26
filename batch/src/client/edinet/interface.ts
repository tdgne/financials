import { Moment } from 'moment'
import { EdinetDocumentListResponse } from '../../model/document-list'
import { EdinetDocumentsResponse } from '../../model/documents'

export interface IEdinetClient {
  fetchDocumentList(date: Moment): Promise<EdinetDocumentListResponse>
  fetchDocuments(docID: string): Promise<EdinetDocumentsResponse>
}
