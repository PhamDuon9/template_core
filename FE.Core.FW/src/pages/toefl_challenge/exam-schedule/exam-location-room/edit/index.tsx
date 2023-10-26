import { Code } from '@/apis';
import { ExamLocationRoomMapScheduleModel } from '@/apis/models/toefl-challenge/ExamLocationRoomMapScheduleModel';
import { ExamLocationRoomModel } from '@/apis/models/toefl-challenge/ExamLocationRoomModel';
import { ExamScheduleModel } from '@/apis/models/toefl-challenge/ExamScheduleModel';
import { putExamLocation2, putRoomMapSchedule } from '@/apis/services/toefl-challenge/ExamLocationService';
import { examLocationMapScheduleState } from '@/store/exam-atom';
import { Modal, Tabs, TabsProps, message } from 'antd';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import EditExamLocationInfor from './edit-exam-location';
import ExamLocationRoomMapScheduleEdit from './exam-location-room-map-schedule-edit';
interface Props {
    open: boolean;
    examSchedule: ExamScheduleModel;
    setOpen: (value: boolean) => void;
    reload: (current: number, pageSize: number) => void;
    recordEdit: ExamLocationRoomModel
}
const ExamLocationRoomEditTFC: React.FC<Props> = ({ open, setOpen, reload, examSchedule, recordEdit }) => {
    // const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalButtonOkText, setModalButtonOkText] = useState('Lưu');
    const [data, setData] = useRecoilState<ExamLocationRoomMapScheduleModel[]>(examLocationMapScheduleState);
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
        const response = await putExamLocation2(recordEdit.id, examLocationRoom);
        setModalButtonOkText('Lưu');
        setConfirmLoading(false);
        setOpen(false);
        if (response.code === Code._200) {
            const examLocationScheduleObjs: ExamLocationRoomMapScheduleModel[] = data.map((item: ExamLocationRoomMapScheduleModel, idx: number) => {
                return {
                    ...item,
                    examLocationId: recordEdit.examLocationId,
                    examId: examSchedule.examId,
                    examScheduleId: examSchedule.id,
                    examLocationRoomId: recordEdit.id
                }
            }) as ExamLocationRoomMapScheduleModel[];
            const responseExamLocationSchedule = await putRoomMapSchedule(
                examSchedule.examId,
                examSchedule.id,
                recordEdit.examLocationId,
                recordEdit.id,
                examLocationScheduleObjs);
            if (responseExamLocationSchedule.code === Code._200) {
                message.success(response.message || "Cập nhật thành công")
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
            label: `Thông tin phòng thi`,
            children: <EditExamLocationInfor recordEdit={recordEdit}
                handleOk={handleOk}
            />,
        },
        {
            key: '2',
            label: `Thông tin ca thi theo phòng thi`,
            children: <ExamLocationRoomMapScheduleEdit examSchedule={examSchedule}
                examLocationId={recordEdit.examLocationId as string}
                examLocationRoomId={recordEdit.id as string}
            />,
        },
    ];

    return (
        <>
            <Modal title="Cập nhật phòng thi" open={open} okText={modalButtonOkText} cancelText="Bỏ qua" width={860}
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

export default ExamLocationRoomEditTFC;