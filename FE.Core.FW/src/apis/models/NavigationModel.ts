/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type NavigationModel = {
  id?: string;
  parentId?: string | null;
  code?: string | null;
  name?: string | null;
  url?: string | null;
  iconClass?: string | null;
  order?: number;
  resource?: string | null;
  componentPath?: string | null;
  children?: Array<NavigationModel> | null;
  isShow?: boolean
};

export type NavigationModelCustom = {
  key?: string;
  parentId?: string | null;
  code?: string | null;
  name?: string | null;
  url?: string | null;
  isShow?: boolean;
  iconClass?: string | null;
  order?: number;
  resource?: string | null;
  componentPath?: string | null;
  children?: NavigationModelCustom[] | null;
};
