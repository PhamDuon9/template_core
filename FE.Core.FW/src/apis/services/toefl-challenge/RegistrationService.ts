/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResponseData } from "../../models/ResponseData";
import type { CancelablePromise } from "../../core/CancelablePromise";
import {
  request as __request,
  useRequest,
  UseRequestOption,
} from "../../core/request";
import { RegistrationModel } from "@/apis/models/toefl-challenge/RegistrationModel";
import { PICType } from "@/apis/models/toefl-challenge/PICType";
import { RegistrationExamType } from "@/apis/models/toefl-challenge/RegistrationExamType";
import { RegistrationRound } from "@/apis/models/toefl-challenge/RegistrationRound";
const END_POINT = import.meta.env.VITE_TOEFL_CHALLENGE

/**
 * @param requestBody
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postRegistration = (
  requestBody?: RegistrationModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/registration`,
    body: requestBody,
    mediaType: "application/json",
  });
};

/**
 * @param id
 * @returns ResponseData Success
 * @throws ApiError
 */
export const deleteRegistration = (
  id?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "DELETE",
    path: END_POINT + `/registration`,
    query: {
      id: id,
    },
  });
};

/**
 * @param filter
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getRegistration = (
  filter: string = "{}"
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/registration`,
    query: {
      filter: filter,
    },
  });
};

/**
 * @param formData
 * @returns ResponseData Success
 * @throws ApiError
 */
export const putRegistration = (formData?: {
  ExamId?: string;
  SchoolId?: string;
  File?: Blob;
}): CancelablePromise<ResponseData> => {
  return __request({
    method: "PUT",
    path: END_POINT + `/registration`,
    formData: formData,
    mediaType: "multipart/form-data",
  });
};

/**
 * @param id
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getRegistration1 = (
  id?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/registration/id`,
    query: {
      id: id,
    },
  });
};

/**
 * @param id
 * @param requestBody
 * @returns ResponseData Success
 * @throws ApiError
 */
export const putRegistration1 = (
  id?: string,
  requestBody?: RegistrationModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "PUT",
    path: END_POINT + `/registration/id`,
    query: {
      id: id,
    },
    body: requestBody,
    mediaType: "application/json",
  });
};

/**
 * @param formData
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postRegistration1 = (formData?: {
  RegistrationExamType?: RegistrationExamType;
  ExamId?: string;
  SchoolId?: string;
  "PIC.Id"?: string;
  "PIC.ObjectId"?: string;
  "PIC.PICType"?: PICType;
  "PIC.Name"?: string;
  "PIC.JobTitle"?: string;
  "PIC.Tel"?: string;
  "PIC.Email"?: string;
  File?: Blob;
}): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/registration/import`,
    formData: formData,
    mediaType: "multipart/form-data",
  });
};

/**
 * @param formData
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postRegistration2 = (formData?: {
  RegistrationExamType?: RegistrationExamType;
  ExamId?: string;
  SchoolId?: string;
  "PIC.Id"?: string;
  "PIC.ObjectId"?: string;
  "PIC.PICType"?: PICType;
  "PIC.Name"?: string;
  "PIC.JobTitle"?: string;
  "PIC.Tel"?: string;
  "PIC.Email"?: string;
  File?: Blob;
}): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/registration/import2`,
    formData: formData,
    mediaType: "multipart/form-data",
  });
};

/**
 * @param id
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postRegistration3 = (
  id?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/registration/email/code`,
    query: {
      id: id,
    },
  });
};

/**
 * @param id
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postRegistration4 = (
  id?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/registration/email/registration`,
    query: {
      id: id,
    },
  });
};

/**
 * @param id
 * @param round
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postRegistration5 = (
  id?: string,
  round?: RegistrationRound
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/registration/email/registration-payment`,
    query: {
      id: id,
      round: round,
    },
  });
};
