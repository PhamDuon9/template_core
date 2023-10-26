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
import { ExamModel } from "@/apis/models/toefl-challenge/ExamModel";

const END_POINT = import.meta.env.VITE_TOEFL_CHALLENGE

/**
 * @param requestBody
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postExam = (
  requestBody?: ExamModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/exam`,
    body: requestBody,
    mediaType: "application/json",
  });
};

/**
 * @param filter
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getExam = (
  filter: string = "{}"
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/exam`,
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
export const deleteExam = (id?: string): CancelablePromise<ResponseData> => {
  return __request({
    method: "DELETE",
    path: END_POINT + `/exam/id`,
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
export const getExam1 = (id?: string): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/exam/id`,
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
export const putExam = (
  id?: string,
  requestBody?: ExamModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "PUT",
    path: END_POINT + `/exam/id`,
    query: {
      id: id,
    },
    body: requestBody,
    mediaType: "application/json",
  });
};
