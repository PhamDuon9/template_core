/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProductModel } from "../models/ProductModel";
import type { ResponseData } from "../models/ResponseData";
import type { CancelablePromise } from "../core/CancelablePromise";
import {
  request as __request,
  useRequest,
  UseRequestOption,
} from "../core/request";

/**
 * @param tenant
 * @param requestBody
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postProduct = (
  tenant?: string,
  requestBody?: ProductModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: `/Product`,
    headers: {
      Tenant: tenant,
    },
    body: requestBody,
    mediaType: "application/json",
  });
};

/**
 * @param filter
 * @param tenant
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getProduct = (
  filter: string = "{}",
  tenant?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: `/Product`,
    headers: {
      Tenant: tenant,
    },
    query: {
      filter: filter,
    },
  });
};

/**
 * @param id
 * @param tenant
 * @returns ResponseData Success
 * @throws ApiError
 */
export const deleteProduct = (
  id?: string,
  tenant?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "DELETE",
    path: `/Product/id`,
    headers: {
      Tenant: tenant,
    },
    query: {
      id: id,
    },
  });
};

/**
 * @param id
 * @param tenant
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getProduct1 = (
  id?: string,
  tenant?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: `/Product/id`,
    headers: {
      Tenant: tenant,
    },
    query: {
      id: id,
    },
  });
};

/**
 * @param id
 * @param tenant
 * @param requestBody
 * @returns ResponseData Success
 * @throws ApiError
 */
export const putProduct = (
  id?: string,
  tenant?: string,
  requestBody?: ProductModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "PUT",
    path: `/Product/id`,
    headers: {
      Tenant: tenant,
    },
    query: {
      id: id,
    },
    body: requestBody,
    mediaType: "application/json",
  });
};
/**
 * @param tenant
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getProduct2 = (
  tenant?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: `/Product/template`,
    headers: {
      Tenant: tenant,
    },
  });
};

/**
 * @param tenant
 * @param formData
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postProduct1 = (
  tenant?: string,
  formData?: {
    file?: Blob;
  }
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: `/Product/import`,
    headers: {
      Tenant: tenant,
    },
    formData: formData,
    mediaType: "multipart/form-data",
  });
};

