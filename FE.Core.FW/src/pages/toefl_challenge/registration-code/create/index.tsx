import { ResponseData } from '@/utils/request';
import {
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    FormInstance,
    Input,
    Row,
    Select,
    Space,
    Spin,
    Tooltip,
    Typography,
    message
} from 'antd';
import { useEffect, useReducer, useRef, useState } from 'react';

import { Code } from '@/apis';
import { RegistrationCodeModel } from '@/apis/models/toefl-challenge/RegistrationCodeModel';
import { getExam } from '@/apis/services/toefl-challenge/ExamService';
import { postRegistrationCode } from '@/apis/services/toefl-challenge/RegistrationCodeService';
import {
    ConvertOptionSelectModel
} from '@/utils/convert';
import { ArrowLeftOutlined } from '@ant-design/icons';
import locale from "antd/es/date-picker/locale/vi_VN";
import { useNavigate } from 'react-router-dom';
import { OptionModel, SelectOptionModel } from '@/@types/data';

function RegistrationCodeCreateTFC() {
    const navigate = useNavigate();
    // Load
    const initState = {
        exams: [],
        registrations: []
    };
    const [loading, setLoading] = useState<boolean>(false);

    const { Title, Paragraph, Text, Link } = Typography;
    const [state, dispatch] = useReducer<(prevState: any, updatedProperty: any) => any>(
        (prevState: any, updatedProperty: any) => ({
            ...prevState,
            ...updatedProperty,
        }),
        initState,
    );

    useEffect(() => {
        const fnGetInitState = async () => {
            setLoading(true);
            const responseExam: ResponseData = await getExam("{'status':true}");
            const examOptions = ConvertOptionSelectModel(responseExam.data as OptionModel[]);
            const stateDispatcher = {
                exams: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(examOptions)
            };
            dispatch(stateDispatcher);
            setLoading(false);
        }
        fnGetInitState()
    }, []);

    // Data
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [buttonOkText, setButtonOkText] = useState<string>('Lưu');

    // searchForm
    const formRef = useRef<FormInstance>(null);

    const validateMessages = {
        required: '${label} không được để trống',
        whitespace: '${label} không được để trống',
        types: {
            email: '${label} không đúng định dạng email',
            number: '${label} không đúng định dạng số',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };

    const handleOk = async () => {
        const fieldsValue = await formRef?.current?.validateFields();
        setButtonOkText('Đang xử lý...');
        setButtonLoading(true);
        // setConfirmLoading(true);
        // searchForm.resetFields()

        const objBody: RegistrationCodeModel = {
            examId: fieldsValue.ExamId,
            registrationNumber: fieldsValue.RegistrationNumber,
            code: fieldsValue.Code,
            startDate: fieldsValue.StartDate.format('DD/MM/YYYY'),
            endDate: fieldsValue.EndDate.format('DD/MM/YYYY'),
        }
        console.log(objBody)
        // return
        const response = await postRegistrationCode(objBody);
        setButtonOkText('Lưu');
        setButtonLoading(false);
        if (response.code === Code._200) {
            message.success(response.message || "Tạo thành công")
            //redirect đến trang chỉnh sửa
            navigate(`/toefl-challenge/registration-code`)
        }
        else {
            message.error(response.message || "Thất bại")
        }
    };

    return (
        <div className='layout-main-content'>
            <Card
                bordered={false}
                title={
                    <>
                        <Space className="title">
                            <Tooltip title="Quay lại">
                                <Button type="text" shape='circle' onClick={() => navigate('/toefl-challenge/registration-code')}>
                                    <ArrowLeftOutlined />
                                </Button>
                            </Tooltip>
                            <Text strong>Thêm mới code thi</Text>
                        </Space>
                    </>
                }
                extra={
                    <Space>
                        <Button type="dashed" onClick={() => navigate('/toefl-challenge/registration-code')}>
                            Hủy bỏ
                        </Button>
                        <Button disabled={buttonLoading} htmlType="submit" type='primary' onClick={handleOk}>
                            {buttonOkText}
                        </Button>
                    </Space>

                }
            >
                {loading ? <Spin /> :
                    <div style={{ margin: "0 20px" }}>
                        <Form
                            // form={searchForm}
                            ref={formRef}
                            name='nest-messages' id="myFormCreate"
                            onFinish={handleOk}
                            validateMessages={validateMessages}
                            initialValues={{
                                ["ExamId"]: undefined,
                                ["RegistrationNumber"]: '',
                                ['Code']: '',
                                ["StartDate"]: '',
                                ["EndDate"]: '',
                            }}
                        >
                            <Row gutter={16} justify='start'>
                                <Col span={12}>
                                    <Form.Item
                                        labelAlign='left'
                                        label={'Cuộc thi'}
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        name='ExamId'
                                    >
                                        <Select
                                            placeholder='-Chọn-'
                                            showSearch
                                            allowClear
                                            optionFilterProp='children'
                                            filterOption={(input, option) =>
                                                (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                                            }
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '')
                                                    .toString()
                                                    .toLowerCase()
                                                    .localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                            }
                                            options={state.exams}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        labelAlign='left'
                                        label={'Số báo danh'}
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        name='RegistrationNumber'
                                    >
                                        <Input placeholder='Nhập số báo danh' allowClear />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={'Code thi'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Code' rules={[{ required: true }]}>
                                        <Input placeholder='Nhập code thi' allowClear />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={'Ngày bắt đầu'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='StartDate' rules={[{ required: true }]}>
                                        <DatePicker locale={locale} style={{ width: '100%' }}
                                            format="DD/MM/YYYY" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={'Ngày kết thúc'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='EndDate' rules={[{ required: true }]}>
                                        <DatePicker locale={locale} style={{ width: '100%' }}
                                            format="DD/MM/YYYY" />
                                    </Form.Item>
                                </Col>
                                {/* <Col span={12}>
                                    <Form.Item label={'Ghi đè dữ liệu'} valuePropName="checked" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='IsOverwrite'>
                                        <Switch checked />
                                    </Form.Item>
                                </Col> */}
                            </Row>
                        </Form>
                    </div>
                }


            </Card>


        </div>
    );
}

export default RegistrationCodeCreateTFC;
