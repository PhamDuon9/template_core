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
import { TemplateType } from "@/apis/models/toefl-challenge/TemplateType";
const END_POINT = import.meta.env.VITE_TOEFL_CHALLENGE
/**
 * @param type
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getFile = (
  type?: TemplateType
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/file/template`,
    query: {
      type: type,
    },
  });
};

