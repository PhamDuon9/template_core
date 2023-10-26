/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PICType } from "./PICType";

export type PICModel = {
  id?: string;
  objectId?: string;
  picType?: PICType;
  name?: string | null;
  jobTitle?: string | null;
  tel?: string | null;
  email?: string | null;
};

