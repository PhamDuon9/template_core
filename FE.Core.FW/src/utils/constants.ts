// import { EmailTemplateType } from '@/apis/models/toefl-challenge/EmailTemplateType';
import { CheckboxOptionType } from "antd";
import { lazy } from 'react';

//#region Dùng để phân quyền
export const PermissionAction = {
  View: 1,
  ViewDetail: 2,
  Add: 4,
  Edit: 8,
  Delete: 16,
  Import: 32
}

export const permissionOptions: CheckboxOptionType[] = [
  {
    "label": "Xem",
    "value": PermissionAction.View
  },
  {
    "label": "Xem chi tiết",
    "value": PermissionAction.ViewDetail
  },
  {
    "label": "Thêm",
    "value": PermissionAction.Add
  },
  {
    "label": "Sửa",
    "value": PermissionAction.Edit
  },
  {
    "label": "Xóa",
    "value": PermissionAction.Delete
  },
  {
    "label": "Import",
    "value": PermissionAction.Import
  }
];
//#endregion

//#region Dùng để khai báo router sử dụng lazy(Phương án xử lý tạm thời)
export const layoutCode = {
  userManager: "userManager",
  user: "user",
  role: "role",
  permission: "permission",
  permissions: "permissions",
  tuieditor: "tuieditor",
  detail: "detail",
  complex: "complex",
  svg: "svg",
  component: "component",
  test: "test",
  form: "form",
  core: "core",
  basic: "basic",
  home: "home",
  resource: "resource",
  workplace: "workplace",
  navigations: "navigations",
  pages: "pages",
  // toeflChallenge: "TOEFL_CHALLENGE",
  // toeflChallengeDepartment: "toefl-challenge-department",
  // toeflChallengeDivision: "toefl-challenge-division",
  // toeflChallengeDivisionCreate: "toefl-challenge-division__create",
  // toeflChallengeDivisionEdit: "toefl-challenge-division__edit",
  // toeflChallengeSchool: "toefl-challenge-school",
  // toeflChallengeSchoolCreate: "toefl-challenge-school__create",
  // toeflChallengeSchoolEdit: "toefl-challenge-school__edit",
  // toeflChallengeCompetition: "toefl-challenge-competition",
  // toeflChallengeCompetitionCreate: "toefl-challenge-competition__create",
  // toeflChallengeCompetitionEdit: "toefl-challenge-competition__edit",
  // toeflChallengeTemplateEmail: "toefl-challenge-template-email",
  // toeflChallengeRegistration: "toefl-challenge-registration",
  // toeflChallengeRegistrationCreate: "toefl-challenge-registration__create",
  // toeflChallengeRegistrationEdit: "toefl-challenge-registration__edit",
  // toeflChallengeExamSchedule: "toefl-challenge-exam-schedule",
  // toeflChallengeExamScheduleCreate: "toefl-challenge-exam-schedule__create",
  // toeflChallengeExamScheduleEdit: "toefl-challenge-exam-schedule__edit",
  // toeflChallengeRegistrationCode: "toefl-challenge-registration-code",
  // toeflChallengeRegistrationCodeCreate: "toefl-challenge-registration-code__create",
  // toeflChallengeRegistrationCodeEdit: "toefl-challenge-registration-code__edit",
  catalog: "catalog",
  catalogAdministrativeUnit:"catalog-administrative-unit",
  catalogBranch: "catalog-branch",
  catalogDepartment: "catalog-department",
  // catalogProductCategory: "catalog-product-category",
  // catalogProductCategoryCreate: "catalog-product-category__create",
  // catalogProductCategoryEdit: "catalog-product-category__edit",
  // catalogProductType: "catalog-product-type",
  // catalogProductTypeCreate: "catalog-product-type__create",
  // catalogProductTypeEdit: "catalog-product-type__edit",
  // catalogProduct: "catalog-product",
  // catalogProductCreate: "catalog-product__create",
  // catalogProductEdit: "catalog-product__edit",
  catalogCustomerGroup: "catalog-customer-group",
  // catalogCustomerCategory: "catalog-customer-category",
  // catalogCustomerCategoryCreate: "catalog-customer-category__create",
  // catalogCustomerCategoryEdit: "catalog-customer-category__edit",
  catalogCustomerType: "catalog-customer-type",
  // catalogCustomerTypeCreate: "catalog-customer-type__create",
  // catalogCustomerTypeEdit: "catalog-customer-type__edit",
  catalogCustomer: "catalog-customer",
  catalogCustomerCreate: "catalog-customer__create",
  catalogCustomerEdit: "catalog-customer__edit",
}
export const routeArrays = [
  {
    "Code": layoutCode.userManager,
    "ComponentPath": lazy(() => import('../pages/CoreManager/UserManager'))
  },
  {
    "Code": layoutCode.user,
    "ComponentPath": lazy(() => import('../pages/roles/user'))
  },
  {
    "Code": layoutCode.role,
    "ComponentPath": lazy(() => import('../pages/roles/list'))
  },
  {
    "Code": layoutCode.permission,
    "ComponentPath": lazy(() => import('../pages/roles/permission'))
  },
  {
    "Code": layoutCode.permissions,
    "ComponentPath": ""
  },
  {
    "Code": layoutCode.tuieditor,
    "ComponentPath": lazy(() => import('../pages/component/editor/TuiEditor'))
  },
  {
    "Code": layoutCode.detail,
    "ComponentPath": lazy(() => import('../pages/pagesample/detail/basic'))
  },
  {
    "Code": layoutCode.complex,
    "ComponentPath": lazy(() => import('../pages/pagesample/form/complex'))
  },
  {
    "Code": layoutCode.svg,
    "ComponentPath": lazy(() => import('../pages/component/icon/svg'))
  },
  {
    "Code": layoutCode.component,
    "ComponentPath": ""
  },
  {
    "Code": layoutCode.test,
    "ComponentPath": lazy(() => import('../pages/roles/test'))
  },
  {
    "Code": layoutCode.form,
    "ComponentPath": ""
  },
  {
    "Code": layoutCode.core,
    "ComponentPath": ""
  },
  {
    "Code": layoutCode.basic,
    "ComponentPath": lazy(() => import('../pages/pagesample/form/basic'))
  },
  {
    "Code": layoutCode.home,
    "ComponentPath": ""
  },
  {
    "Code": layoutCode.resource,
    "ComponentPath": lazy(() => import('../pages/CoreManager/ResourceManager'))
  },
  {
    "Code": layoutCode.workplace,
    "ComponentPath": lazy(() => import('../pages/Home'))
  },
  {
    "Code": layoutCode.navigations,
    "ComponentPath": lazy(() => import('../pages/CoreManager/NavigationManager'))
  },
  {
    "Code": layoutCode.pages,
    "ComponentPath": ""
  },
  // {
  //   "Code": layoutCode.toeflChallenge,
  //   "ComponentPath": ""
  // },
  // {
  //   "Code": layoutCode.toeflChallengeDepartment,
  //   "ComponentPath": lazy(() => import('../pages/toefl_challenge/department'))
  // },
  // {
  //   "Code": layoutCode.toeflChallengeDivision,
  //   "ComponentPath": lazy(() => import('../pages/toefl_challenge/division'))
  // },
  // {
  //   "Code": layoutCode.toeflChallengeDivisionCreate,
  //   "ComponentPath": lazy(() => import('../pages/toefl_challenge/division/create'))
  // },
  // {
  //   "Code": layoutCode.toeflChallengeDivisionEdit,
  //   "ComponentPath": lazy(() => import('../pages/toefl_challenge/division/edit'))
  // },
  // {
  //   "Code": layoutCode.toeflChallengeSchool,
  //   "ComponentPath": lazy(() => import('../pages/toefl_challenge/school'))
  // },
  // {
  //   "Code": layoutCode.toeflChallengeSchoolCreate,
  //   "ComponentPath": lazy(() => import('../pages/toefl_challenge/school/create'))
  // },
  // {
  //   "Code": layoutCode.toeflChallengeSchoolEdit,
  //   "ComponentPath": lazy(() => import('../pages/toefl_challenge/school/edit'))
  // },
  // {
  //   "Code": layoutCode.toeflChallengeCompetition,
  //   "ComponentPath": lazy(() => import('../pages/toefl_challenge/competition'))
  // },
  // {
  //   "Code": layoutCode.toeflChallengeCompetitionCreate,
  //   "ComponentPath": lazy(() => import('../pages/toefl_challenge/competition/create'))
  // },
  // {
  //   "Code": layoutCode.toeflChallengeCompetitionEdit,
  //   "ComponentPath": lazy(() => import('../pages/toefl_challenge/competition/edit'))
  // },
  // {
  //   "Code": layoutCode.toeflChallengeTemplateEmail,
  //   "ComponentPath": lazy(() => import('../pages/toefl_challenge/template-email'))
  // },
  // {
  //   "Code": layoutCode.toeflChallengeRegistration,
  //   "ComponentPath": lazy(() => import('../pages/toefl_challenge/registration'))
  // },
  // {
  //   "Code": layoutCode.toeflChallengeRegistrationCreate,
  //   "ComponentPath": lazy(() => import('../pages/toefl_challenge/registration/create'))
  // },
  // {
  //   "Code": layoutCode.toeflChallengeRegistrationEdit,
  //   "ComponentPath": lazy(() => import('../pages/toefl_challenge/registration/edit'))
  // },
  // {
  //   "Code": layoutCode.toeflChallengeExamSchedule,
  //   "ComponentPath": lazy(() => import('../pages/toefl_challenge/exam-schedule'))
  // },
  // {
  //   "Code": layoutCode.toeflChallengeExamScheduleCreate,
  //   "ComponentPath": lazy(() => import('../pages/toefl_challenge/exam-schedule/create'))
  // },
  // {
  //   "Code": layoutCode.toeflChallengeExamScheduleEdit,
  //   "ComponentPath": lazy(() => import('../pages/toefl_challenge/exam-schedule/edit'))
  // },
  // {
  //   "Code": layoutCode.toeflChallengeRegistrationCode,
  //   "ComponentPath": lazy(() => import('../pages/toefl_challenge/registration-code'))
  // },
  // {
  //   "Code": layoutCode.toeflChallengeRegistrationCodeCreate,
  //   "ComponentPath": lazy(() => import('../pages/toefl_challenge/registration-code/create'))
  // },
  //catalog
  {
    "Code": layoutCode.catalog,
    "ComponentPath": ""
  },
  {
    "Code": layoutCode.catalogAdministrativeUnit,
    "ComponentPath": lazy(() => import('../pages/catalog/administrative-unit'))
  },
  {
    "Code": layoutCode.catalogBranch,
    "ComponentPath": lazy(() => import('../pages/catalog/branch'))
  },
  // {
  //   "Code": layoutCode.catalogBranchCreate,
  //   "ComponentPath": lazy(() => import('../pages/catalog/branch/create'))
  // },
  // {
  //   "Code": layoutCode.catalogBranchEdit,
  //   "ComponentPath": lazy(() => import('../pages/catalog/branch/edit'))
  // },
  {
    "Code": layoutCode.catalogDepartment,
    "ComponentPath": lazy(() => import('../pages/catalog/department'))
  },
  // {
  //   "Code": layoutCode.catalogDepartmentCreate,
  //   "ComponentPath": lazy(() => import('../pages/catalog/department/create'))
  // },
  // {
  //   "Code": layoutCode.catalogDepartmentEdit,
  //   "ComponentPath": lazy(() => import('../pages/catalog/department/edit'))
  // },
  // {
  //   "Code": layoutCode.catalogProductCategory,
  //   "ComponentPath": lazy(() => import('../pages/catalog/product-category'))
  // },
  // {
  //   "Code": layoutCode.catalogProductCategoryCreate,
  //   "ComponentPath": lazy(() => import('../pages/catalog/product-category/create'))
  // },
  // {
  //   "Code": layoutCode.catalogProductCategoryEdit,
  //   "ComponentPath": lazy(() => import('../pages/catalog/product-category/edit'))
  // },
  // {
  //   "Code": layoutCode.catalogProductType,
  //   "ComponentPath": lazy(() => import('../pages/catalog/product-type'))
  // },
  // {
  //   "Code": layoutCode.catalogProductTypeCreate,
  //   "ComponentPath": lazy(() => import('../pages/catalog/product-type/create'))
  // },
  // {
  //   "Code": layoutCode.catalogProductTypeEdit,
  //   "ComponentPath": lazy(() => import('../pages/catalog/product-type/edit'))
  // },
  // {
  //   "Code": layoutCode.catalogProduct,
  //   "ComponentPath": lazy(() => import('../pages/catalog/product'))
  // },
  // {
  //   "Code": layoutCode.catalogProductCreate,
  //   "ComponentPath": lazy(() => import('../pages/catalog/product/create'))
  // },
  // {
  //   "Code": layoutCode.catalogProductEdit,
  //   "ComponentPath": lazy(() => import('../pages/catalog/product/edit'))
  // },
  {
    "Code": layoutCode.catalogCustomerGroup,
    "ComponentPath": lazy(() => import('../pages/catalog/customer-group'))
  },
  // {
  //   "Code": layoutCode.catalogCustomerCategory,
  //   "ComponentPath": lazy(() => import('../pages/catalog/customer-category'))
  // },
  // {
  //   "Code": layoutCode.catalogCustomerCategoryCreate,
  //   "ComponentPath": lazy(() => import('../pages/catalog/customer-category/create'))
  // },
  // {
  //   "Code": layoutCode.catalogCustomerCategoryEdit,
  //   "ComponentPath": lazy(() => import('../pages/catalog/customer-category/edit'))
  // },
  {
    "Code": layoutCode.catalogCustomerType,
    "ComponentPath": lazy(() => import('../pages/catalog/customer-type'))
  },
  // {
  //   "Code": layoutCode.catalogCustomerTypeCreate,
  //   "ComponentPath": lazy(() => import('../pages/catalog/customer-type/create'))
  // },
  // {
  //   "Code": layoutCode.catalogCustomerTypeEdit,
  //   "ComponentPath": lazy(() => import('../pages/catalog/customer-type/edit'))
  // },
  {
    "Code": layoutCode.catalogCustomer,
    "ComponentPath": lazy(() => import('../pages/catalog/customer'))
  },
  {
    "Code": layoutCode.catalogCustomerCreate,
    "ComponentPath": lazy(() => import('../pages/catalog/customer/create'))
  },
  {
    "Code": layoutCode.catalogCustomerEdit,
    "ComponentPath": lazy(() => import('../pages/catalog/customer/edit'))
  },
]
//#endregion


export const errorMessage: Map<string, string> = new Map([
  ['incorrectFormat', 'Chỉ nhập ký tự chữ, số, " - " hoặc "_"'],
  ['required', 'Không được để trống']
]);

export const patternValidate: Map<string, RegExp> = new Map([
  ['code', /^[a-zA-Z0-9-_]+$/g]
]);
