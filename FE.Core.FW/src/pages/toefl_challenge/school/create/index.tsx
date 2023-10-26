import { ResponseData } from '@/utils/request';
import {
    Button,
    Card,
    Col,
    Divider,
    Form,
    FormInstance,
    Input,
    Popconfirm,
    Row,
    Select,
    Space,
    Spin,
    Table,
    Tooltip,
    Typography,
    message
} from 'antd';
import { useEffect, useReducer, useRef, useState } from 'react';

import { Code } from '@/apis';
import { DivisionModel } from '@/apis/models/toefl-challenge/DivisionModel';
import { PICModel } from '@/apis/models/toefl-challenge/PICModel';
import { ProvinceModel } from '@/apis/models/toefl-challenge/ProvinceModel';
import { getAministrativeDivisions, getAministrativeDivisions1 } from '@/apis/services/toefl-challenge/AministrativeDivisionsService';
import { getDepartment } from '@/apis/services/toefl-challenge/DepartmentService';
import { getDivision } from '@/apis/services/toefl-challenge/DivisionService';
import { getSchool, postSchool } from '@/apis/services/toefl-challenge/SchoolService';
import {
    ConvertOptionSelectModel
} from '@/utils/convert';
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import EditableCell from './create';
import { OptionModel, SelectOptionModel } from '@/@types/data';




function CreateSchoolTFC() {
    const navigate = useNavigate();
    // Load
    const initState = {
        schoolParents: [],
        provinces: [],
        districts: [],
        departments: [],
        divisions: [],
        schoolEdit: {},
        schoolTypes: [
            {
                value: 0,
                label: "Primary",
                key: 0,
            },
            {
                value: 1,
                label: "Secondary",
                key: 1,
            },
            {
                value: 2,
                label: "High",
                key: 2,
            },
            {
                value: 3,
                label: "InterLevel",
                key: 3,
            }
        ],
        institutionTypes: [
            {
                value: 0,
                label: "Công lập",
                key: 0,
            },
            {
                value: 1,
                label: "Tư thục",
                key: 1,
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
            const responseDepartment: ResponseData = await getDepartment();

            const provinceOptions = ConvertOptionSelectModel(responseProvinces.data as OptionModel[]);
            const departmentOptions = ConvertOptionSelectModel(responseDepartment.data as OptionModel[]);
            const stateDispatcher = {
                provinces: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(provinceOptions),
                departments: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(departmentOptions),
                districts: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                }],
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
        // const fieldsValue = await searchForm.validateFields();
        const fieldsValue = await formRef?.current?.validateFields();
        const fieldsValueTable = [...data];
        setButtonOkText('Đang xử lý...');
        setButtonLoading(true);
        // setConfirmLoading(true);
        // searchForm.resetFields()

        const objBody: DivisionModel = {
            ...fieldsValue,
            DepartmentId: fieldsValue.DepartmentId ? fieldsValue.DepartmentId : undefined,
            DivisionId: fieldsValue.DivisionId ? fieldsValue.DivisionId : undefined,
            piCs: fieldsValueTable,
            ParentId: fieldsValue.ParentId ? fieldsValue.ParentId : undefined
        }
        console.log(objBody)

        const response = await postSchool(objBody);
        setButtonOkText('Lưu');
        setButtonLoading(false);
        if (response.code === Code._200) {
            message.success(response.message || "Tạo thành công")
            //redirect đến trang chỉnh sửa
            navigate(`/toefl-challenge/school/edit/${response.data}`)
        }
        else {
            message.error(response.message || "Thất bại")
        }
    };
    const onChangeProvince = async () => {
        const fieldsValue = await formRef.current?.getFieldsValue();
        formRef.current?.setFieldsValue({
            "DistrictId": '',
            "DepartmentId": '',
            "DivisionId": '',
            "ParentId": '',
        })
        if (!fieldsValue.ProvinceId) {
            const stateDispatcher = {
                departments: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                }],
                districts: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                }],
                schoolParents: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                }],
            }
            dispatch(stateDispatcher)
        }
        const responseDistricts: ResponseData = await getAministrativeDivisions1(fieldsValue.ProvinceId);
        const dataDistricts = responseDistricts?.data as ProvinceModel
        const districtOptions = ConvertOptionSelectModel(dataDistricts.districts as OptionModel[]);
        const filter = {
            provinceId: fieldsValue.ProvinceId ? fieldsValue.ProvinceId : undefined,
        }
        const response: ResponseData = await getDepartment(
            JSON.stringify(filter)
        );


        const filterSchool = {
            provinceId: fieldsValue.ProvinceId ? fieldsValue.ProvinceId : undefined,
        }
        const responseSchool: ResponseData = await getSchool(
            JSON.stringify(filterSchool)
        );
        const schoolOptions = ConvertOptionSelectModel(responseSchool.data as OptionModel[]);

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
            schoolParents: [{
                key: 'Default',
                label: '-Chọn-',
                value: '',
            } as SelectOptionModel].concat(schoolOptions),
        }
        dispatch(stateDispatcher)
    };

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
    }
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
    const onChangeDivision = async () => {
        // const fieldsValue = await formRef.current?.getFieldsValue();

        // const filter = {
        //     provinceId: fieldsValue.ProvinceId ? fieldsValue.ProvinceId : undefined,
        //     districtId: fieldsValue.DistrictId ? fieldsValue.DistrictId : undefined,
        // }
        // const response: ResponseData = await getSchool(
        //     JSON.stringify(filter)
        // );
        // const schoolOptions = ConvertOptionSelectModel(response.data as OptionModel[]);

        // const stateDispatcher = {
        //     schoolParents: [{
        //         key: 'Default',
        //         label: '-Chọn-',
        //         value: '',
        //     }].concat(schoolOptions),
        // }
        // dispatch(stateDispatcher)
    };

    const onChangeDistrict = async () => {
        const fieldsValue = await formRef.current?.getFieldsValue();
        formRef.current?.setFieldsValue({
            "ParentId": '',
        })
        const filter = {
            provinceId: fieldsValue.ProvinceId ? fieldsValue.ProvinceId : undefined,
            districtId: fieldsValue.DistrictId ? fieldsValue.DistrictId : undefined,
        }
        const response: ResponseData = await getSchool(
            JSON.stringify(filter)
        );
        const schoolOptions = ConvertOptionSelectModel(response.data as OptionModel[]);

        const stateDispatcher = {
            schoolParents: [{
                key: 'Default',
                label: '-Chọn-',
                value: '',
            } as SelectOptionModel].concat(schoolOptions),
        }
        dispatch(stateDispatcher)
    };
    const [data, setData] = useState<PICModel[]>([]);
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record: PICModel) => record.id === editingKey;

    const edit = (record: Partial<PICModel>) => {
        form.setFieldsValue({ name: '', jobTitle: '', email: '', tel: '', ...record });
        setEditingKey(record.id as string);
    };

    const cancel = () => {
        setEditingKey('');
    };
    const saveRow = async (id: string) => {
        try {
            const row = (await form.validateFields()) as PICModel;

            const newData = [...data];
            const index = newData.findIndex((item) => id === item.id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const handleDelete = (id: string) => {
        const newData = data.filter((item) => item.id !== id);
        setData(newData);
    };
    const columns = [
        {
            title: 'Họ tên',
            dataIndex: 'name',
            width: '25%',
            editable: true,
        },
        {
            title: 'Chức vụ',
            dataIndex: 'jobTitle',
            width: '15%',
            editable: true,
        },
        {
            title: 'SĐT',
            dataIndex: 'tel',
            width: '15%',
            editable: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: '25%',
            editable: true,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_: any, record: PICModel) => {
                const editable = isEditing(record);
                return editable ? (
                    <Space>
                        <Typography.Link onClick={() => saveRow(record.id as string)} style={{ marginRight: 8 }}>
                            <Button type='dashed'>Lưu</Button>
                        </Typography.Link>
                        <Popconfirm title="Những thay đổi bạn đã thực hiện có thể không được lưu" onConfirm={cancel}>
                            <Button type='text' danger>Hủy bỏ</Button>
                        </Popconfirm>
                    </Space>
                ) : (
                    <Space>
                        <Typography.Link title='Chỉnh sửa' disabled={editingKey !== ''} onClick={() => edit(record)}>
                            <Button type='text'>
                                <EditOutlined />
                            </Button>
                        </Typography.Link>
                        <Typography.Link title='Chỉnh sửa' disabled={editingKey !== ''} onClick={() => handleDelete(record.id as string)}>
                            <Button type='text' danger>
                                <DeleteOutlined />
                            </Button>
                        </Typography.Link>
                    </Space>

                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: PICModel) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const handleAdd = () => {
        console.log(uuidv4())
        const newData: PICModel = {
            // key: count,
            id: uuidv4(),
            name: ``,
            jobTitle: '',
            email: ``,
            tel: ``,
        };
        setData([...data, newData]);
    };
    return (
        <div className='layout-main-content'>
            <Card
                bordered={false}
                title={
                    <>
                        <Space className="title">
                            <Tooltip title="Quay lại">
                                <Button type="text" shape='circle' onClick={() => navigate('/toefl-challenge/school')}>
                                    <ArrowLeftOutlined />
                                </Button>
                            </Tooltip>
                            <Text strong>Thêm mới trường học</Text>
                        </Space>
                    </>
                }
                extra={
                    <Space>
                        <Button type="dashed" onClick={() => navigate('/toefl-challenge/school')}>
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
                                ["Code"]: '',
                                ["Name"]: '',
                                ["ProvinceId"]: '',
                                ["DistrictId"]: '',
                                ["DepartmentId"]: '',
                                ["SchoolType"]: '',
                                ["InstitutionType"]: '',
                                ["DivisionId"]: '',
                                ["ParentId"]: '',
                            }}
                        >
                            <Row gutter={16} justify='start'>
                                <Col span={12}>
                                    <Form.Item label={'Mã trường'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Code' rules={[{ required: true }]}>
                                        <Input placeholder='Nhập mã trường học' allowClear />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={'Tên trường'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Name' rules={[{ required: true }]}>
                                        <Input placeholder='Nhập tên trường học' allowClear />
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
                                    <Form.Item label={'Quận/Huyện'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='DistrictId' rules={[{ required: true }]}>
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                            }
                                            placeholder='Chọn Quận/Huyện' options={state.districts} onChange={onChangeDistrict} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={'Sở giáo dục'}
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        name='DepartmentId'
                                    >
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                            }
                                            placeholder='-Chọn-' options={state.departments} onChange={() => onChangeDepartment()} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={'Phòng giáo dục'}
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        name='DivisionId'
                                    >
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                            }
                                            placeholder='Chọn Tỉnh/TP' options={state.divisions} onChange={() => onChangeDivision()} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={'Thuộc trường học'}
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        name='ParentId'
                                    >
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                            }
                                            placeholder='Chọn trường học' options={state.schoolParents} />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item label={'Loại hình'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='InstitutionType' rules={[{ required: true }]}>
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                            }
                                            placeholder='Chọn loại hình' options={state.institutionTypes} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={'Loại trường'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='SchoolType' rules={[{ required: true }]}>
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                            }
                                            placeholder='Chọn loại trường' options={state.schoolTypes} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={'Ghi chú'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Description'>
                                        <Input placeholder='Nhập ghi chú' allowClear />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider orientation="left" plain>
                                Thông tin liên hệ của trường
                            </Divider>
                            <Form form={form} component={false}>
                                <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
                                    Thêm dòng
                                </Button>
                                <Table
                                    components={{
                                        body: {
                                            cell: EditableCell,
                                        },
                                    }}
                                    bordered
                                    dataSource={data}
                                    columns={mergedColumns}
                                    rowClassName="editable-row"
                                    pagination={{
                                        onChange: cancel,
                                    }}
                                />
                            </Form>
                        </Form>
                    </div>
                }


            </Card>


        </div>
    );
}

export default CreateSchoolTFC;
