/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MemoryStream } from "./MemoryStream";

export type ExamRoomDividedModel = {
  id?: string;
  dividingExamPlaceId?: string;
  examRoomId?: string;
  examRoomName?: string | null;
  capacity?: number;
  actualQuantity?: number;
  examPlaceName?: string | null;
  examAreaName?: string | null;
  examScheduleTopikName?: string | null;
  examName?: string | null;
  examId?: string;
  candidateName?: string | null;
  candidateKoreaName?: string | null;
  candidateEmail?: string | null;
  candidatePhone?: string | null;
  candidateBirthday?: string | null;
  candidateBirthdayFormat?: string | null;
  languageSendMail?: string | null;
  candidateNumber?: string | null;
  userProfileId?: string;
  isSendMail?: number;
  candidateGender?: number;
  candidateImageStr?: string | null;
  candidateImage?: MemoryStream;
  tt?: number | null;
  order?: number | null;
  isDisable?: boolean | null;
};

