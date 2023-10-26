/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RegistrationExamType } from "./RegistrationExamType";
import type { RegistrationRound } from "./RegistrationRound";

export type ExamScheduleModel = {
  id?: string;
  examId?: string;
  registrationExamType?: RegistrationExamType;
  registrationRound?: RegistrationRound;
  name?: string | null;
  examName?: string | null;
  provinceId?: string | null;
  provinceName?: string | null;
};

