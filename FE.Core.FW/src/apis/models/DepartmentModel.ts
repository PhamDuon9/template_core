/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type DepartmentModel = {
  id?: string;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  parentId?: string | null;
  parentName?: string | null;
  branchId?: string | null;
  branchName?: string | null;
  isCom?: boolean;
  createdByUserId?: string;
  lastModifiedByUserId?: string;
  lastModifiedOnDate?: string;
  createdOnDate?: string;
};

