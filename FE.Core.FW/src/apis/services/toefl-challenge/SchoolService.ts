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
import { SchoolModel } from "@/apis/models/toefl-challenge/SchoolModel";
import { SchoolType } from "@/apis/models/toefl-challenge/SchoolType";

const END_POINT = import.meta.env.VITE_TOEFL_CHALLENGE
/**
 * @param requestBody
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postSchool = (
  requestBody?: SchoolModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/school`,
    body: requestBody,
    mediaType: "application/json",
  });
};

/**
 * @param filter
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getSchool = (
  filter: string = "{}"
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/school`,
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
export const deleteSchool = (id?: string): CancelablePromise<ResponseData> => {
  return __request({
    method: "DELETE",
    path: END_POINT + `/school/id`,
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
export const getSchool1 = (id?: string): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/school/id`,
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
export const putSchool = (
  id?: string,
  requestBody?: SchoolModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "PUT",
    path: END_POINT + `/school/id`,
    query: {
      id: id,
    },
    body: requestBody,
    mediaType: "application/json",
  });
};

/**
 * @param filter
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getSchool2 = (
  filter: string = "{}"
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/school/tree`,
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
export const postSchool1 = (formData?: {
  ProvinceId?: string;
  DistrictId?: string;
  DepartmentId?: string;
  DivisionId?: string;
  SchoolLevel?: SchoolType;
  File?: Blob;
}): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/school/import`,
    formData: formData,
    mediaType: "multipart/form-data",
  });
};
/**
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getSchoolTree = (filter: string = "{}"): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/school/tree-cascader`,
    query: {
      filter: filter,
    },
  });
};
