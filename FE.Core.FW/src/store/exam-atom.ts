import { atom, selector } from 'recoil';
import { ExamRegistrationScheduleModel } from '../apis/models/toefl-challenge/ExamRegistrationScheduleModel';
import { ExamRegistrationProvinceModel } from '@/apis/models/toefl-challenge/ExamRegistrationProvinceModel';
import { ExamLocationScheduleModel } from '@/apis/models/toefl-challenge/ExamLocationScheduleModel';
import { ExamLocationRoomMapScheduleModel } from '@/apis/models/toefl-challenge/ExamLocationRoomMapScheduleModel';


export const initialExamRegistrationScheduleState: ExamRegistrationScheduleModel[] = []
export const initialExamPaymentState: ExamRegistrationScheduleModel[] = []
export const initialExamRegistrationProvinceState: ExamRegistrationProvinceModel[] = []
export const initialExamLocationScheduleProvinceState: ExamLocationScheduleModel[] = []
export const initialExamLocationRoomMapScheduleProvinceState: ExamLocationRoomMapScheduleModel[] = []
export const initialExamLocationMapScheduleProvinceState: ExamLocationScheduleModel[] = []

//#region vòng thi
export const examRegistrationScheduleState = atom({
  key: 'examRegistrationScheduleState',
  default: initialExamRegistrationScheduleState,
});
//#endregion
//#region giá bài thi
export const examPaymentState = atom({
  key: 'examPaymentState',
  default: initialExamPaymentState,
});
//#endregion

//#region tỉnh được đăng ký
export const examRegistrationProvinceState = atom({
  key: 'examRegistrationProvinceState',
  default: initialExamRegistrationProvinceState,
});
//#endregion

//#region ca thi theo địa điểm
export const examLocationScheduleState = atom({
  key: 'examLocationScheduleState',
  default: initialExamLocationScheduleProvinceState,
});
//#endregion

//#region ca thi theo phòng thi
export const examLocationRoomMapScheduleState = atom({
  key: 'examLocationRoomMapScheduleState',
  default: initialExamLocationRoomMapScheduleProvinceState,
});
//#endregion

//#region danh sách ca thi khi thay đổi địa điểm thi
export const examLocationMapScheduleState = atom({
  key: 'examLocationMapScheduleState',
  default: initialExamLocationMapScheduleProvinceState,
});
//#endregion



