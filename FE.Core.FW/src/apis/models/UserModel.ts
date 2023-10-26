/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PolicyModel } from "./PolicyModel";
import type { UserMetadataModel } from "./UserMetadataModel";

export type UserModel = {
  id?: string;
  username?: string | null;
  fullname?: string | null;
  email?: string | null;
  dob?: string | null;
  phone?: string | null;
  syncId?: string;
  isLocked?: boolean;
  roleId?: string | null;
  roleName?: string | null;
  departmentId?: string | null;
  departmentName?: string | null;
  employeeAccessLevels?: string | null;
  isAccessMaxLevel?: boolean;
  password?: string | null;
  metadata?: Array<UserMetadataModel> | null;
  permissions?: Array<PolicyModel> | null;
  createdOnDate?: string;
  employeeAccessLevelArray?: Array<string> | null;
  accessDataHeaderQuater?: Array<string> | null;
};

