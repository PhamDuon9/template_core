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
import { DepartmentModel } from "@/apis/models/toefl-challenge/DepartmentModel";

const END_POINT = import.meta.env.VITE_TOEFL_CHALLENGE
/**
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postDepartment = (): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/department/bootstrap`,
  });
};

/**
 * @param filter
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getDepartment = (
  filter: string = "{}"
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/department`,
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
export const getDepartmentId = (
  id?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/department/id`,
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
export const putDepartment = (
  id?: string,
  requestBody?: DepartmentModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "PUT",
    path: END_POINT + `/department/id`,
    query: {
      id: id,
    },
    body: requestBody,
    mediaType: "application/json",
  });
};

/**
 * @param requestBody
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postDepartmentCreate = (
  requestBody?: DepartmentModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/department/create`,
    body: requestBody,
    mediaType: "application/json",
  });
};

/**
 * @param id
 * @param tenant
 * @returns ResponseData Success
 * @throws ApiError
 */
export const deleteDepartment = (
  id: string,
  tenant?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "DELETE",
    path: END_POINT + `/department/delete/${id}`,
    headers: {
      Tenant: tenant,
    },
  });
};

/**
 * @param requestBody
 * @returns ResponseData Success
 * @throws ApiError
 */
export const deleteManyDepartment = (
  requestBody?: Array<string>
): CancelablePromise<ResponseData> => {
  return __request({
    method: "DELETE",
    path: END_POINT+`/department/MultiDelete`,
    body: requestBody,
    mediaType: "application/json",
  });
};