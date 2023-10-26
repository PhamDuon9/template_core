/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaymentStatus } from "./PaymentStatus";
import type { PaymentType } from "./PaymentType";
import type { RegistrationRound } from "./RegistrationRound";

export type RegistrationPaymentModel = {
  index?: number;
  id?: string;
  registrationId?: string;
  registrationNumber?: string | null;
  paymentType?: PaymentType;
  transactionId?: string;
  transactionNo?: string | null;
  amount?: number;
  transactionDate?: string | null;
  paymentDate?: string | null;
  transactionContent?: string | null;
  registrationRound?: RegistrationRound;
  paymentStatus?: PaymentStatus;
  note?: string | null;
};

