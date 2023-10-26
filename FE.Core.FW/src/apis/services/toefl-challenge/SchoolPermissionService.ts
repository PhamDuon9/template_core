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
const END_POINT = import.meta.env.VITE_TOEFL_CHALLENGE
/**
 * @param departmentId
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getSchoolPermission = (
  departmentId?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/schoolpermission`,
    query: {
      departmentId: departmentId,
    },
  });
};

/**
 * @param departmentId
 * @param requestBody
 * @returns ResponseData Success
 * @throws ApiError
 */
export const putSchoolPermission = (
  departmentId?: string,
  requestBody?: Array<Array<string>>
): CancelablePromise<ResponseData> => {
  return __request({
    method: "PUT",
    path: END_POINT + `/schoolpermission`,
    query: {
      departmentId: departmentId,
    },
    body: requestBody,
    mediaType: "application/json",
  });
};


