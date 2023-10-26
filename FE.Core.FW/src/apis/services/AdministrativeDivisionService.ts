/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResponseData } from "../models/ResponseData";
import type { CancelablePromise } from "../core/CancelablePromise";
import {
  request as __request,
  useRequest,
  UseRequestOption,
} from "../core/request";

/**
 * @param isGetAllDistrict
 * @param tenant
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getAdministrativeDivision = (
  isGetAllDistrict?: boolean,
  tenant?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: `/AdministrativeDivision/province`,
    headers: {
      Tenant: tenant,
    },
    query: {
      isGetAllDistrict: isGetAllDistrict,
    },
  });
};

/**
 * @param provinceId
 * @param tenant
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getAdministrativeDivision1 = (
  provinceId: string,
  tenant?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: `/AdministrativeDivision/province/${provinceId}`,
    headers: {
      Tenant: tenant,
    },
  });
};

/**
 * @param provinceId
 * @param tenant
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getAdministrativeDivision2 = (
  provinceId?: string,
  tenant?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: `/AdministrativeDivision/district`,
    headers: {
      Tenant: tenant,
    },
    query: {
      provinceId: provinceId,
    },
  });
};

/**
 * @param tenant
 * @param formData
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postAdministrativeDivision = (
  tenant?: string,
  formData?: {
    file?: Blob;
  }
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: `/AdministrativeDivision/province/import`,
    headers: {
      Tenant: tenant,
    },
    formData: formData,
    mediaType: "multipart/form-data",
  });
};

/**
 * @param tenant
 * @param formData
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postAdministrativeDivision1 = (
  tenant?: string,
  formData?: {
    file?: Blob;
  }
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: `/AdministrativeDivision/district/import`,
    headers: {
      Tenant: tenant,
    },
    formData: formData,
    mediaType: "multipart/form-data",
  });
};


