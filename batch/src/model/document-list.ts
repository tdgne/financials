export interface EdinetDocumentListResponse {
  metadata: {
    status: number
    message: string
    parameter: {
      date: string
      type: string
    }
  }
  results?: [
    {
      seqNumber: number // 連番
      docID: string // 書類管理番号
      edinetCode: string // 提出者 EDINET コード
      secCode?: string // 提出者証券コード
      JCN: string // 提出法人番号
      filerName: string // 提出者名
      fundCode: string // ファンドコード
      ordinanceCode: string // 府令コード
      formCode: string // 様式コード
      docTypeCode: string // 書類種別コード
      periodStart: string // 期間(自)
      periodEnd: string // 期間(至)
      submitDateTime: string // 提出日時
      docDescription: string // 提出書類概要
      issuerEdinetCode?: string // 発行会社 EDINET コード
      subjectEdinetCode?: string // 対象 EDINET コード
      subsidiaryEdinetCode?: string // 子会社 EDINET コード
      currentReportReason?: string // 臨報提出事由
      parentDocId?: string // 親書類管理番号
      opeDateTime?: string // 操作日時
      withdrawalStatus: string // 取下区分 (取下書="1", 取り下げられた書類="2", それ以外は "0")
      docInfoEditStatus: string // 書類情報修正区分 (財務局職員が書類を修正した情報="1", 修正された書類="2", それ以外は"0")
      disclosureStatus: string // 開示不開示 (財務局職員によって書類の不開示を開始した情報="1", 不開示とされている書類="2", 財務局職員によって書類の不開示を解除した情報="3", それ以外は"0")
      xbrlFlag: string // XBRL 有無フラグ
      pdfFlag: string // PDF 有無フラグ
      attachDocFlag: string // 代替書面・添付文書有無フラグ
      englishDocFlag: string // 英文ファイル有無フラグ
    }
  ]
}
