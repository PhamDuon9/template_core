import { BlacklistTopikModel } from "./BlacklistTopikModel";
import { ExamPeriodModel } from "./ExamPeriodModel";
import { ImportStockProposalModel } from "./ImportStockProposalModel";
import { ImportStockReceiptModel } from "./ImportStockReceiptModel";

export interface UserInfoDataType {
  name: string;
  tel: string;
  courier: string;
  address: string;
  remark: string;
}

export interface RefundApplicationDataType {
  ladingNo: string;
  saleNo: string;
  state: string;
  childOrders: string;
}

export interface ReturnGoodsDataType {
  id: string;
  name?: string;
  barcode?: string;
  price?: string;
  num?: string | number;
  amount?: string | number;
}

export interface ReturnProgressDataType {
  key: string;
  time: string;
  rate: string;
  status: string;
  operator: string;
  cost: string;
}

export interface DetailDataType {
  userInfo: UserInfoDataType;
  refundApplication: RefundApplicationDataType;
  returnGoods: ReturnGoodsDataType[];
  returnProgress: ReturnProgressDataType[];
}

export interface ChartDataType {
  day: string[];
  num: number[];
}

export interface WorksChartDataType {
  total: number;
  num: number;
  chart: ChartDataType;
}

export interface TableListQueryParams {
  page: number;
  per: number;
  sort?: number;
}

export interface PaginationConfig {
  total: number;
  current: number;
  pageSize: number;
  showSizeChanger: boolean;
}
export interface ChartDataType {
  day: string[];
  num: number[];
}

export interface TopicsChartDataType {
  total: number;
  num: number;
  chart: ChartDataType;
}
export interface ChartDataType {
  day: string[];
  num: number[];
}

export interface ArticleChartDataType {
  total: number;
  num: number;
  week: number;
  day: number;
}

export interface ChartDataType {
  day: string[];
  num: number[];
}

export interface LinksChartDataType {
  total: number;
  num: number;
  chart: ChartDataType;
}

export interface ChartDataType {
  day: string[];
  num: number[];
}

export interface TopicsChartDataType {
  total: number;
  num: number;
  chart: ChartDataType;
}

export interface TableListItem {
  name: string;
  hit: number;
}
export interface FormDataType {
  title: string;
  date: string[];
  select: string;
  radio1: string;
  radio2: string;
  checkbox: string[];
  remark: string;
  users?: TableFormDataType[];
}

export interface SelectOptionModel {
  value: string | number | undefined;
  label: string;
  title?: string;
  key: string;
  parrentId?: string;
}

export interface SelectStatusOption {
  value: number;
  label: string;
  key: string;
  parrentId?: string;
}

export interface OptionModel {
  id: string;
  name: string;
}


export type HeadQuarterModel = {
  id?: string;
  areaId: string;
  area: AreaModel;
  name: string;
  code: string;
  address: string;
  note?: string | null;
  canRegisterExam?: boolean;
  acceptTest?: boolean;
  isShow?: boolean;
  isTopik?: boolean;
};

export type ExamModel = {
  id?: string;
  code: string;
  name: string;
  examTypeId?: string | null;
  examCategoryId: string;
  note?: string | null;
  order?: number;
  isShow?: boolean;
  canRegister?: boolean;
  price?: number | null;
  maxVersionCanRegister?: number | null;
  examVersion?: Array<ExamVersionModel> | null;
  examForm?: string;
  haveMultiVersion?: boolean;
};

export type ExamVersionModel = {
  id?: string;
  name: string;
  note?: string | null;
  order?: number;
  isShow?: boolean;
  language?: Array<string> | null;
  examId: string;
};

export type ServiceAlongExamModel = {
  id?: string;
  name?: string | null;
  price?: number;
  order?: number;
  note?: string | null;
  isShow?: boolean;
};

export type ExamWorkShiftModel = {
  id?: string;
  name?: string | null;
  note?: string | null;
  order?: number;
  isShow?: boolean;
};

export type ExamRoomModel = {
  id?: string;
  name: string;
  code: string;
  headQuarterId: string;
  maxAcceptNumber: number;
  acceptanceLimit: number;
  note?: string | null;
  order?: number;
  isShow?: boolean;
  colorCode?: string | null;
};

export type AreaModel = {
  id?: string;
  name?: string | null;
  code?: string | null;
  note?: string | null;
  order?: number;
  isShow?: boolean;
  isTopik?: boolean
};

export type PostAuthWso2 = {
  grant_type?: string;
  redirect_uri?: string | null;
  code?: string | null;
};

export type ResAuthWso2 = {
  access_token: string;
  expires_in: string;
  id_token: string;
  refresh_token: string
};

export type ProfileCatalogModel = {
  id?: string;
  name?: string | null;
  note?: string | null;
  order?: number;
  isShow?: boolean;
};

export type ProvinceModel = {
  id: string;
  code: string | null;
  name: string;
  name_En?: string | null;
  level?: number;
};

export type DistrictModel = {
  id?: string;
  code?: string | null;
  name?: string | null;
  name_En?: string | null;
  level?: number;
  provinceId?: string;
};

export type WardModel = {
  id?: string;
  code?: string | null;
  name?: string | null;
  name_En?: string | null;
  level?: number;
  provinceId?: string;
  districtId?: string;
};

export interface WSO2ResponseModel {
  access_token: string;
  scope: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}

export type SearchParam = {
  FirstName?: string | null;
  LastName?: string | null;
  dob?: string | null;
  IdOrPassport?: string | null;
}

export type FormCode = {
  formCode: string
}

export interface ExportFileModel {
  fileName: string;
  scope: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}

export type CountryModel = {
  id?: string;
  code?: string | null;
  englishName?: string | null;
  koreanName?: string | null;
};

export type LanguageModel = {
  id?: string | null;
  code?: string | null;
  englishName?: string | null;
  koreanName?: string | null;
};

export type ImportStockProposalResponse = ImportStockProposalModel & {
  id: string;
  code: string;
  fileImportSavedPath?: string;
  status: number;
  dateSendForApprove?: Date;
  userApprove?: string;
  dateApprove?: string;
  reasonReject?: string;
}

export type ApproveProposalModel = {
  id?: string;
  isApprove?: boolean;
  reasonReject?: string;
};

export type ImportStockReceiptResponse = ImportStockReceiptModel & {
  id: string;
  code: string;
  fileImportSavedPath?: string;
  status: number;
  dateSendForApprove?: Date;
  userApprove?: string;
  dateApprove?: string;
  reasonReject?: string;
}

export type ApproveReceiptModel = {
  id?: string;
  isApprove?: boolean;
  reasonReject?: string;
};

export interface ExamPeriodResponse extends ExamPeriodModel {
  id: string;
  createdByUserId: string | null;
  createdOnDate: Date
}

export interface BlacklistTopikResponse extends BlacklistTopikModel {
  id: string;
  createdByUserId: string | null;
  createdOnDate: Date
}

export type ExamTypeModel = {
  id: string;
  name: string;
  isShow?: boolean;
}

export type ExamAPModel = {
  examId: string;
  name: string;
  code: string;
  examWorkshift: string;
  dateTest: string;
  timeTest: string;
  price: number;
  stt: number;
};

export type UpdateManageRegisteredCandidateAPAdminModel = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  parentPhone: string;
  email: string;
  birthday: string;
  typeIDCard: string;
  idCardNumber: string;
  sex: string;
  sbd: string;
  school: string;
  class: string;
  examName: string;
  examPeriodName: string;
  examInfo: ExamAPModel[];
  createdOnDate: string;
  price: string;
  isChangeUserInfo: boolean;
};

export type DecisionBlacklistShowListModel = {
  id?: string;
  fullName?: string | null;
  dateOfBirth?: string;
  idNumberCard?: string | null;
  typeIdCard?: number;
  blacklistId?: string;
  decisionNumber?: string | null;
  decisionDate?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  reason?: string | null;
  formProcess?: number | null;
  examIdBan?: string | null;
  dateApprove?: string | null;
  createdBy?: string | null;
  approveBy?: string | null;
  note?: string | null;
  status?: number | null;
  filePath?: string | null;
  createdOnDate?: string | null;
};

export type ExamTestInfoModel = {
  examName?: string;
  examVersion?: string;
  language?: string | null;
  examTime?: number;
  address?: boolean;
};

export type ManageRegisteredCandidateITModel = {
  id?: string;
  fullName?: string;
  phone?: string | null;
  studentCode?: string;
  examName?: string;
  statusWarning?: number;
  createdOnDate?: string | null;
  price?: number;
};


export type ManageRegisteredUpdateCandidateITModel = {
  id?: string;
  examPurpose?: string;
  testDate?: string;
  scoreGoal?: string;
  isTested?: boolean;
  examName?: string;
  createdOnDate?: string | null;
  statusWarning?: number;
  price?: number;
  userInfoITModel?: UserInfoITModel;
  examTestInfo?: Array<ExamTestInfo>;
  examVersions?: Array<ExamVersionModel>;
};

export type ExamTestInfo = {
  examName?: string | null;
  examVersion?: string | null;
  examVersionId?: string | null;
  language?: string | null;
  examTime?: string | null;
  address?: string | null;
}

export type UserInfoITModel = {
  userName?: string | null;
  fullName?: string | null;
  koreanName?: string | null;
  idNumber?: string | null;
  typeIdCard?: string | null;
  birthday?: string | null;
  dobString?: string | null;
  sex?: string | null;
  passport?: string | null;
  dateOfCCCD?: string | null;
  dateOfCCCDString?: string | null;
  placeOfCCCD?: string | null;
  phone?: string | null;
  email?: string | null;
  job?: string | null;
  optionJob?: string | null;
  isStudent?: boolean | null;
  studentCode?: string | null;
  workAddressCityId?: string | null;
  workAddressDistrictId?: string | null;
  workAddressWardsId?: string | null;
  workAddress?: string | null;
  contactAddressCityId?: string | null;
  contactAddressCityName?: string | null;
  contactAddressDistrictId?: string | null;
  contactAddressDistrictName?: string | null;
  contactAddressWardId?: string | null;
  contactAddressWardsName?: string | null;
  contactAddress?: string | null;
  idCardFront?: string | null;
  idCardFrontFile?: Blob | null;
  idCardBackFile?: Blob | null;
  idCardBack?: string | null;
  image3x4File?: Blob | null;
  image3x4?: string | null;
  studentCardImageFile?: Blob | null;
  studentCardImage?: string | null;
  schoolCertificate?: string | null;
  birthCertificateFile?: Blob | null;
  birthCertificate?: string | null;
  isStudent?: boolean;
  isDisabilities?: boolean;
  languageName?: string | null;
  countryCode?: string | null;
  languageCode?: string | null;
};

export interface TableFormDataType {
  key: string;
  examName?: string;
  examVersion?: string;
  examVersionId?: string;
  language?: string;
  timeTest?: string;
  address?: string;
  edit?: boolean;
  isNew?: boolean;
}