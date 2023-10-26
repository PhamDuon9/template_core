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
import { EmailTemplateModel } from "@/apis/models/toefl-challenge/EmailTemplateModel";
const END_POINT = import.meta.env.VITE_TOEFL_CHALLENGE
/**
 * @param requestBody
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postEmailTemplate = (
  requestBody?: EmailTemplateModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/emailtemplate`,
    body: requestBody,
    mediaType: "application/json",
  });
};

/**
 * @param filter
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getEmailTemplate = (
  filter: string = "{}"
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/emailtemplate`,
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
export const deleteEmailTemplate = (
  id?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "DELETE",
    path: END_POINT + `/emailtemplate/id`,
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
export const getEmailTemplate1 = (
  id?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/emailtemplate/id`,
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
export const putEmailTemplate = (
  id?: string,
  requestBody?: EmailTemplateModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "PUT",
    path: END_POINT + `/emailtemplate/id`,
    query: {
      id: id,
    },
    body: requestBody,
    mediaType: "application/json",
  });
};

/**
 * @param id
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getEmailTemplateType = (): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/emailtemplate/email-template-type`,
  });
};