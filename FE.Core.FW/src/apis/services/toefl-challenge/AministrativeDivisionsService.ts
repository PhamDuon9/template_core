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
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getAministrativeDivisions =
  (): CancelablePromise<ResponseData> => {
    return __request({
      method: "GET",
      path: END_POINT + `/aministrativedivisions/province`,
    });
  };

/**
 * @param id
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getAministrativeDivisions1 = (
  id: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/aministrativedivisions/province/${id}`,
  });
};

/**
 * @param formData
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postAministrativeDivisions = (formData?: {
  ContentType?: string;
  ContentDisposition?: string;
  Headers?: Record<string, Array<string>>;
  Length?: number;
  Name?: string;
  FileName?: string;
}): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: `/aministrativedivisions/province/import`,
    formData: formData,
    mediaType: "multipart/form-data",
  });
};

/**
 * @param formData
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postAministrativeDivisions1 = (formData?: {
  ContentType?: string;
  ContentDisposition?: string;
  Headers?: Record<string, Array<string>>;
  Length?: number;
  Name?: string;
  FileName?: string;
}): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: `/aministrativedivisions/district/import`,
    formData: formData,
    mediaType: "multipart/form-data",
  });
};
