import { Code } from '@/apis';
import { DivisionModel } from '@/apis/models/toefl-challenge/DivisionModel';
import { ExamModel } from '@/apis/models/toefl-challenge/ExamModel';
import { ProvinceModel } from '@/apis/models/toefl-challenge/ProvinceModel';
import { RegistrationExamType } from '@/apis/models/toefl-challenge/RegistrationExamType';
import { RegistrationModel } from '@/apis/models/toefl-challenge/RegistrationModel';
import { RegistrationRound } from '@/apis/models/toefl-challenge/RegistrationRound';
import { SchoolModel } from '@/apis/models/toefl-challenge/SchoolModel';
import { getAministrativeDivisions1 } from '@/apis/services/toefl-challenge/AministrativeDivisionsService';
import { getExam, getExam1 } from '@/apis/services/toefl-challenge/ExamService';
import { getRegistration1, putRegistration1 } from '@/apis/services/toefl-challenge/RegistrationService';
import { getSchool } from '@/apis/services/toefl-challenge/SchoolService';
import {
    ConvertOptionSelectModel
} from '@/utils/convert';
import { ResponseData } from '@/utils/request';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
    Button,
    Card,
    Checkbox,
    Col,
    DatePicker,
    Form,
    FormInstance,
    Input,
    Radio,
    Row,
    Select,
    Space,
    Spin,
    Tooltip,
    Typography,
    message
} from 'antd';
import locale from "antd/es/date-picker/locale/vi_VN";
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import { useEffect, useReducer, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OptionModel, SelectOptionModel } from '@/@types/data';
import DebounceSelect from '@/components/DebounceSelect';




function RegistrationTFC() {
    const navigate = useNavigate();
    const params = useParams()
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
            {
                key: RegistrationExamType._4,
                label: 'TOEFL iBT',
                value: RegistrationExamType._4,
            },
        ],
        exams: [],
        recordEdit: {}
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
            const responseExams: ResponseData = await getExam(JSON.stringify({
                status: 1
            }));
            const responseRegistration: ResponseData = await getRegistration1(params.id);
            const responseData: RegistrationModel = responseRegistration.data as RegistrationModel;
            const filter = {
                provinceId: responseData.provinceId,
            }
            const responseExam: ResponseData<ExamModel> = await getExam1(responseData.examId) as ResponseData<ExamModel>;
            const responseProvinces = responseExam.data?.provinces
            const responseDistricts: ResponseData = await getAministrativeDivisions1(responseData.provinceId as string);
            const dataDistricts = responseDistricts.data as ProvinceModel;
            const provinceOptions = ConvertOptionSelectModel(responseProvinces as OptionModel[]);
            const districtOptions = ConvertOptionSelectModel(dataDistricts.districts as OptionModel[]);
            const examOptions = ConvertOptionSelectModel(responseExams.data as OptionModel[]);
            let blocks: SelectOptionModel[] = []
            for (let idx = 1; idx <= 12; idx++) {
                blocks.push({
                    key: `${idx}`,
                    label: `${idx}`,
                    value: `${idx}`,
                })
            }
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
                blocks: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(blocks),
                districts: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(districtOptions),
                recordEdit: responseRegistration.data
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
        setButtonOkText('Đang xử lý...');
        setButtonLoading(true);

        const objBody: RegistrationModel = {
            ...fieldsValue,
            DayOfBirth: new Date(fieldsValue?.Birthday).getDate(),
            MonthOfBirth: new Date(fieldsValue?.Birthday).getMonth() + 1,
            YearOfBirth: new Date(fieldsValue?.Birthday).getFullYear(),
            SchoolId: fieldsValue.SchoolId ? fieldsValue.SchoolId.value : undefined,
        }
        // console.log(objBody)

        const response = await putRegistration1(params.id, objBody);
        setButtonOkText('Lưu');
        setButtonLoading(false);
        if (response.code === Code._200) {
            message.success(response.message || "Cập nhật thành công")
        }
        else {
            message.error(JSON.stringify(response.errorDetail) || "Thất bại")
        }
    };
    const onChangeProvince = async () => {
        const fieldsValue = await formRef.current?.getFieldsValue();
        formRef.current?.setFieldsValue({
            "DistrictId": '',
            "SchoolId": '',
        })
        const responseDistricts: ResponseData = await getAministrativeDivisions1(fieldsValue.ProvinceId);
        const dataDistricts = responseDistricts.data as ProvinceModel
        const districtOptions = ConvertOptionSelectModel(dataDistricts.districts as OptionModel[]);

        const stateDispatcher = {
            districts: [{
                key: 'Default',
                label: '-Chọn-',
                value: '',
            } as SelectOptionModel].concat(districtOptions),
        }
        dispatch(stateDispatcher)
    };
    const onHandleChangeExam = async () => {
        const fieldsValue = await formRef.current?.getFieldsValue();
        const stateDispatcherBefore = {
            provinces: [{
                key: 'Default',
                label: '-Chọn-',
                value: '',
            }],
            districts: [{
                key: 'Default',
                label: '-Chọn-',
                value: '',
            }],
        }
        dispatch(stateDispatcherBefore)
        formRef.current?.setFieldValue('ProvinceId', '')
        formRef.current?.setFieldValue('DistrictId', '')
        formRef.current?.setFieldValue('SchoolId', '')
        const responseExam: ResponseData<ExamModel> = await getExam1(fieldsValue.ExamId) as ResponseData<ExamModel>;
        const provinceOptions = ConvertOptionSelectModel(responseExam.data?.provinces as OptionModel[]);
        const stateDispatcher = {
            provinces: [{
                key: 'Default',
                label: '-Chọn-',
                value: '',
            } as SelectOptionModel].concat(provinceOptions),
        }
        dispatch(stateDispatcher)
    }
    const onGetSchoolDebounce = async (search: string, page: number = 1): Promise<ResponseData<SelectOptionModel[]>> => {
        const fieldsValue = await formRef?.current?.getFieldsValue();
        const filter = {
            provinceId: fieldsValue.ProvinceId ? fieldsValue.ProvinceId : undefined,
            districtId: fieldsValue.DistrictId ? fieldsValue.DistrictId : undefined,
            page: page,
            size: 20,
            textSearch: search,
        }

        return getSchool(
            JSON.stringify(filter)
        ).then((body: ResponseData | ResponseData<SchoolModel[]>) => {
            const recordOptions = ConvertOptionSelectModel(body.data as OptionModel[]);
            return {
                ...body,
                data: recordOptions
            }
        });
    }

    return (
        <div className='layout-main-content'>
            <Card
                bordered={false}
                title={
                    <>
                        <Space className="title">
                            <Tooltip title="Quay lại">
                                <Button type="text" shape='circle' onClick={() => navigate('/toefl-challenge/registration')}>
                                    <ArrowLeftOutlined />
                                </Button>
                            </Tooltip>
                            <Text strong>Cập nhật thông tin thí sinh</Text>
                        </Space>
                    </>
                }
                extra={
                    <Space>
                        <Button type="dashed" onClick={() => navigate('/toefl-challenge/registration')}>
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
                            ['ExamId']: state.recordEdit?.examId ?? undefined,
                            ['Round']: state.recordEdit?.round ?? undefined,
                            ['IsSelfRegistration']: state.recordEdit?.isSelfRegistration ?? false,
                            ['ProvinceId']: state.recordEdit?.provinceId ?? '',
                            ['DistrictId']: state.recordEdit?.districtId ?? '',
                            ['Gender']: state.recordEdit?.gender ?? 0,
                            ['Block']: state.recordEdit?.block ?? '',
                            ['Class']: state.recordEdit?.class ?? '',
                            ['FullName']: state.recordEdit?.fullName ?? '',
                            ['Tel']: state.recordEdit?.tel ?? '',
                            ['Email']: state.recordEdit?.email ?? '',
                            ['MotherName']: state.recordEdit?.motherName ?? '',
                            ['FatherName']: state.recordEdit?.fatherName ?? '',
                            ['Address']: state.recordEdit?.address ?? '',
                            ['Note']: state.recordEdit?.note ?? '',
                            ['ExamType']: state.recordEdit?.examType ?? '',
                            ['IsUsedForCommunication']: state.recordEdit?.isUsedForCommunication,
                            ['SchoolId']: {
                                value: state.recordEdit?.schoolId,
                                label: state.recordEdit?.schoolName,
                                key: state.recordEdit?.schoolId,
                            },
                            ['Birthday']: moment(`${state.recordEdit?.yearOfBirth}${String(state.recordEdit?.monthOfBirth).padStart(2, '0')}${String(state.recordEdit?.dayOfBirth).padStart(2, '0')}`),
                        }}
                    >
                        <Row gutter={16} justify='start'>
                            <Col span={8}>
                                <Form.Item label={'Họ và tên'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='FullName' rules={[{ required: true }]}>
                                    <Input placeholder='Nhập họ và tên' allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label={'Ngày sinh'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Birthday' rules={[{ required: true }]}>
                                    <DatePicker locale={locale} style={{ width: '100%' }}
                                        format="DD/MM/YYYY" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label={'Giới tính'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Gender' rules={[{ required: true }]}>
                                    <Radio.Group>
                                        <Radio value={0}>Nam</Radio>
                                        <Radio value={1}>Nữ</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label={'Cuộc thi theo Tỉnh/TP'}
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
                                        placeholder='Chọn' options={state.exams}
                                        onChange={() => onHandleChangeExam()}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label={'Đăng ký tham gia bài thi'}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    name='ExamType'
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                        // filterSort={(optionA, optionB) =>
                                        //     (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                        // }
                                        placeholder='Chọn' options={state.registrationExamTypes} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label={'Vòng thi'}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    name='Round'
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}

                                        placeholder='Chọn' options={state.registrationRounds} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label={'Tỉnh/TP nơi theo học'}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    name='ProvinceId'
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        placeholder='Chọn Tỉnh/TP'
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
                                        options={state.provinces}
                                        onChange={() => onChangeProvince()}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label={'Quận/Huyện nơi theo học'}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    name='DistrictId'
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        placeholder='Chọn'
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
                                        options={state.districts}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label={'Trường học'}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    name='SchoolId'
                                    rules={[{ required: true }]}
                                >
                                    <DebounceSelect
                                        // mode="multiple"
                                        showSearch
                                        allowClear
                                        placeholder="Chọn trường"
                                        fetchOptions={onGetSchoolDebounce}
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label={'Khối'}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    name='Block'
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        placeholder='Chọn'
                                        showSearch
                                        allowClear
                                        optionFilterProp='children'
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={state.blocks}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label={'Lớp'}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    name='Class'
                                    rules={[{ required: true }]}
                                >
                                    <Input
                                        placeholder='Nhập lớp'
                                        allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label={'Họ và tên bố'}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    name='FatherName'
                                    rules={[{ required: true }]}
                                >
                                    <Input
                                        placeholder='Nhập họ và tên bố'
                                        allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label={'Email nhận thông tin'}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    name='Email'
                                    rules={[
                                        { required: true },
                                        {
                                            type: 'email',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder='Nhập email'
                                        allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label={'Số điện thoại liên hệ'}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    name='Tel'
                                    rules={[{ required: true }]}
                                >
                                    <Input
                                        placeholder='Nhập số điện thoại liên hệ'
                                        allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label={'Họ và tên mẹ'}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    name='MotherName'
                                    rules={[{ required: true }]}
                                >
                                    <Input
                                        placeholder='Nhập họ và tên mẹ'
                                        allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label={'Địa chỉ gia đình'}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    name='Address'
                                >
                                    <Input
                                        placeholder='Nhập địa chỉ gia đình'
                                        allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    wrapperCol={{ span: 24 }}
                                    name='IsSelfRegistration'
                                    valuePropName='checked'
                                >
                                    <Checkbox>Thí sinh tự do</Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={16}>
                                <Form.Item
                                    wrapperCol={{ span: 24 }}
                                    name='IsUsedForCommunication'
                                    valuePropName='checked'
                                >
                                    <Checkbox>Đồng ý sử dụng hình ảnh cho mục đích truyền thông</Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label={'Ghi chú'}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    name='Note'
                                >
                                    <TextArea
                                        placeholder="Nhập ghi chú"
                                        autoSize={{ minRows: 2, maxRows: 6 }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                }


            </Card>


        </div>
    );
}

export default RegistrationTFC;
