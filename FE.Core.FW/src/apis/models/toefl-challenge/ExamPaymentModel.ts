/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RegistrationExamType } from "./RegistrationExamType";

export type ExamPaymentModel = {
  id?: string;
  examId?: string;
  registrationExamType?: RegistrationExamType;
  price?: number;
  registrationRound?: number;
};

