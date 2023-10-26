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
    Tooltip,
    Typography,
    message
} from 'antd';
import { useEffect, useReducer, useRef, useState } from 'react';

import { Code } from '@/apis';
import { DivisionModel } from '@/apis/models/toefl-challenge/DivisionModel';
import { getAministrativeDivisions } from '@/apis/services/toefl-challenge/AministrativeDivisionsService';
import { postExam } from '@/apis/services/toefl-challenge/ExamService';
import {
    ConvertOptionSelectModel
} from '@/utils/convert';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { OptionModel, SelectOptionModel } from '@/@types/data';




function CompetitionCreateTFC() {
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


    useEffect(() => {
        const fnGetInitState = async () => {
            setLoading(true);
            const responseProvinces: ResponseData = await getAministrativeDivisions();
            // const responseDepartment: ResponseData = await getDepartment();

            const provinceOptions = ConvertOptionSelectModel(responseProvinces.data as OptionModel[]);
            // const departmentOptions = ConvertOptionSelectModel(responseDepartment.data as OptionModel[]);
            const stateDispatcher = {
                provinces: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(provinceOptions),
                divisions: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                }],
                schoolParents: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                }]
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

        const objBody: DivisionModel = {
            ...fieldsValue,
            ExamType: +fieldsValue.ExamType,
            Year: "" + moment(fieldsValue.Year).years()
        }
        // console.log(objBody)
        // return
        const response = await postExam(objBody);
        setButtonOkText('Lưu');
        setButtonLoading(false);
        if (response.code === Code._200) {
            message.success(response.message || "Tạo thành công")
            //redirect đến trang chỉnh sửa
            navigate(`/toefl-challenge/competition/edit/${response.data}`)
        }
        else {
            message.error(response.message || "Thất bại")
        }
    };
    const onChangeProvince = async () => {
        // const fieldsValue = await formRef.current?.getFieldsValue();
        // const responseDistricts: ResponseData = await getAministrativeDivisions1(fieldsValue.ProvinceId);
        // const dataDistricts = responseDistricts?.data as ProvinceModel
        // const districtOptions = ConvertOptionSelectModel(dataDistricts.districts as OptionModel[]);
        // const filter = {
        //     provinceId: fieldsValue.ProvinceId ? fieldsValue.ProvinceId : undefined,
        // }
        // const response: ResponseData = await getDepartment(
        //     JSON.stringify(filter)
        // );
        // const departmentOptions = ConvertOptionSelectModel(response.data as OptionModel[]);

        // const stateDispatcher = {
        //     departments: [{
        //         key: 'Default',
        //         label: '-Chọn-',
        //         value: '',
        //     }].concat(departmentOptions),
        //     districts: [{
        //         key: 'Default',
        //         label: '-Chọn-',
        //         value: '',
        //     }].concat(districtOptions),
        // }
        // dispatch(stateDispatcher)
    };

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
                            <Text strong>Thêm mới cuộc thi</Text>
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
                    <div style={{ margin: "0 20px" }}>
                        <Form
                            // form={searchForm}
                            ref={formRef}
                            name='nest-messages' id="myFormCreate"
                            onFinish={handleOk}
                            validateMessages={validateMessages}
                            initialValues={{
                                ["Name"]: '',
                                ["ProvinceId"]: '',
                                ['Year']: moment(new Date()),
                                ["Status"]: false,
                                ["ExamType"]: '',
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
                        </Form>
                    </div>
                }


            </Card>


        </div>
    );
}

export default CompetitionCreateTFC;
