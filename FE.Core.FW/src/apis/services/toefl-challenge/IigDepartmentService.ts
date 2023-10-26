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
import { IIGDepartmentModel } from "@/apis/models/toefl-challenge/IIGDepartmentModel";
const END_POINT = import.meta.env.VITE_TOEFL_CHALLENGE
/**
 * @param requestBody
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postIigDepartment = (
  requestBody?: IIGDepartmentModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: `/iigdepartment`,
    body: requestBody,
    mediaType: "application/json",
  });
};

/**
 * @param filter
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getIigDepartment = (
  filter: string = "{}"
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: `/iigdepartment`,
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
export const deleteIigDepartment = (
  id?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "DELETE",
    path: `/iigdepartment/id`,
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
export const getIigDepartment1 = (
  id?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: `/iigdepartment/id`,
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
export const putIigDepartment = (
  id?: string,
  requestBody?: IIGDepartmentModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "PUT",
    path: `/iigdepartment/id`,
    query: {
      id: id,
    },
    body: requestBody,
    mediaType: "application/json",
  });
};

/**
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getIigDepartment2 = (): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/iigdepartment/tree`,
  });
};


