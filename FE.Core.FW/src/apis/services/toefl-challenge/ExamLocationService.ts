/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { ExamLocationModel } from '@/apis/models/toefl-challenge/ExamLocationModel';
import { ExamLocationRoomMapScheduleModel } from '@/apis/models/toefl-challenge/ExamLocationRoomMapScheduleModel';
import { ExamLocationRoomModel } from '@/apis/models/toefl-challenge/ExamLocationRoomModel';
import { ExamLocationScheduleModel } from '@/apis/models/toefl-challenge/ExamLocationScheduleModel';
import { ExamScheduleModel } from "@/apis/models/toefl-challenge/ExamScheduleModel";
import type { CancelablePromise } from "../../core/CancelablePromise";
import {
  request as __request
} from "../../core/request";
import type { ResponseData } from "../../models/ResponseData";
const END_POINT = import.meta.env.VITE_TOEFL_CHALLENGE
/**
 * @param filter
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getExamSchedule = (
  filter: string = "{}"
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/examlocation/examschedule`,
    query: {
      filter: filter,
    },
  });
};

/**
 * @param requestBody
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postExamSchedule = (
  requestBody?: ExamScheduleModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/examlocation/examschedule`,
    body: requestBody,
    mediaType: "application/json",
  });
};
/**
 * @param id
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getExamScheduleById = (
  id?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/examlocation/examschedule/${id}`,
  });
};
/**
 * @param id
 * @param requestBody
 * @returns ResponseData Success
 * @throws ApiError
 */
export const putExamScheduleTFC = (
  id?: string,
  requestBody?: ExamScheduleModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "PUT",
    path: END_POINT + `/examlocation/examschedule`,
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
export const deleteExamSchedule = (
  id?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "DELETE",
    path: END_POINT + `/examlocation/examschedule`,
    query: {
      id: id,
    },
  });
};

/**
 * @param filter
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getExamLocation = (
  filter: string = "{}"
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/examlocation/location`,
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
export const getExamLocationById = (
  id?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/examlocation/location/${id}`,
  });
};

/**
 * @param id
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getExamLocationRoomById = (
  id?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/examlocation/room/${id}`,
  });
};


/**
 * @param requestBody
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postExamLocation = (
  requestBody?: ExamLocationModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/examlocation/location`,
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
export const putExamLocation1 = (
  id?: string,
  requestBody?: ExamLocationModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "PUT",
    path: END_POINT + `/examlocation/location`,
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
export const deleteExamLocation = (
  id?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "DELETE",
    path: END_POINT + `/examlocation/location`,
    query: {
      id: id,
    },
  });
};

/**
 * @param filter
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getExamLocation2 = (
  filter: string = "{}"
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/examlocation/room`,
    query: {
      filter: filter,
    },
  });
};

/**
 * @param requestBody
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postExamLocationRoom = (
  requestBody?: ExamLocationRoomModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/examlocation/room`,
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
export const putExamLocation2 = (
  id?: string,
  requestBody?: ExamLocationRoomModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "PUT",
    path: END_POINT + `/examlocation/room`,
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
export const deleteExamLocation2 = (
  id?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "DELETE",
    path: END_POINT + `/examlocation/room`,
    query: {
      id: id,
    },
  });
};

/**
 * @param filter
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getExamLocationSchedule = (
  filter: string = "{}"
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/examlocation/schedule`,
    query: {
      filter: filter,
    },
  });
};

/**
 * @param requestBody
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postExamLocationSchedule = (
  requestBody?: ExamLocationScheduleModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/examlocation/schedule`,
    body: requestBody,
    mediaType: "application/json",
  });
};

/**
 * @param requestBody
 * @returns ResponseData Success
 * @throws ApiError
 */
export const upSertExamLocationSchedule = (
  examLocationId: string,
  requestBody?: ExamLocationScheduleModel[]
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: END_POINT + `/examlocation/schedule/upsert/${examLocationId}`,
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
export const putExamLocation3 = (
  id?: string,
  requestBody?: ExamLocationScheduleModel
): CancelablePromise<ResponseData> => {
  return __request({
    method: "PUT",
    path: `/examlocation/schedule`,
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
export const deleteExamLocation3 = (
  id?: string
): CancelablePromise<ResponseData> => {
  return __request({
    method: "DELETE",
    path: `/examlocation/schedule`,
    query: {
      id: id,
    },
  });
};

/**
 * @param filter
 * @returns ResponseData Success
 * @throws ApiError
 */
export const getExamLocation4 = (
  filter: string = "{}"
): CancelablePromise<ResponseData> => {
  return __request({
    method: "GET",
    path: END_POINT + `/examlocation/map`,
    query: {
      filter: filter,
    },
  });
};

/**
 * @param examId
 * @param examScheduleId
 * @param examLocationId
 * @param requestBody
 * @returns ResponseData Success
 * @throws ApiError
 */
export const postExamLocation4 = (
  examId?: string,
  examScheduleId?: string,
  examLocationId?: string,
  requestBody?: Array<ExamLocationRoomMapScheduleModel>
): CancelablePromise<ResponseData> => {
  return __request({
    method: "POST",
    path: `/examlocation/map`,
    query: {
      examId: examId,
      examScheduleId: examScheduleId,
      examLocationId: examLocationId,
    },
    body: requestBody,
    mediaType: "application/json",
  });
};

/**
 * @param examId
 * @param examScheduleId
 * @param examLocationId
 * @param requestBody
 * @returns ResponseData Success
 * @throws ApiError
 */
export const putRoomMapSchedule = (
  examId?: string,
  examScheduleId?: string,
  examLocationId?: string,
  examLocationRoomId?: string,
  requestBody?: Array<ExamLocationRoomMapScheduleModel>
): CancelablePromise<ResponseData> => {
  return __request({
    method: "PUT",
    path: END_POINT + `/examlocation/map`,
    query: {
      examId: examId,
      examScheduleId: examScheduleId,
      examLocationId: examLocationId,
      examLocationRoomId: examLocationRoomId,
    },
    body: requestBody,
    mediaType: "application/json",
  });
};