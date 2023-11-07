/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdministrativeUnitModel } from "../models/AdministrativeUnitModel";
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
export const postAdministrativeUnit = (
  tenant?: string,
  requestBody?: AdministrativeUnitModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: `/AdministrativeUnit`,
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
export const getAdministrativeUnit = (
  filter: string = "{}",
  tenant?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: `/AdministrativeUnit`,
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
export const deleteAdministrativeUnit = (
  id?: string,
  tenant?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "DELETE",
    path: `/AdministrativeUnit/id`,
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
export const getAdministrativeUnitById = (
  id?: string,
  tenant?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: `/AdministrativeUnit/id`,
    headers: {
      Tenant: tenant,
    },
    query: {
      id: id,
    },
  });
};

/**
 * @param parentId
 * @param tenant
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getAdministrativeUnitByParentId = (
  parentId?: string,
  tenant?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: `/AdministrativeUnit/parentid`,
    headers: {
      Tenant: tenant,
    },
    query: {
      parentId: parentId,
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
export const putAdministrativeUnit = (
  id?: string,
  tenant?: string,
  requestBody?: AdministrativeUnitModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "PUT",
    path: `/AdministrativeUnit/id`,
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
export const getAdministrativeUnitTree = (
  tenant?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: `/AdministrativeUnit/tree`,
    headers: {
      Tenant: tenant,
    },
  });
};

