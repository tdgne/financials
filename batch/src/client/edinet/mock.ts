import { injectable } from 'tsyringe'
import { YearMonthDate } from '../../model/date'
import { EdinetDocumentListResponse } from '../../model/document-list'
import { EdinetDocumentsResponse } from '../../model/documents'
import { IEdinetClient } from './interface'

@injectable()
export class MockEdinetClient implements IEdinetClient {
  constructor() {
    console.log('Constructed mock EdinetClient')
  }

  async fetchDocumentList(
    date: YearMonthDate
  ): Promise<EdinetDocumentListResponse> {
    const ok = date.isSameOrBefore(new YearMonthDate(2021, 12, 25))
    return {
      metadata: {
        status: ok ? 200 : 404,
        message: ok ? 'OK' : 'NotFound',
        parameter: {
          date: date.encode('-'),
          type: '2',
        },
      },
    }
  }

  async fetchDocuments(_docID: string): Promise<EdinetDocumentsResponse> {
    return {
      file: new ArrayBuffer(100),
    }
  }
}
