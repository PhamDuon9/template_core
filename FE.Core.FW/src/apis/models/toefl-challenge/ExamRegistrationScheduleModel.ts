/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RegistrationExamType } from "./RegistrationExamType";
import type { RegistrationRound } from "./RegistrationRound";

export type ExamRegistrationScheduleModel = {
  id?: string;
  examId?: string;
  registrationExamType?: RegistrationExamType;
  startDate?: string;
  endDate?: string;
  examDate?: string;
  registrationRound?: RegistrationRound;
};

