/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PICModel } from "./PICModel";

export type DepartmentModel = {
  id?: string | null;
  provinceId?: string;
  provinceName?: string | null;
  name?: string | null;
  address?: string | null;
  email?: string | null;
  tel?: string | null;
  piCs?: Array<PICModel> | null;
};

