import { Code } from '@/apis';
import { ExamModel } from '@/apis/models/toefl-challenge/ExamModel';
import { RegistrationExamType } from '@/apis/models/toefl-challenge/RegistrationExamType';
import { RegistrationRound } from '@/apis/models/toefl-challenge/RegistrationRound';
import { putExam } from '@/apis/services/toefl-challenge/ExamService';
import { Col, ConfigProvider, DatePicker, Form, Modal, Row, Select, message } from 'antd';
import React, { useEffect, useReducer, useState } from 'react';
import locale from "antd/es/date-picker/locale/vi_VN"
import dayjs from 'dayjs';
import { useRecoilState } from 'recoil';
import { examRegistrationScheduleState } from '@/store/exam-atom';
import moment from 'moment';
interface Props {
    open: boolean;
    examEdit: ExamModel;
    setOpen: (value: boolean) => void;
    reload: (current: number, pageSize: number) => void;
}
const ExamRegistrationScheduleCreateTFC: React.FC<Props> = ({ open, setOpen, reload, examEdit }) => {
    const [searchForm] = Form.useForm();
    // const [open, setOpen] = useState(false);

    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalButtonOkText, setModalButtonOkText] = useState('Lưu');
    const initState = {
        districts: [],
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

    const [examRegistrationSchedules, setExamRegistrationSchedules] = useRecoilState(examRegistrationScheduleState);
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
    }

    const handleOk = async () => {
        const fieldsValue = await searchForm.validateFields();
        setModalButtonOkText('Đang xử lý...');
        setConfirmLoading(true);
        searchForm.resetFields()

        const examRegistrationScheduleNew = [

            ...(examRegistrationSchedules ?? []),
            {
                id: uuidv4(),
                ...fieldsValue,
                startDate: moment(fieldsValue.startDate).format('YYYY-MM-DDTHH:mm:ss.SSS'),
                endDate: moment(fieldsValue.endDate).format('YYYY-MM-DDTHH:mm:ss.SSS'),
                examDate: moment(fieldsValue.examDate).format('YYYY-MM-DDTHH:mm:ss.SSS'),
            },
        ]
        console.log(examRegistrationScheduleNew)
        setExamRegistrationSchedules(examRegistrationScheduleNew);
        setConfirmLoading(false);
        setOpen(false);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        searchForm.resetFields()
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

    return (
        <>
            <Modal title="Tạo mới vòng thi" open={open} okText={modalButtonOkText} cancelText="Bỏ qua" width={800}
                           /* onOk={onSubmit}*/ style={{ top: 20 }} onCancel={handleCancel}
                confirmLoading={confirmLoading}
                okButtonProps={{ form: 'myFormCreate1', htmlType: 'submit' }}
            >
                <Form
                    form={searchForm}
                    name='nest-messages1' id="myFormCreate1"
                    onFinish={handleOk}
                    validateMessages={validateMessages}
                    initialValues={{
                        ["registrationRound"]: '',
                        ["registrationExamType"]: '',
                    }}
                >
                    <Row gutter={16} justify='start'>

                        <Col span={12}>
                            <Form.Item label={'Chọn vòng thi'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='registrationRound' rules={[{ required: true }]}>
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                    }
                                    placeholder='-Chọn vòng thi-' options={state.registrationRounds} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={'Bài thi'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='registrationExamType' rules={[{ required: true }]}>
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                    }
                                    placeholder='-Chọn bài thi-' options={state.registrationExamTypes} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={'Thời gian mở đăng ký'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='startDate' rules={[{ required: true }]}>
                                <DatePicker locale={locale} style={{ width: '100%' }} showTime={{ format: 'HH:mm' }}
                                    format="DD/MM/YYYY HH:mm" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={'Thời gian đóng đăng ký'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='endDate' rules={[{ required: true }]}>
                                <DatePicker locale={locale} style={{ width: '100%' }} showTime={{ format: 'HH:mm' }}
                                    format="DD/MM/YYYY HH:mm" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={'Ngày thi'}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                name='examDate'
                                rules={[{ required: true }]}
                            >
                                <DatePicker locale={locale} style={{ width: '100%' }}
                                    format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>

                    </Row>
                </Form>
            </Modal>
        </>
    );
}

export default ExamRegistrationScheduleCreateTFC;