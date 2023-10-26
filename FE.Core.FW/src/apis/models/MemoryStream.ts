/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type MemoryStream = {
  readonly canTimeout?: boolean;
  readTimeout?: number;
  writeTimeout?: number;
  readonly canRead?: boolean;
  readonly canSeek?: boolean;
  readonly canWrite?: boolean;
  capacity?: number;
  readonly length?: number;
  position?: number;
};

