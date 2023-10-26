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
import { getDivisionId, putDivision } from '@/apis/services/toefl-challenge/DivisionService';
import {
    ConvertOptionSelectModel
} from '@/utils/convert';
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import EditableCell from './edit';
import { OptionModel, SelectOptionModel } from '@/@types/data';




function EditDivisionTFC() {
    const navigate = useNavigate();
    const params = useParams()
    console.log(params);
    // Load
    const initState = {
        provinces: [],
        districts: [],
        departments: [],
        divisionEdit: {}
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
            const responseDivision: ResponseData = await getDivisionId(params.id);
            const responseData: DivisionModel = responseDivision.data as DivisionModel;
            const filter = {
                provinceId: responseData.provinceId,
            }
            const responseProvinces: ResponseData = await getAministrativeDivisions();
            const responseDepartment: ResponseData = await getDepartment(JSON.stringify(filter));
            const responseDistricts: ResponseData = await getAministrativeDivisions1(responseData.provinceId as string);
            const dataDistricts = responseDistricts.data as ProvinceModel;
            setData(responseData.piCs as PICModel[])
            const provinceOptions = ConvertOptionSelectModel(responseProvinces.data as OptionModel[]);
            const departmentOptions = ConvertOptionSelectModel(responseDepartment.data as OptionModel[]);
            const districtOptions = ConvertOptionSelectModel(dataDistricts.districts as OptionModel[]);
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
                } as SelectOptionModel].concat(districtOptions),
                divisionEdit: responseDivision.data
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

        const objBody: DivisionModel = {
            ...fieldsValue,
            piCs: fieldsValueTable
        }
        console.log(objBody)

        const response = await putDivision(params.id, objBody);
        setButtonOkText('Lưu');
        setButtonLoading(false);
        if (response.code === Code._200) {
            message.success(response.message || "Cập nhật thành công")
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
        })
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

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
    }

    ////
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
            title: 'Thao tác',
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
                                <Button type="text" shape='circle' onClick={() => navigate('/toefl-challenge/division')}>
                                    <ArrowLeftOutlined />
                                </Button>
                            </Tooltip>
                            <Text strong>Cập nhật phòng giáo dục</Text>
                        </Space>
                    </>
                }
                extra={
                    <Space>
                        <Button type="dashed" onClick={() => navigate('/toefl-challenge/division')}>
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
                            ["Name"]: state.divisionEdit?.name ?? '',
                            ["ProvinceId"]: state.divisionEdit?.provinceId ?? '',
                            ["DistrictId"]: state.divisionEdit?.districtId ?? '',
                            ["DepartmentId"]: state.divisionEdit?.departmentId ?? '',
                        }}
                    >
                        <Row gutter={16} justify='start'>
                            <Col span={12}>
                                <Form.Item label={'Tên phòng giáo dục'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Name' rules={[{ required: true, whitespace: true }]}>
                                    <Input placeholder='Nhập tên phòng giáo dục' allowClear />
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
                                        placeholder='Chọn Quận/Huyện' options={state.districts} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={'Sở giáo dục'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='DepartmentId' rules={[{ required: true }]}>
                                    <Select
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                        }
                                        placeholder='Chọn sở giáo dục' options={state.departments} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider orientation="left" plain>
                            Thông tin liên hệ phòng giáo dục
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
                }


            </Card>


        </div>
    );
}

export default EditDivisionTFC;
