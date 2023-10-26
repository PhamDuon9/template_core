/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProductCategoryModel } from "../models/ProductCategoryModel";
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
export const postProductCategory = (
  tenant?: string,
  requestBody?: ProductCategoryModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: `/ProductCategory`,
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
export const getProductCategory = (
  filter: string = "{}",
  tenant?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: `/ProductCategory`,
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
export const deleteProductCategory = (
  id?: string,
  tenant?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "DELETE",
    path: `/ProductCategory/id`,
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
export const getProductCategory1 = (
  id?: string,
  tenant?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: `/ProductCategory/id`,
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
export const putProductCategory = (
  id?: string,
  tenant?: string,
  requestBody?: ProductCategoryModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "PUT",
    path: `/ProductCategory/id`,
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


