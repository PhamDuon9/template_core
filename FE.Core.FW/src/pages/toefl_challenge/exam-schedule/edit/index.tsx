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
    Tabs,
    TabsProps,
    Tooltip,
    Typography,
    message
} from 'antd';
import { useEffect, useReducer, useRef, useState } from 'react';

import { Code } from '@/apis';
import { ExamModel } from '@/apis/models/toefl-challenge/ExamModel';
import { PICModel } from '@/apis/models/toefl-challenge/PICModel';
import { getExam } from '@/apis/services/toefl-challenge/ExamService';
import { examPaymentState, examRegistrationProvinceState, examRegistrationScheduleState } from '@/store/exam-atom';
import {
    ConvertOptionSelectModel
} from '@/utils/convert';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
// import ExamPaymentTFC from '../exam-payments';
// import ExamRegistrationScheduleTFC from '../exam-registration-schedules';
// import ExamRegistrationProvinceTFC from '../exam-registration-provinces';
import { OptionModel, SelectOptionModel } from '@/@types/data';
import { ExamScheduleModel } from '@/apis/models/toefl-challenge/ExamScheduleModel';
import { RegistrationRound } from '@/apis/models/toefl-challenge/RegistrationRound';
import { getAministrativeDivisions } from '@/apis/services/toefl-challenge/AministrativeDivisionsService';
import { getExamScheduleById, putExamScheduleTFC } from '@/apis/services/toefl-challenge/ExamLocationService';
import ExamLocationTFC from '../exam-location';
import ExamLocationRoomTFC from '../exam-location-room';

function ExamScheduleEditTFC() {
    const navigate = useNavigate();
    const params = useParams()
    // Load
    const initState = {
        provinces: [],
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
        recordEdit: {},
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
        ]
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


    const [examRegistrationSchedules, setExamRegistrationSchedules] = useRecoilState(examRegistrationScheduleState);
    const [examPayments, setExamPayments] = useRecoilState(examPaymentState);
    const [examRegistrationProvinces, setExamRegistrationProvinces] = useRecoilState(examRegistrationProvinceState);
    const fnGetInitState = async () => {
        setLoading(true);
        const filter = {
            Status: true
        }
        const responseExams: ResponseData = await getExam(JSON.stringify(filter));
        const examOptions = ConvertOptionSelectModel(responseExams.data as OptionModel[]);
        const responseExamSchedule: ResponseData = await getExamScheduleById(params.id);
        const responseData: ExamScheduleModel = responseExamSchedule.data as ExamScheduleModel;
        const responseProvinces: ResponseData = await getAministrativeDivisions();
        const provinceOptions = ConvertOptionSelectModel(responseProvinces.data as OptionModel[]);
        const stateDispatcher = {
            provinces: [{
                key: 'Default',
                label: '-Chọn-',
                value: '',
            } as SelectOptionModel].concat(provinceOptions),
            exams: [{
                key: 'Default',
                label: '-Chọn-',
                value: '',
            } as SelectOptionModel].concat(examOptions),
            recordEdit: responseData
        };
        // setExamRegistrationSchedules(responseData.examRegistrationSchedules ?? [])
        // setExamPayments(responseData.examPayments ?? [])
        // setExamRegistrationProvinces(responseData.examRegistrationProvinces ?? [])
        dispatch(stateDispatcher);
        setLoading(false);
    }
    useEffect(() => {
        fnGetInitState()
    }, []);

    // Data
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [buttonOkText, setButtonOkText] = useState<string>('Lưu');

    // searchForm
    const [form] = Form.useForm();
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
        const fieldsValueTable = [...data];
        setButtonOkText('Đang xử lý...');
        setButtonLoading(true);

        const objBody: ExamModel = {
            ...fieldsValue,
        }
        // console.log(objBody)

        // return
        const response = await putExamScheduleTFC(params.id, objBody);
        setButtonOkText('Lưu');
        setButtonLoading(false);
        if (response.code === Code._200) {
            message.success(response.message || "Cập nhật thành công")
            fnGetInitState()
        }
        else {
            message.error(response.message || "Thất bại")
        }
    };

    const [data, setData] = useState<PICModel[]>([]);

    const itemTabs: TabsProps['items'] = [
        {
            key: '1',
            label: `Địa điểm thi`,
            children: <ExamLocationTFC examSchedule={state.recordEdit} provinces={state.provinces} />,
        },
        {
            key: '2',
            label: `Phòng thi`,
            children: <ExamLocationRoomTFC examSchedule={state.recordEdit} />,
        },
        {
            key: '3',
            label: `Điều phối trường`,
            children: <>Chưa có</>,
        },
    ];
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
                            <Text strong>Cập nhật thông tin lịch thi</Text>
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
                    <Form
                        // form={searchForm}
                        ref={formRef}
                        name='nest-messages' id="myFormCreate"
                        onFinish={handleOk}
                        validateMessages={validateMessages}
                        initialValues={{
                            ["Name"]: state.recordEdit?.name ?? '',
                            ["ExamId"]: state.recordEdit?.examId ?? '',
                            ["RegistrationRound"]: state.recordEdit?.registrationRound ?? '',
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
                                        placeholder='Chọn' options={state.exams} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={'Vòng thi'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='RegistrationRound' rules={[{ required: true }]}>
                                    <Select
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}

                                        placeholder='Chọn' options={state.registrationRounds} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Tabs
                            defaultActiveKey="1"
                            tabPosition={"top"}
                            type="card"
                            style={{ minHeight: 220 }}
                            items={itemTabs}
                        />
                    </Form>
                }


            </Card>


        </div>
    );
}

export default ExamScheduleEditTFC;
