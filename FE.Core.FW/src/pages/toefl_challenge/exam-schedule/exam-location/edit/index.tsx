import { Code } from '@/apis';
import { ExamLocationModel } from '@/apis/models/toefl-challenge/ExamLocationModel';
import { ExamLocationScheduleModel } from '@/apis/models/toefl-challenge/ExamLocationScheduleModel';
import { ExamScheduleModel } from '@/apis/models/toefl-challenge/ExamScheduleModel';
import { putExamLocation1, upSertExamLocationSchedule } from '@/apis/services/toefl-challenge/ExamLocationService';
import { examLocationScheduleState } from '@/store/exam-atom';
import { Modal, Tabs, TabsProps, message } from 'antd';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import EditExamLocationInfor from './edit-exam-location';
import ExamLocationSchedule from './exam-location-schedule-edit';
import { SelectOptionModel } from '@/@types/data';
interface Props {
    open: boolean;
    examSchedule: ExamScheduleModel;
    examLocationId: string;
    setOpen: (value: boolean) => void;
    provinces: SelectOptionModel[];
    districtInits: SelectOptionModel[];
    reload: (current: number, pageSize: number) => void;
    recordEdit: ExamLocationModel
}
const ExamLocationEditTFC: React.FC<Props> = ({ open, setOpen, reload, examSchedule, provinces, districtInits, recordEdit, examLocationId }) => {
    // const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalButtonOkText, setModalButtonOkText] = useState('Lưu');
    const [examLocationSchedules, setExamLocationSchedules] = useRecoilState<ExamLocationScheduleModel[]>(examLocationScheduleState);

    const handleOk = async (value: any) => {
        // const fieldsValue = await searchForm.validateFields();
        // const fieldsValue = await formRef?.current?.validateFields();
        setModalButtonOkText('Đang xử lý...');
        setConfirmLoading(true);

        const examLocation = {
            ...value,
            ExamId: examSchedule.examId,
            ExamScheduleId: examSchedule.id,
        }

        // console.log(examLocation, examLocationScheduleObjs)
        // return
        const response = await putExamLocation1(recordEdit.id, examLocation);
        setModalButtonOkText('Lưu');
        setConfirmLoading(false);
        setOpen(false);
        if (response.code === Code._200) {
            const examLocationScheduleObjs: ExamLocationScheduleModel[] = examLocationSchedules.map((item: ExamLocationScheduleModel, idx: number) => {
                return {
                    ...item,
                    examLocationId: recordEdit.id,
                    examId: examSchedule.examId,
                    examScheduleId: examSchedule.id,
                    order: idx
                }
            }) as ExamLocationScheduleModel[];
            const responseExamLocationSchedule = await upSertExamLocationSchedule(recordEdit.id as string, examLocationScheduleObjs);
            if (responseExamLocationSchedule.code === Code._200) {
                message.success(response.message || "Thành công")
                setModalButtonOkText('Lưu');
                setConfirmLoading(false);
                setOpen(false);
                reload(1, 20)
            }
            else {
                message.error(response.message || "Thất bại")
                setModalButtonOkText('Lưu');
                setConfirmLoading(false);
                setOpen(false);
            }
        }
        else {
            message.error(response.message || "Thất bại")
        }


    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        // formRef.current?.resetFields()
        setOpen(false);
    };

    const itemTabs: TabsProps['items'] = [
        {
            key: '1',
            label: `Địa điểm thi`,
            children: <EditExamLocationInfor recordEdit={recordEdit}
                handleOk={handleOk}
                provinces={provinces}
                districtInits={districtInits}
            />,
        },
        {
            key: '2',
            label: `Ca thi`,
            children: <ExamLocationSchedule examSchedule={examSchedule}
                examLocationId={examLocationId}
            />,
        },
    ];

    return (
        <>
            <Modal title="Cập nhật địa điểm thi" open={open} okText={modalButtonOkText} cancelText="Bỏ qua" width={860}
                           /* onOk={onSubmit}*/ style={{ top: 20 }} onCancel={handleCancel}
                confirmLoading={confirmLoading}
                okButtonProps={{ form: 'myFormEdit1', htmlType: 'submit' }}
            >
                <Tabs
                    defaultActiveKey="1"
                    tabPosition={"top"}
                    type="line"
                    style={{ minHeight: 220 }}
                    items={itemTabs}
                />
            </Modal>
        </>
    );
}

export default ExamLocationEditTFC;