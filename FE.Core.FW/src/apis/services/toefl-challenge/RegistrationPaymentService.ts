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
import { RegistrationPaymentModel } from "@/apis/models/toefl-challenge/RegistrationPaymentModel";
const END_POINT = import.meta.env.VITE_TOEFL_CHALLENGE
/**
 * @param id
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getRegistrationPayment = (
  id?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/registrationpayment`,
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
export const postRegistrationPayment = (
  requestBody?: RegistrationPaymentModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/registrationpayment`,
    body: requestBody,
    mediaType: "application/json",
  });
};

/**
 * @param id
 * @param requestBody
 * @returns ResponseData Success
 * @throws ApiError
 */
export const putRegistrationPayment = (
  id?: string,
  requestBody?: RegistrationPaymentModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "PUT",
    path: END_POINT + `/registrationpayment`,
    query: {
      id: id,
    },
    body: requestBody,
    mediaType: "application/json",
  });
};

/**
 * @param formData
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postRegistrationPayment1 = (formData?: {
  IsOverwrite?: boolean;
  File?: Blob;
}): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/registrationpayment/import`,
    formData: formData,
    mediaType: "multipart/form-data",
  });
};
