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
import { RegistrationScheduleModel } from "@/apis/models/toefl-challenge/RegistrationScheduleModel";
import { RegistrationRound } from "@/apis/models/toefl-challenge/RegistrationRound";
const END_POINT = import.meta.env.VITE_TOEFL_CHALLENGE
/**
 * @param requestBody
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postRegistrationSchedule = (
  requestBody?: RegistrationScheduleModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/registrationschedule`,
    body: requestBody,
    mediaType: "application/json",
  });
};

/**
 * @param id
 * @returns ResponseData Success
 * @throws ApiError
 */
export const deleteRegistrationSchedule = (
  id?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "DELETE",
    path: `/registrationschedule`,
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
export const getRegistrationSchedule = (
  filter: string = "{}"
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/registrationschedule`,
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
export const getRegistrationSchedule1 = (
  id?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: `/registrationschedule/id`,
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
export const putRegistrationSchedule = (
  id?: string,
  requestBody?: RegistrationScheduleModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "PUT",
    path: `/registrationschedule/id`,
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
export const postRegistrationSchedule1 = (formData?: {
  ExamId?: string;
  Round?: RegistrationRound;
  File?: Blob;
}): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: `/registrationschedule/import`,
    formData: formData,
    mediaType: "multipart/form-data",
  });
};