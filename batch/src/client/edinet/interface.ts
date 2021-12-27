import { YearMonthDate } from '../../model/date'
import { EdinetDocumentListResponse } from '../../model/document-list'
import { EdinetDocumentsResponse } from '../../model/documents'

export interface IEdinetClient {
  fetchDocumentList(date: YearMonthDate): Promise<EdinetDocumentListResponse>
  fetchDocuments(docID: string): Promise<EdinetDocumentsResponse>
}
