import { Code } from '@/apis';
import { ExamLocationScheduleModel } from '@/apis/models/toefl-challenge/ExamLocationScheduleModel';
import { ExamScheduleModel } from '@/apis/models/toefl-challenge/ExamScheduleModel';
import { RegistrationExamType } from '@/apis/models/toefl-challenge/RegistrationExamType';
import { RegistrationRound } from '@/apis/models/toefl-challenge/RegistrationRound';
import { postExamLocation, upSertExamLocationSchedule } from '@/apis/services/toefl-challenge/ExamLocationService';
import { examLocationScheduleState } from '@/store/exam-atom';
import { Modal, Tabs, TabsProps, message } from 'antd';
import React, { useReducer, useState } from 'react';
import { useRecoilState } from 'recoil';
import CreateExamLocationInfor from './create-exam-location';
import ExamLocationSchedule from './exam-location-schedule-create';
import { SelectOptionModel } from '@/@types/data';
interface Props {
    open: boolean;
    examSchedule: ExamScheduleModel;
    setOpen: (value: boolean) => void;
    provinces: SelectOptionModel[];
    reload: (current: number, pageSize: number) => void;
}
const ExamLocationCreateTFC: React.FC<Props> = ({ open, setOpen, reload, examSchedule, provinces }) => {
    // const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalButtonOkText, setModalButtonOkText] = useState('Lưu');
    const [examLocationSchedules, setExamLocationSchedules] = useRecoilState<ExamLocationScheduleModel[]>(examLocationScheduleState);
    const initState = {
        districts: [
            {
                key: 'Default',
                label: '-Chọn-',
                value: '',
            },
        ],
        registrationRounds: [
            {
                key: 'Default',
                label: '-Chọn-',
                value: '',
            },
            {
                key: RegistrationRound._1,
                label: 'Vòng 1',
                value: RegistrationRound._1,
            },
            {
                key: RegistrationRound._2,
                label: 'Vòng 2',
                value: RegistrationRound._2,
            },
            {
                key: RegistrationRound._3,
                label: 'Vòng 3',
                value: RegistrationRound._3,
            },
        ],
        registrationExamTypes: [
            {
                key: 'Default',
                label: '-Chọn-',
                value: '',
            },
            {
                key: RegistrationExamType._1,
                label: 'TOEFL Primary',
                value: RegistrationExamType._1,
            },
            {
                key: RegistrationExamType._2,
                label: 'TOEFL Junior',
                value: RegistrationExamType._2,
            },
            {
                key: RegistrationExamType._3,
                label: 'TOEFL ITP',
                value: RegistrationExamType._3,
            },
            {
                key: RegistrationExamType._4,
                label: 'TOEFL iBT',
                value: RegistrationExamType._4,
            },
        ]
    }

    const [state, dispatch] = useReducer<(prevState: any, updatedProperty: any) => any>((prevState: any, updatedProperty: any) => ({
        ...prevState,
        ...updatedProperty,
    }), initState);


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
        const response = await postExamLocation(examLocation);
        setModalButtonOkText('Lưu');
        setConfirmLoading(false);
        setOpen(false);
        if (response.code === Code._200) {
            const examLocationScheduleObjs: ExamLocationScheduleModel[] = examLocationSchedules.map((item: ExamLocationScheduleModel, idx: number) => {
                return {
                    ...item,
                    examLocationId: response.data,
                    examId: examSchedule.examId,
                    examScheduleId: examSchedule.id,
                    order: idx
                }
            }) as ExamLocationScheduleModel[];
            const responseExamLocationSchedule = await upSertExamLocationSchedule(response.data as string, examLocationScheduleObjs);
            if (responseExamLocationSchedule.code === Code._200) {
                message.success(response.message || "Tạo thành công")
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
        setExamLocationSchedules([])
        setOpen(false);
    };
    const validateMessages = {
        required: '${label} không được để trống',
        types: {
            email: '${label} không đúng định dạng email',
            number: '${label} không đúng định dạng số',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };
    const itemTabs: TabsProps['items'] = [
        {
            key: '1',
            label: `Địa điểm thi`,
            children: <CreateExamLocationInfor examSchedule={examSchedule} handleOk={handleOk} provinces={provinces} />,
        },
        {
            key: '2',
            label: `Ca thi`,
            children: <ExamLocationSchedule />,
        },
    ];

    return (
        <>
            <Modal title="Tạo mới địa điểm thi" open={open} okText={modalButtonOkText} cancelText="Bỏ qua" width={860}
                           /* onOk={onSubmit}*/ style={{ top: 20 }} onCancel={handleCancel}
                confirmLoading={confirmLoading}
                okButtonProps={{ form: 'myFormCreate1', htmlType: 'submit' }}
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

export default ExamLocationCreateTFC;