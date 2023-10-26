/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type TransactionHistoryModel = {
  id?: string;
  transactionId?: string;
  transactionNo?: string | null;
  transactionResult?: boolean;
  bankCode?: string | null;
  bankTransactionNo?: string | null;
  paymentType?: string | null;
  paymentDate?: string | null;
  rawData?: string | null;
};

