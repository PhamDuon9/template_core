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
import { TransactionUpdateModel } from "@/apis/models/toefl-challenge/TransactionUpdateModel";
import { RegistrationRound } from "@/apis/models/toefl-challenge/RegistrationRound";
const END_POINT = import.meta.env.VITE_TOEFL_CHALLENGE
/**
 * @param id
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getTransaction = (
  id?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/transaction`,
    query: {
      id: id,
    },
  });
};

/**
 * @param requestBody
 * @returns ResponseData Success
 * @throws ApiError
 */
export const putTransaction = (
  requestBody?: TransactionUpdateModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "PUT",
    path: END_POINT + `/transaction`,
    body: requestBody,
    mediaType: "application/json",
  });
};

/**
 * @param registrationId
 * @param round
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postTransaction = (
  registrationId?: string,
  round?: RegistrationRound
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/transaction`,
    query: {
      registrationId: registrationId,
      round: round,
    },
  });
};

/**
 * @param transactionNo
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getTransaction1 = (
  transactionNo?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/transaction/gettransachtionresult`,
    query: {
      transactionNo: transactionNo,
    },
  });
};

/**
 * @param filter
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getTransaction2 = (
  filter: string = "{}"
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/transaction/history`,
    query: {
      filter: filter,
    },
  });
};
