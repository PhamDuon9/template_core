import { Code } from '@/apis';
import { ExamLocationRoomMapScheduleModel } from '@/apis/models/toefl-challenge/ExamLocationRoomMapScheduleModel';
import { ExamLocationScheduleModel } from '@/apis/models/toefl-challenge/ExamLocationScheduleModel';
import { ExamScheduleModel } from '@/apis/models/toefl-challenge/ExamScheduleModel';
import { RegistrationExamType } from '@/apis/models/toefl-challenge/RegistrationExamType';
import { RegistrationRound } from '@/apis/models/toefl-challenge/RegistrationRound';
import { postExamLocationRoom, putRoomMapSchedule } from '@/apis/services/toefl-challenge/ExamLocationService';
import { examLocationRoomMapScheduleState, examLocationScheduleState } from '@/store/exam-atom';
import { Modal, Tabs, TabsProps, message } from 'antd';
import React, { useReducer, useState } from 'react';
import { useRecoilState } from 'recoil';
import CreateExamLocationInfor from './create-exam-location';
import ExamLocationRoomMapSchedule from './exam-location-room-map-schedule-create';
import { ExamLocationRoomModel } from '@/apis/models/toefl-challenge/ExamLocationRoomModel';
import { SelectOptionModel } from '@/@types/data';
interface Props {
    open: boolean;
    examSchedule: ExamScheduleModel;
    setOpen: (value: boolean) => void;
    reload: (current: number, pageSize: number) => void;
    examLocations: SelectOptionModel[]
}
const ExamLocationCreateTFC: React.FC<Props> = ({ open, setOpen, reload, examSchedule, examLocations }) => {
    // const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalButtonOkText, setModalButtonOkText] = useState('Lưu');
    const [examLocationSchedules, setExamLocationSchedules] = useRecoilState<ExamLocationScheduleModel[]>(examLocationScheduleState);
    const [data, setData] = useRecoilState<ExamLocationRoomMapScheduleModel[]>(examLocationRoomMapScheduleState);
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

        const examLocationRoom: ExamLocationRoomModel = {
            ...value,
            ExamId: examSchedule.examId,
            ExamScheduleId: examSchedule.id,
        }

        // console.log(value, data)
        // return
        const response = await postExamLocationRoom(examLocationRoom);
        setModalButtonOkText('Lưu');
        setConfirmLoading(false);
        setOpen(false);
        if (response.code === Code._200) {
            const examLocationScheduleObjs: ExamLocationRoomMapScheduleModel[] = data.map((item: ExamLocationRoomMapScheduleModel, idx: number) => {
                return {
                    ...item,
                    examLocationId: value.ExamLocationId,
                    examId: examSchedule.examId,
                    examScheduleId: examSchedule.id,
                    examLocationRoomId: response.data
                }
            }) as ExamLocationRoomMapScheduleModel[];
            const responseExamLocationSchedule = await putRoomMapSchedule(
                examSchedule.examId,
                examSchedule.id,
                value.ExamLocationId,
                response.data as string,
                examLocationScheduleObjs);
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
        // formRef.current?.resetFields()
        setOpen(false);
    };
    const itemTabs: TabsProps['items'] = [
        {
            key: '1',
            label: `Thông tin phòng thi`,
            children: <CreateExamLocationInfor examSchedule={examSchedule}
                examLocations={examLocations}
                handleOk={handleOk} />,
        },
        {
            key: '2',
            label: `Thông tin ca thi theo phòng thi`,
            children: <ExamLocationRoomMapSchedule examSchedule={examSchedule} />,
        },
    ];

    return (
        <>
            <Modal title="Tạo mới phòng thi" open={open} okText={modalButtonOkText} cancelText="Bỏ qua" width={860}
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