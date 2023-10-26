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
import { DivisionModel } from "@/apis/models/toefl-challenge/DivisionModel";

const END_POINT = import.meta.env.VITE_TOEFL_CHALLENGE
/**
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postDivision = (): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/division/bootstrap`,
  });
};

/**
 * @param filter
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getDivision = (
  filter: string = "{}"
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/division`,
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
export const getDivisionId = (id?: string): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/division/id`,
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
export const putDivision = (
  id?: string,
  requestBody?: DivisionModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "PUT",
    path: END_POINT + `/division/id`,
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
export const postDivisionCreate = (
  requestBody?: DivisionModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/division/create`,
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
export const deleteDivision = (
  id: string,
  tenant?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "DELETE",
    path: END_POINT + `/division/delete/${id}`,
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
export const deleteManyDivision = (
  requestBody?: Array<string>
): CancelablePromise<ResponseData> => {
  return __request({
    method: "DELETE",
    path: END_POINT + `/division/MultiDelete`,
    body: requestBody,
    mediaType: "application/json",
  });
};

