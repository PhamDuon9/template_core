/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ExamPaymentModel } from "./ExamPaymentModel";
import type { ExamRegistrationProvinceModel } from "./ExamRegistrationProvinceModel";
import type { ExamRegistrationScheduleModel } from "./ExamRegistrationScheduleModel";
import type { ExamType } from "./ExamType";
import type { ProvinceModel } from "./ProvinceModel";

export type ExamModel = {
  id?: string;
  name?: string | null;
  provinceId?: string;
  year?: number;
  examType?: ExamType;
  status?: boolean;
  createdOnDate?: string | null;
  examRegistrationSchedules?: Array<ExamRegistrationScheduleModel> | null;
  examRegistrationProvinces?: Array<ExamRegistrationProvinceModel> | null;
  examPayments?: Array<ExamPaymentModel> | null;
  provinces?: Array<ProvinceModel> | null;
};

