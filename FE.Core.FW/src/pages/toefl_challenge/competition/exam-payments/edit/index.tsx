import { ExamPaymentModel } from '@/apis/models/toefl-challenge/ExamPaymentModel';
import { ExamRegistrationScheduleModel } from '@/apis/models/toefl-challenge/ExamRegistrationScheduleModel';
import { RegistrationExamType } from '@/apis/models/toefl-challenge/RegistrationExamType';
import { RegistrationRound } from '@/apis/models/toefl-challenge/RegistrationRound';
import { examPaymentState } from '@/store/exam-atom';
import { Col, DatePicker, Form, InputNumber, Modal, Row, Select } from 'antd';
import locale from "antd/es/date-picker/locale/vi_VN";
import React, { useReducer, useState } from 'react';
import { useRecoilState } from 'recoil';
interface Props {
    open: boolean;
    recordEdit: ExamPaymentModel,
    setOpen: (value: boolean) => void;
    reload: (current: number, pageSize: number) => void;
}
const ExamPaymentEditTFC: React.FC<Props> = ({ open, setOpen, reload, recordEdit }) => {
    const [searchForm] = Form.useForm();

    // console.log(recordEdit)
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalButtonOkText, setModalButtonOkText] = useState('Lưu');
    const initState = {
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

    const [examPayments, setExamPayments] = useRecoilState(examPaymentState);

    const handleOk = async () => {
        const fieldsValue = await searchForm.validateFields();
        setModalButtonOkText('Đang xử lý...');
        setConfirmLoading(true);
        searchForm.resetFields()

        const findIdx = examPayments.findIndex((item: ExamRegistrationScheduleModel) => {
            return item.id === recordEdit.id
        })

        const arrayClone = [...examPayments];
        const examRegistrationScheduleNew = {
            ...recordEdit,
            ...fieldsValue,
            // startDate: moment(fieldsValue.startDate).format('YYYY-MM-DDTHH:mm:ss.SSS'),
            // endDate: moment(fieldsValue.endDate).format('YYYY-MM-DDTHH:mm:ss.SSS'),
            // examDate: moment(fieldsValue.examDate).format('YYYY-MM-DDTHH:mm:ss.SSS'),
        }
        arrayClone.splice(findIdx, 1, examRegistrationScheduleNew);
        console.log(arrayClone)
        setExamPayments(arrayClone)
        setOpen(false);
        setConfirmLoading(false);
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
            <Modal title="Cập nhật vòng thi" open={open} okText={modalButtonOkText} cancelText="Bỏ qua" width={800}
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
                        ["registrationRound"]: recordEdit?.registrationRound,
                        ["registrationExamType"]: recordEdit?.registrationExamType,
                        ["price"]: recordEdit.price,

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
                            <Form.Item
                                label={'Giá bài thi'}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                name='price'
                                rules={[{ required: true }]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                    // parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                    parser={(value) => value!.replace(/(\.*)/g, '').replace('.', ',')}
                                />
                            </Form.Item>
                        </Col>

                    </Row>
                </Form>
            </Modal>
        </>
    );
}

export default ExamPaymentEditTFC;