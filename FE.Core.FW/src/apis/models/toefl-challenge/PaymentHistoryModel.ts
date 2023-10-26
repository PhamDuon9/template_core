/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { RegistrationModel } from "./RegistrationModel";
import { TransactionModel } from "./TransactionModel";

export type PaymentHistoryModel = {
  transaction?: TransactionModel | null;
  objectRegistrationRef?: RegistrationModel | null;
};

