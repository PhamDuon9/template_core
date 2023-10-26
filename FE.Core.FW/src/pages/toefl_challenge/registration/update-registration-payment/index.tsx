import { Code } from '@/apis';
import { PaymentStatus } from '@/apis/models/toefl-challenge/PaymentStatus';
import { PaymentType } from '@/apis/models/toefl-challenge/PaymentType';
import { RegistrationExamType } from '@/apis/models/toefl-challenge/RegistrationExamType';
import { RegistrationModel } from '@/apis/models/toefl-challenge/RegistrationModel';
import { RegistrationRound } from '@/apis/models/toefl-challenge/RegistrationRound';
import { postRegistrationPayment, putRegistrationPayment } from '@/apis/services/toefl-challenge/RegistrationPaymentService';
import {
    Col,
    DatePicker,
    Form,
    FormInstance,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Typography,
    message
} from 'antd';
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from 'moment';
import { useEffect, useReducer, useRef, useState } from 'react';



interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
    recordEdit: RegistrationModel;
    reload: (current: number, pageSize: number) => void;
}
function RegistrationPaymentTFC({ open, setOpen, recordEdit, reload }: Props) {
    const [searchForm] = Form.useForm();
    // Load
    const initState = {
        provinces: [],
        districts: [],
        registrationRounds: [
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
        ],
        paymentStatus: [
            {
                key: 'Default',
                label: '-Chọn-',
                value: '',
            },
            {
                key: PaymentStatus._0,
                label: 'Chưa thanh toán',
                value: PaymentStatus._0,
            },
            {
                key: PaymentStatus._1,
                label: 'Đang xác nhận',
                value: PaymentStatus._1,
            },
            {
                key: PaymentStatus._2,
                label: 'Đã thanh toán',
                value: PaymentStatus._2,
            },
        ],
        paymentTypes: [
            {
                key: 'Default',
                label: '-Chọn-',
                value: '',
            },
            {
                key: PaymentType._0,
                label: 'Chuyển khoản/Tiền mặt',
                value: PaymentType._0,
            },
            // {
            //     key: PaymentType._1,
            //     label: 'Online',
            //     value: PaymentType._1,
            // },
        ],
        exams: [],
    };

    const { Title, Paragraph, Text, Link } = Typography;
    const [state, dispatch] = useReducer<(prevState: any, updatedProperty: any) => any>(
        (prevState: any, updatedProperty: any) => ({
            ...prevState,
            ...updatedProperty,
        }),
        initState,
    );

    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalButtonOkText, setModalButtonOkText] = useState('Lưu');
    useEffect(() => {

    }, [recordEdit]);

    // Data
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [buttonOkText, setButtonOkText] = useState<string>('Lưu');

    // searchForm
    const [form] = Form.useForm();
    const formRef = useRef<FormInstance>(null);


    const handleCancel = () => {
        // console.log('Clicked cancel button');
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

    const handleOk = async () => {
        const fieldsValue = await searchForm.validateFields();
        setModalButtonOkText('Đang xử lý...');
        setConfirmLoading(true);
        searchForm.resetFields()

        const objBody = {
            ...fieldsValue,
            // TransactionDate: moment(fieldsValue.TransactionDate).format('YYYY-MM-DDTHH:mm:ss.SSS'),//dành cho date
            TransactionDate: moment(fieldsValue.TransactionDate).format('DD/MM/YYYY'),//dành cho string
            RegistrationId: recordEdit?.id,
            RegistrationRound: recordEdit?.round
        }
        console.log(objBody)
        if (recordEdit?.paymentModel?.id) {
            const response = await putRegistrationPayment(recordEdit?.paymentModel?.id, objBody);
            if (response.code === Code._200) {
                message.success(response.message || "Thành công")
                setOpen(false);
                setConfirmLoading(false);
                reload(1, 20)
            }
            else {
                setOpen(false);
                setConfirmLoading(false);
                message.error(response.message || "Thất bại")
            }
        }
        else {
            const response = await postRegistrationPayment(objBody);
            if (response.code === Code._200) {
                message.success(response.message || "Thành công")
                setOpen(false);
                setConfirmLoading(false);
                reload(1, 20)
            }
            else {
                setOpen(false);
                setConfirmLoading(false);
                message.error(response.message || "Thất bại")
            }
        }
    };


    return (
        <>
            <Modal title="Cập nhật thông tin thanh toán" open={open} cancelText="Bỏ qua" width={'800px'}
                           /* onOk={onSubmit}*/ okText={modalButtonOkText} style={{ top: 20 }} onCancel={handleCancel}
                confirmLoading={confirmLoading}
                okButtonProps={{ form: 'myFormCreate', htmlType: 'submit' }}
            >
                <Form
                    form={searchForm}
                    name='nest-messages' id="myFormCreate"
                    onFinish={handleOk}
                    validateMessages={validateMessages}
                    initialValues={{
                        ["FullName"]: recordEdit?.fullName ?? '',
                        ["RegistrationNumber"]: recordEdit?.registrationNumber ?? '',
                        ["TransactionNo"]: recordEdit?.paymentModel?.transactionNo ?? '',
                        ["Amount"]: recordEdit?.paymentModel?.amount,
                        ["TransactionContent"]: recordEdit?.paymentModel?.transactionContent,
                        ["TransactionDate"]: recordEdit?.paymentModel?.transactionDate ? moment(recordEdit?.paymentModel?.transactionDate) : '',
                        ["PaymentDate"]: recordEdit?.paymentModel?.paymentDate,
                        ["PaymentType"]: recordEdit?.paymentModel?.paymentType ?? PaymentType._0,
                        ["PaymentStatus"]: recordEdit?.paymentModel?.paymentStatus ?? PaymentStatus._0,
                        ["RegistrationRound"]: recordEdit?.round === RegistrationRound._1 ? "Vòng 1" : recordEdit?.round === RegistrationRound._2 ? "Vòng 2" : recordEdit?.round === RegistrationRound._3 ? "Vòng 3" : '',
                    }}
                >
                    <Row gutter={16} justify='start'>
                        <Col span={12}>
                            <Form.Item label={'Họ và tên'} labelAlign='left' labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='FullName'>
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={'Số báo danh'} labelAlign='left' labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='RegistrationNumber'>
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={'Tham chiếu GD'} labelAlign='left' labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='TransactionNo'
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={'Số tiền'} labelAlign='left' labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Amount'
                                rules={[{ required: true }]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                    parser={(value) => value!.replace(/(\.*)/g, '').replace('.', ',')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={'Ngày thanh toán'} labelAlign='left' labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='TransactionDate'
                                rules={[{ required: true }]}
                            >
                                <DatePicker locale={locale} style={{ width: '100%' }}
                                    format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={'Ngày giao dịch'} labelAlign='left' labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='PaymentDate'
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={'Nội dung'} labelAlign='left' labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='TransactionContent'
                                rules={[{ required: true }]}
                            >
                                <Input.TextArea
                                    allowClear
                                    autoSize={{ minRows: 2, maxRows: 6 }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={'Vòng thi'}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                labelAlign='left'
                                name='RegistrationRound'
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={'Tình trạng'}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                labelAlign='left'
                                name='PaymentType'
                                rules={[{ required: true }]}
                            >
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                    }
                                    placeholder='Chọn' options={state.paymentTypes} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={'Trạng thái'}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                labelAlign='left'
                                name='PaymentStatus'
                                rules={[{ required: true }]}
                            >
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                    placeholder='Chọn' options={state.paymentStatus} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
}

export default RegistrationPaymentTFC;
