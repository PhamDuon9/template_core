import { ResponseData } from '@/utils/request';
import {
    Button,
    Card,
    Col,
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
import { DivisionModel } from '@/apis/models/toefl-challenge/DivisionModel';
import { RegistrationRound } from '@/apis/models/toefl-challenge/RegistrationRound';
import { postExamSchedule } from '@/apis/services/toefl-challenge/ExamLocationService';
import { getExam } from '@/apis/services/toefl-challenge/ExamService';
import {
    ConvertOptionSelectModel
} from '@/utils/convert';
import { ArrowLeftOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { OptionModel, SelectOptionModel } from '@/@types/data';




function ExamScheduleCreateTFC() {
    const navigate = useNavigate();
    // Load
    const initState = {
        schoolParents: [],
        provinces: [],
        divisions: [],
        schoolEdit: {},
        examTypes: [
            {
                key: 'Default',
                label: '-Chọn-',
                value: '',
            },
            {
                key: '0',
                label: 'Bài thi cơ bản',
                value: '0',
            },
            {
                key: '1',
                label: 'Bài thi mở rộng',
                value: '1',
            },
        ],
        exams: [
            {
                key: 'Default',
                label: '-Chọn-',
                value: '',
            }
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
            const filter = {
                Status: true
            }
            const responseExams: ResponseData = await getExam(JSON.stringify(filter));
            const examOptions = ConvertOptionSelectModel(responseExams.data as OptionModel[]);
            const stateDispatcher = {
                exams: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(examOptions),
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

        const objBody: DivisionModel = {
            ...fieldsValue,
            // ExamType: +fieldsValue.ExamType,
            // Year: "" + moment(fieldsValue.Year).years()
        }
        // console.log(objBody)
        // return
        const response = await postExamSchedule(objBody);
        setButtonOkText('Lưu');
        setButtonLoading(false);
        if (response.code === Code._200) {
            message.success(response.message || "Tạo thành công")
            //redirect đến trang chỉnh sửa
            navigate(`/toefl-challenge/exam-schedule/edit/${response.data}`)
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
                                <Button type="text" shape='circle' onClick={() => navigate('/toefl-challenge/exam-schedule')}>
                                    <ArrowLeftOutlined />
                                </Button>
                            </Tooltip>
                            <Text strong>Thêm mới lịch thi</Text>
                        </Space>
                    </>
                }
                extra={
                    <Space>
                        <Button type="dashed" onClick={() => navigate('/toefl-challenge/exam-schedule')}>
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
                                ["Name"]: '',
                                ["RegistrationRound"]: '',
                                ["ExamId"]: '',
                                // ['Year']: moment(new Date()),
                            }}
                        >
                            <Row gutter={16} justify='start'>
                                <Col span={12}>
                                    <Form.Item label={'Tên lịch thi'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Name' rules={[{ required: true }]}>
                                        <Input placeholder='Nhập tên lịch thi' allowClear />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={'Cuộc thi'}
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        name='ExamId'
                                        rules={[{ required: true }]}
                                    >
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                            }
                                            placeholder='Chọn' options={state.exams} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={'Vòng thi'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='RegistrationRound' rules={[{ required: true }]}>
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                            }
                                            placeholder='Chọn' options={state.registrationRounds} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                }


            </Card>


        </div>
    );
}

export default ExamScheduleCreateTFC;
