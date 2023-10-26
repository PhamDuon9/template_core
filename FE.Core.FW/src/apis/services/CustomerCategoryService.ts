/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CustomerCategoryModel } from "../models/CustomerCategoryModel";
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
export const postCustomerCategory = (
  tenant?: string,
  requestBody?: CustomerCategoryModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: `/CustomerCategory`,
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
export const getCustomerCategory = (
  filter: string = "{}",
  tenant?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: `/CustomerCategory`,
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
export const deleteCustomerCategory = (
  id?: string,
  tenant?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "DELETE",
    path: `/CustomerCategory/id`,
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
export const getCustomerCategory1 = (
  id?: string,
  tenant?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: `/CustomerCategory/id`,
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
export const putCustomerCategory = (
  id?: string,
  tenant?: string,
  requestBody?: CustomerCategoryModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "PUT",
    path: `/CustomerCategory/id`,
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
