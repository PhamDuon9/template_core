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
    Switch,
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
import { ProvinceModel } from '@/apis/models/toefl-challenge/ProvinceModel';
import { getAministrativeDivisions, getAministrativeDivisions1 } from '@/apis/services/toefl-challenge/AministrativeDivisionsService';
import { getDepartment } from '@/apis/services/toefl-challenge/DepartmentService';
import { getDivision } from '@/apis/services/toefl-challenge/DivisionService';
import { getExam1, putExam } from '@/apis/services/toefl-challenge/ExamService';
import { examPaymentState, examRegistrationProvinceState, examRegistrationScheduleState } from '@/store/exam-atom';
import {
    ConvertOptionSelectModel
} from '@/utils/convert';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import ExamPaymentTFC from '../exam-payments';
import ExamRegistrationScheduleTFC from '../exam-registration-schedules';
import ExamRegistrationProvinceTFC from '../exam-registration-provinces';
import moment from 'moment';
import { OptionModel, SelectOptionModel } from '@/@types/data';

function EditCompetitonTFC() {
    const navigate = useNavigate();
    const params = useParams()
    // Load
    const initState = {
        provinces: [],
        districts: [],
        departments: [],
        divisions: [],
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
        const responseExam: ResponseData = await getExam1(params.id);
        const responseData: ExamModel = responseExam.data as ExamModel;
        const responseProvinces: ResponseData = await getAministrativeDivisions();
        const provinceOptions = ConvertOptionSelectModel(responseProvinces.data as OptionModel[]);
        const stateDispatcher = {
            provinces: [{
                key: 'Default',
                label: '-Chọn-',
                value: '',
            } as SelectOptionModel].concat(provinceOptions),

            recordEdit: responseData
        };
        setExamRegistrationSchedules(responseData.examRegistrationSchedules ?? [])
        setExamPayments(responseData.examPayments ?? [])
        setExamRegistrationProvinces(responseData.examRegistrationProvinces ?? [])
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
        const fieldsValueTable = [...data];
        setButtonOkText('Đang xử lý...');
        setButtonLoading(true);

        const objBody: ExamModel = {
            ...fieldsValue,
            ExamType: +fieldsValue.ExamType,
            Year: "" + moment(fieldsValue.Year).years(),
            examRegistrationSchedules: examRegistrationSchedules,
            examPayments: examPayments,
            examRegistrationProvinces: examRegistrationProvinces
        }
        // console.log(objBody)

        // return
        const response = await putExam(params.id, objBody);
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
    const onChangeProvince = async () => {
        const fieldsValue = await formRef.current?.getFieldsValue();
        const responseDistricts: ResponseData = await getAministrativeDivisions1(fieldsValue.ProvinceId);
        const dataDistricts = responseDistricts.data as ProvinceModel
        const districtOptions = ConvertOptionSelectModel(dataDistricts.districts as OptionModel[]);
        const filter = {
            provinceId: fieldsValue.ProvinceId ? fieldsValue.ProvinceId : undefined,
        }
        const response: ResponseData = await getDepartment(
            JSON.stringify(filter)
        );
        const departmentOptions = ConvertOptionSelectModel(response.data as OptionModel[]);

        const stateDispatcher = {
            departments: [{
                key: 'Default',
                label: '-Chọn-',
                value: '',
            } as SelectOptionModel].concat(departmentOptions),
            districts: [{
                key: 'Default',
                label: '-Chọn-',
                value: '',
            } as SelectOptionModel].concat(districtOptions),
        }
        dispatch(stateDispatcher)
    };
    const onChangeDepartment = async () => {
        const fieldsValue = await formRef.current?.getFieldsValue();

        const filter = {
            departmentId: fieldsValue.DepartmentId ? fieldsValue.DepartmentId : undefined,
        }
        const response: ResponseData = await getDivision(
            JSON.stringify(filter)
        );
        const divisionOptions = ConvertOptionSelectModel(response.data as OptionModel[]);

        const stateDispatcher = {
            divisions: [{
                key: 'Default',
                label: '-Chọn-',
                value: '',
            } as SelectOptionModel].concat(divisionOptions),
        }
        dispatch(stateDispatcher)
    };

    const [data, setData] = useState<PICModel[]>([]);

    const itemTabs: TabsProps['items'] = [
        {
            key: '1',
            label: `Cấu hình vòng thi`,
            children: <ExamRegistrationScheduleTFC />,
        },
        {
            key: '2',
            label: `Cấu hình giá bài thi`,
            children: <ExamPaymentTFC />,
        },
        {
            key: '3',
            label: `Tỉnh được đăng ký thi`,
            children: <ExamRegistrationProvinceTFC />,
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
                                <Button type="text" shape='circle' onClick={() => navigate('/toefl-challenge/competition')}>
                                    <ArrowLeftOutlined />
                                </Button>
                            </Tooltip>
                            <Text strong>Cập nhật thông tin cuộc thi</Text>
                        </Space>
                    </>
                }
                extra={
                    <Space>
                        <Button type="dashed" onClick={() => navigate('/toefl-challenge/competition')}>
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
                            ["ProvinceId"]: state.recordEdit?.provinceId ?? '',
                            ["Year"]: state.recordEdit?.year ? moment(`${state.recordEdit?.year}0621`) : '',
                            ["ExamType"]: state.recordEdit?.examType?.toString() ?? '',
                            ["Status"]: state.recordEdit?.status ?? '',
                        }}
                    >
                        <Row gutter={16} justify='start'>
                            <Col span={12}>
                                <Form.Item label={'Tên cuộc thi'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Name' rules={[{ required: true, whitespace: true }]}>
                                    <Input placeholder='Nhập tên cuộc thi' allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={'Năm thi'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Year' rules={[{ required: true }]}>
                                    <DatePicker picker='year' placeholder='Chọn năm' format={['YYYY']} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={'Tỉnh/TP'}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    name='ProvinceId'
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                        }
                                        placeholder='Chọn Tỉnh/TP' options={state.provinces} onChange={() => onChangeProvince()} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={'Loại cuộc thi'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='ExamType' rules={[{ required: true }]}>
                                    <Select
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                        }
                                        placeholder='Chọn loại cuộc thi' options={state.examTypes} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={'Trạng thái'} valuePropName="checked" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Status'>
                                    <Switch />
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

export default EditCompetitonTFC;
