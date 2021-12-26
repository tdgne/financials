import { Moment } from 'moment'

export interface HasMetadata {
  data: {
    metadata: {
      status: number
      message: string
    }
  }
}

export interface IEdinetClient {
  fetchDocumentList(date: Moment): Promise<HasMetadata>
}
