/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TransactionHistoryModel } from "./TransactionHistoryModel";
import type { TransactionStatus } from "./TransactionStatus";

export type TransactionModel = {
  id?: string;
  amount?: number;
  link?: string | null;
  content?: string | null;
  transactionHistories?: Array<TransactionHistoryModel> | null;
  status?: TransactionStatus;
  createdOnDate: Date
};

