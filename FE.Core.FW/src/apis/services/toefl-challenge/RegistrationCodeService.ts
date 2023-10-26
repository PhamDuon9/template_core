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
import { RegistrationCodeModel } from "@/apis/models/toefl-challenge/RegistrationCodeModel";
const END_POINT = import.meta.env.VITE_TOEFL_CHALLENGE
/**
 * @param requestBody
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postRegistrationCode = (
  requestBody?: RegistrationCodeModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/registrationcode`,
    body: requestBody,
    mediaType: "application/json",
  });
};

/**
 * @param id
 * @returns ResponseData Success
 * @throws ApiError
 */
export const deleteRegistrationCode = (
  id?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "DELETE",
    path: END_POINT + `/registrationcode`,
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
export const getRegistrationCode = (
  filter: string = "{}"
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/registrationcode`,
    query: {
      filter: filter,
    },
  });
};

/**
 * @param id
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getRegistrationCode1 = (
  id?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/registrationcode/id`,
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
export const putRegistrationCode = (
  id?: string,
  requestBody?: RegistrationCodeModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "PUT",
    path: END_POINT + `/registrationcode/id`,
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
export const postRegistrationCode1 = (formData?: {
  ExamId?: string;
  IsOverwrite?: boolean;
  File?: Blob;
}): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/registrationcode/import`,
    formData: formData,
    mediaType: "multipart/form-data",
  });
};

export const postEmailRegistrationCode = (
  examId?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/registrationcode/email`,
    query: {
      examId: examId,
    },
  });
};

