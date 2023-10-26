/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Gender } from "./Gender";
import type { PaymentStatus } from "./PaymentStatus";
import type { PaymentType } from "./PaymentType";
import type { RegistrationExamType } from "./RegistrationExamType";
import type { RegistrationRound } from "./RegistrationRound";
import type { RegistrationStatus } from "./RegistrationStatus";

export type RegistrationModel = {
  index?: number;
  id?: string;
  examType?: RegistrationExamType;
  fullName?: string | null;
  dayOfBirth?: number;
  monthOfBirth?: number;
  yearOfBirth?: number;
  gender?: Gender;
  block?: number;
  class?: string | null;
  fatherName?: string | null;
  motherName?: string | null;
  email?: string | null;
  tel?: string | null;
  address?: string | null;
  schoolId?: string;
  schoolName?: string | null;
  round?: RegistrationRound;
  ref?: string | null;
  status?: RegistrationStatus;
  isSelfRegistration?: boolean;
  note?: string | null;
  idNo?: string | null;
  registrationNumber?: string | null;
  examId?: string;
  examName?: string | null;
  provinceId?: string;
  provinceName?: string | null;
  districtId?: string;
  districtName?: string | null;
  createdOnDate?: string;
  priceExam?: number;
  isDelivery?: boolean;
  deliveryAddress?: string | null;
  registrationExamTime?: string | null;
  paymentStatus?: PaymentStatus;
  paymentModel?: any;
  isUsedForCommunication?: boolean;
  genderName?: string | null;
  paymentType?: PaymentType;
};

