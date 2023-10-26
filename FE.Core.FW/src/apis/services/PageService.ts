import mockjs from 'mockjs';
import { CancelablePromise } from '../core/CancelablePromise';
import {
  request,
  useRequest,
  UseRequestOption,
} from "../core/request";
import { ResponseData } from '../models/ResponseData';
import { FormDataType, PostAuthWso2, TableListQueryParams } from '@/@types/data';

export async function createData(params?: FormDataType): Promise<any> {
  return;
}

export async function queryDetail(): Promise<any> {
  return;
}

export async function hotSearchQueryList(params?: TableListQueryParams): Promise<any> {
  return {
    code: 0,
    data: mockjs.mock({
      total: 1000,
      currentPage: 1,
      'list|5': [
        {
          name: '@word(1,20)',
          hit: '@integer(1000,10000)',
        },
      ],
    }),
  };
}

export async function hotTagsQueryList(params?: TableListQueryParams): Promise<any> {
  return {
    code: 0,
    data: mockjs.mock({
      total: 1000,
      currentPage: 1,
      'list|5': [
        {
          name: '@ctitle(4,6)',
          id: '@integer(1)',
          pinyin: '@word(10,20)',
          hit: '@integer(1000,10000)',
        },
      ],
    }),
  };
}

export async function articleHitQueryList(params?: TableListQueryParams): Promise<any> {
  return {
    code: 0,
    data: mockjs.mock({
      total: 1000,
      currentPage: 1,
      'list|5': [
        {
          category: {
            id: '@integer(1)',
            alias: '@word(4)',
            name: '@cword(4)',
          },
          title: '@ctitle(20,30)',
          id: '@integer(1)',
          addtime: '@datetime',
          'tag|0-3': '@ctitle(4,6),',
          hit: '@integer(100,1000)',
        },
      ],
    }),
  };
}

export async function worksHitQueryList(params?: TableListQueryParams): Promise<any> {
  return {
    code: 0,
    data: mockjs.mock({
      total: 1000,
      currentPage: 1,
      'list|5': [
        {
          title: '@ctitle(20,30)',
          id: '@integer(1)',
          addtime: '@datetime',
          'tag|0-3': '@ctitle(4,6),',
          hit: '@integer(100,1000)',
        },
      ],
    }),
  };
}

export async function dailynewArticles(): Promise<any> {
  return {
    code: 0,
    data: {
      total: mockjs.mock('@integer(1000,10000)'),
      num: mockjs.mock('@integer(10,100)'),
      day: mockjs.mock('@float(-10,15,0,2)'),
      week: mockjs.mock('@float(-10,15,0,2)'),
    },
  };
}

export async function annualnewLinks(): Promise<any> {
  return {
    code: 0,
    data: {
      total: mockjs.mock('@integer(1000,10000)'),
      num: mockjs.mock('@integer(10,100)'),
      chart: mockjs.mock({
        'day|12': ['2019-03'],
        'num|12': ['@integer(0,8)'],
      }),
    },
  };
}

export async function monthnewTopics(): Promise<any> {
  return {
    code: 0,
    data: {
      total: mockjs.mock('@integer(1000,10000)'),
      num: mockjs.mock('@integer(10,100)'),
      chart: mockjs.mock({
        'day|30': ['03-01'],
        'num|30': ['@integer(0,2)'],
      }),
    },
  };
}

export async function weeknewWorks(): Promise<any> {
  return {
    code: 0,
    data: {
      total: mockjs.mock('@integer(1000,10000)'),
      num: mockjs.mock('@integer(10,100)'),
      chart: mockjs.mock({
        'day|7': ['03-01'],
        'num|7': ['@integer(0,3)'],
      }),
    },
  };
}
export async function queryCurrent(): Promise<any> {
  return { "code": 0, "data": { "id": 1, "name": "Admins", "avatar": "", "roles": ["admin"] } };
}

export async function queryMessage(): Promise<any> {
  return { "code": 0, "data": 19 };
}

export const getStatusAuth = (): CancelablePromise<ResponseData> => {
  return request({
    method: "GET",
    path: import.meta.env.VITE_HOST_WSO2 + 't/b2c.iigvietnam.edu.vn/oauth2/userinfo?schema=openid',
  });
};

export const getTokenWSO2 = (
  requestBody?: PostAuthWso2
): CancelablePromise<ResponseData> => {
  return request({
    method: "POST",
    path: import.meta.env.VITE_HOST_WSO2 + 't/b2c.iigvietnam.edu.vn/oauth2/token',
    body: requestBody,
    mediaType: 'application/json',
  });
};


export const getHeadQuarter = (
  areaId?: string,
  isTopik?: boolean,
  isOpen?: boolean
): CancelablePromise<ResponseData> => {
  return request({
    method: "GET",
    path: import.meta.env.VITE_BASE_CATALOG + 'HeadQuarter',
    query: {
      AreaId: areaId,
      IsTopik: isTopik,
      IsOpen: isOpen
    },
  });
};
export const getExam = (
  isOpen?: boolean,
  isTopik?: boolean,
  tenant?: string
): CancelablePromise<ResponseData> => {
  return request({
    method: "GET",
    path: import.meta.env.VITE_BASE_CATALOG + 'Exam',
    headers: {
      Tenant: tenant,
    },
    query: {
      isOpen: isOpen,
      isTopik: isTopik,
    },
  });
};

export const getExamVersion = (
  name?: string
): CancelablePromise<ResponseData> => {
  return request({
    method: "GET",
    path: import.meta.env.VITE_BASE_CATALOG + 'ExamVersion',
    query: {
      Name: name,
    },
  });
};

export const getExamVersionByExamId = (
  id: string
): CancelablePromise<ResponseData> => {
  return request({
    method: "GET",
    path: import.meta.env.VITE_BASE_CATALOG + `ExamVersion/GetByExamId/${id}`,
  });
};

export const getServiceAlongExam = (): CancelablePromise<ResponseData> => {
  return request({
    method: "GET",
    path: import.meta.env.VITE_BASE_CATALOG + `ServiceAlongExam`,
  });
};

export const getExamWorkShift = (): CancelablePromise<ResponseData> => {
  return request({
    method: "GET",
    path: import.meta.env.VITE_BASE_CATALOG + `ExamWorkShift`,
  });
};

export const getExamRoom = (
  name?: string,
  areaId?: string,
  headQuarterId?: string,
  tenant?: string
): CancelablePromise<ResponseData> => {
  return request({
    method: "GET",
    path: import.meta.env.VITE_BASE_CATALOG + `ExamRoom`,
    headers: {
      Tenant: tenant,
    },
    query: {
      Name: name,
      AreaId: areaId,
      HeadQuarterId: headQuarterId,
    },
  });
};


export const getArea = (
  topik?: boolean,
  getOpen?: boolean,
  tenant?: string
): CancelablePromise<ResponseData> => {
  return request({
    method: "GET",
    path: import.meta.env.VITE_BASE_CATALOG + `Area`,
    headers: {
      Tenant: tenant,
    },
    query: {
      topik: topik,
      getOpen: getOpen,
    },
  });
};

export const getProvince = (): CancelablePromise<ResponseData> => {
  return request({
    method: "GET",
    path: import.meta.env.VITE_BASE_CATALOG + `Province`,
  });
};

export const getWard = (): CancelablePromise<ResponseData> => {
  return request({
    method: "GET",
    path: import.meta.env.VITE_BASE_CATALOG + `Ward`,
  });
};

export const getDistrict = (): CancelablePromise<ResponseData> => {
  return request({
    method: "GET",
    path: import.meta.env.VITE_BASE_CATALOG + `District`,
  });
};

export const getDistrictByProvince = (
  provinceId: string
): CancelablePromise<ResponseData> => {
  return request({
    method: "GET",
    path: import.meta.env.VITE_BASE_CATALOG + `District/province/${provinceId}`,
  });
};

export const getWardByDistrict = (
  districtId: string
): CancelablePromise<ResponseData> => {
  return request({
    method: "GET",
    path: import.meta.env.VITE_BASE_CATALOG + `Ward/district/${districtId}`,
  });
};

export const getWardById = (id: string): CancelablePromise<ResponseData> => {
  return request({
    method: "GET",
    path: import.meta.env.VITE_BASE_CATALOG + `Ward/${id}`,
  });
};

export const getDistrictById = (id: string): CancelablePromise<ResponseData> => {
  return request({
    method: "GET",
    path: import.meta.env.VITE_BASE_CATALOG + `District/${id}`,
  });
};

export const getCountries = (): CancelablePromise<ResponseData> => {
  return request({
    method: "GET",
    path: import.meta.env.VITE_BASE_CATALOG + `Countries`,
  });
};

export const getLanguage = (): CancelablePromise<ResponseData> => {
  return request({
    method: "GET",
    path: import.meta.env.VITE_BASE_CATALOG + `Language`,
  });
};

export const getPriorityObject = (
  examId?: string
): CancelablePromise<ResponseData> => {
  return request({
    method: "GET",
    path: import.meta.env.VITE_BASE_CATALOG + `PriorityObject`,
    query: {
      ExamId: examId,
    },
  });
};

export const getExamType = (
  examId?: string
): CancelablePromise<ResponseData> => {
  return request({
    method: "GET",
    path: import.meta.env.VITE_BASE_CATALOG + `ExamType`,
  });
};
