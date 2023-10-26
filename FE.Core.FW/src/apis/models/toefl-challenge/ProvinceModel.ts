/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DistrictModel } from "./DistrictModel";
import type { ProvinceType } from "./ProvinceType";

export type ProvinceModel = {
  id?: string;
  code?: string | null;
  name?: string | null;
  type?: ProvinceType;
  districts?: Array<DistrictModel> | null;
};

