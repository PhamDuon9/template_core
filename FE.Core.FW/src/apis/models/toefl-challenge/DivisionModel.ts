/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PICModel } from "./PICModel";

export type DivisionModel = {
  id?: string;
  departmentId?: string;
  provinceId?: string;
  districtId?: string;
  departmentName?: string | null;
  provinceName?: string | null;
  districtName?: string | null;
  name?: string | null;
  address?: string | null;
  email?: string | null;
  tel?: string | null;
  piCs?: Array<PICModel> | null;
};

