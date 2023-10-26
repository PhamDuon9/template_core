/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { SelectOptionModel } from "@/@types/data";
import type { RegistrationExamType } from "./RegistrationExamType";

export type ExamLocationRoomMapScheduleModel = {
  id?: string;
  examId?: string;
  examScheduleId?: string;
  examLocationId?: string;
  examLocationRoomId?: string;
  examLocationScheduleId?: string;
  examType?: RegistrationExamType;
  amount?: number;
  examTypeSelect?: SelectOptionModel
  examLocationScheduleSelect?: SelectOptionModel
};

