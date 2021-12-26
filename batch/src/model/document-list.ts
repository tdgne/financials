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
      /**
       * 連番
       */
      seqNumber: number
      /**
       * 書類管理番号
       */
      docID: string
      /**
       * 提出者 EDINET コード
       */
      edinetCode: string
      /**
       * 提出者証券コード
       */
      secCode?: string
      /**
       * 提出法人番号
       */
      JCN: string
      /**
       * 提出者名
       */
      filerName: string
      /**
       * ファンドコード
       */
      fundCode: string
      /**
       * 府令コード
       */
      ordinanceCode: string
      /**
       * 様式コード
       */
      formCode: string
      /**
       * 書類種別コード
       */
      docTypeCode: string
      /**
       * 期間(自)
       */
      periodStart: string
      /**
       * 期間(至)
       */
      periodEnd: string
      /**
       * 提出日時
       */
      submitDateTime: string
      /**
       * 提出書類概要
       */
      docDescription: string
      /**
       * 発行会社 EDINET コード
       */
      issuerEdinetCode?: string
      /**
       * 対象 EDINET コード
       */
      subjectEdinetCode?: string
      /**
       * 子会社 EDINET コード
       */
      subsidiaryEdinetCode?: string
      /**
       * 臨報提出事由
       */
      currentReportReason?: string
      /**
       * 親書類管理番号
       */
      parentDocId?: string
      /**
       * 操作日時
       */
      opeDateTime?: string
      /**
       * 取下区分
       *     取下書="1"
       *     取り下げられた書類="2"
       *     それ以外は "0"
       */
      withdrawalStatus: string
      /**
       * 書類情報修正区分
       *     財務局職員が書類を修正した情報="1"
       *     修正された書類="2"
       *     それ以外は"0"
       */
      docInfoEditStatus: string
      /**
       * 開示不開示
       *     財務局職員によって書類の不開示を開始した情報="1"
       *     不開示とされている書類="2"
       *     財務局職員によって書類の不開示を解除した情報="3"
       *     それ以外は"0"
       */
      disclosureStatus: string
      /**
       * XBRL 有無フラグ
       */
      xbrlFlag: string
      /**
       * PDF 有無フラグ
       */
      pdfFlag: string
      /**
       * 代替書面・添付文書有無フラグ
       */
      attachDocFlag: string
      /**
       * 英文ファイル有無フラグ
       */
      englishDocFlag: string
    }
  ]
}
