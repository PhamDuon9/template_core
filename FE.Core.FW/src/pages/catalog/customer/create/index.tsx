import {
    Button,
    Card,
    Col,
    Form,
    FormInstance,
    Input,
    InputNumber,
    Popconfirm,
    Radio,
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

import { Code, ResponseData } from '@/apis';
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { OptionModel, SelectOptionModel } from '@/@types/data';
import { ConvertOptionSelectModel } from '@/utils/convert';
import dayjs from 'dayjs';
import { postCustomer } from '@/apis/services/CustomerService';
import { getCustomerGroup } from '@/apis/services/CustomerGroupService';
import { getCustomerType } from '@/apis/services/CustomerTypeService';
import { getAdministrativeUnitByParentId } from "@/apis/services/AdministrativeUnitService";
import { CustomerModel } from '@/apis/models/CustomerModel';
import { RepresentativeInfoModel } from '@/apis/models/RepresentativeInfo';
import EditableCell from './create';

const { TextArea } = Input;




function CustomerCreate() {
    const navigate = useNavigate();
    // Load
    const initState = {
        customerGroups: [],
        customerTypes: [],
        provinces: [],
        districts: [],
        wards: []
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
            const responseCustomerGroup: ResponseData = await getCustomerGroup();
            const responseCustomerType: ResponseData = await getCustomerType();
            const responseProvinces: ResponseData = await getAdministrativeUnitByParentId(undefined);
            const optionCustomerGroups = ConvertOptionSelectModel(responseCustomerGroup.data as OptionModel[]);
            const optionCustomerTypes = ConvertOptionSelectModel(responseCustomerType.data as OptionModel[]);
            const optionProvinces = ConvertOptionSelectModel(responseProvinces.data as OptionModel[]);
            const stateDispatcher = {
                customerGroups: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(optionCustomerGroups),
                customerTypes: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(optionCustomerTypes),
                provinces: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(optionProvinces),
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
    const [data, setData] = useState<RepresentativeInfoModel[]>([]);
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record: RepresentativeInfoModel) => record.id === editingKey;


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
        // const fieldsValue = await searchForm.validateFields();
        const fieldsValue = await formRef?.current?.validateFields();
        console.log(fieldsValue)
        setButtonOkText('Đang xử lý...');
        setButtonLoading(true);
        // setConfirmLoading(true);
        // searchForm.resetFields()

        const objBody: CustomerModel = {
            ...fieldsValue,
        }

        const response = await postCustomer("", objBody);
        setButtonOkText('Lưu');
        setButtonLoading(false);
        if (response.code === Code._200) {
            message.success(response.message || "Tạo thành công")
            //redirect đến trang chỉnh sửa
            navigate(`/catalog/customer`)
        }
        else {
            message.error(response.message || "Thất bại")
        }
    };

    const onChangeProvince = async () => {
        const fieldsValue = await formRef.current?.getFieldsValue();
        // formRef.current?.setFieldsValue({
        //     "DistrictId": '',
        // })
        if (!fieldsValue.ProvinceId) {
            const stateDispatcher = {
                districts: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                }],
                wards: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                }],
            }
            dispatch(stateDispatcher)
        }
        const responseDistricts: ResponseData = await getAdministrativeUnitByParentId(fieldsValue.ProvinceId);
        const districtOptions = ConvertOptionSelectModel(responseDistricts.data as OptionModel[]);
        const stateDispatcher = {
            districts: [{
                key: 'Default',
                label: '-Chọn-',
                value: '',
            } as SelectOptionModel].concat(districtOptions),
        }
        dispatch(stateDispatcher)

    };
    console.log(state.districts)
    const onChangeDistrict = async () => {
        const fieldsValue = await formRef.current?.getFieldsValue();
        // formRef.current?.setFieldsValue({
        //     "DistrictId": '',
        // })
        if (!fieldsValue.DistrictId) {
            const stateDispatcher = {
                wards: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                }],
            }
            dispatch(stateDispatcher)
        }
        const responseWards: ResponseData = await getAdministrativeUnitByParentId(fieldsValue.DistrictId);
        console.log(responseWards)
        const wardsOptions = ConvertOptionSelectModel(responseWards.data as OptionModel[]);
        const stateDispatcher = {
            wards: [{
                key: 'Default',
                label: '-Chọn-',
                value: '',
            } as SelectOptionModel].concat(wardsOptions),
        }
        dispatch(stateDispatcher)

    };
    console.log(state.wards)
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
    }

    const handleAdd = () => {
        console.log(uuidv4())
        const newData: RepresentativeInfoModel = {
            // key: count,
            id: uuidv4(),
            name: ``,
            jobTitle: '',
            tel: ``,
            email: ``,
            description: ``
        };
        setData([...data, newData]);
    };

    const saveRow = async (id: string) => {
        try {
            const row = (await form.validateFields()) as RepresentativeInfoModel;

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

    const cancel = () => {
        setEditingKey('');
    };

    const edit = (record: Partial<RepresentativeInfoModel>) => {
        form.setFieldsValue({ name: '', jobTitle: '', email: '', tel: '', description: '', ...record });
        setEditingKey(record.id as string);
    };

    const handleDelete = (id: string) => {
        const newData = data.filter((item) => item.id !== id);
        setData(newData);
    };

    const columns = [
        {
            title: 'Họ tên',
            dataIndex: 'name',
            width: '20%',
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
            width: '20%',
            editable: true,
        },
        {
            title: 'Ghi chú',
            dataIndex: 'description',
            width: '25%',
            editable: true,
        },
        {
            title: 'Thao tác',
            render: (_: any, record: RepresentativeInfoModel) => {
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
            onCell: (record: RepresentativeInfoModel) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <div className='layout-main-content'>
            <Card
                bordered={false}
                title={
                    <>
                        <Space className="title">
                            <Tooltip title="Quay lại">
                                <Button type="text" shape='circle' onClick={() => navigate('/catalog/customer')}>
                                    <ArrowLeftOutlined />
                                </Button>
                            </Tooltip>
                            <Text strong>Thêm mới khách hàng</Text>
                        </Space>
                    </>
                }
                extra={
                    <Space align='center'>
                        <Button type="default" onClick={() => navigate('/catalog/customer')}>
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
                            ["Code"]:'',
                            ["Name"]: '',
                            ["AbbreviationsName"]:'',
                            ["TaxCode"]:'',
                            ["ProvinceId"]:'',
                            ["DistrictId"]:'',
                            ["WardId"]:'',
                            ["Address"]:'',
                            ["Website"]:'',
                            ["Email"]:'',
                            ["PhoneNumber"]:'',
                            ["Field"]:'',
                            ["Type"]:'',
                            ["CustomerGroupId"]:'',
                            ["CustomerTypeId"]:'',
                            ["Description"]:'',
                            ["STK"]:'',
                            ["EstablishDate"]:'',
                            ["Revenue"]:'',
                            ["NumberOfDaysOwed"]:'',
                            ["BankName"]:'',
                            ["CustomerResources"]:'',
                            ["Scale"]:'',
                            ["DebtLimit"]:'',
                            ["StatusCooperation"]:'',
                            ["MOU"]:'',
                            ["MOUPeriod"]:'',
                            ["OtherCooperation"]:'',
                            ["CoordinatingAgent"]:'',
                            ["CooperationField"]:'',
                            ["Service"]:'',
                            ["Frequency"]:'',
                            ["DescriptionCooperate"]:''
                        }}
                    >
                        <Title level={3}>Thông tin chung</Title>
                        <Row gutter={16} justify='start'>
                            <Col span={12}>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item label={'Mã khách hàng'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Code' >
                                            <Input allowClear defaultValue={"KH-" + dayjs().format('YYYYMMDDHHmmss')} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Tên đơn vị'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Name' >
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Tên viết tắt'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='AbbreviationsName' >
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Mã số thuế'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='TaxCode' >
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={'Tỉnh/Thành phố'}
                                            labelCol={{ span: 12 }}
                                            wrapperCol={{ span: 12 }}
                                            name='ProvinceId'
                                        >
                                            <Select
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                                // filterSort={(optionA, optionB) =>
                                                //     (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                                // }
                                                placeholder='-Chọn-' options={state.provinces} onChange={() => onChangeProvince()} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={'Quận/Huyện'}
                                            labelCol={{ span: 12 }}
                                            wrapperCol={{ span: 12 }}
                                            name='DistrictId'
                                            rules={[{ /**required: true**/ }]}
                                        >
                                            <Select
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                                // filterSort={(optionA, optionB) =>
                                                //     (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                                // }
                                                placeholder='-Chọn-' options={state.districts} onChange={() => onChangeDistrict()} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={'Phường/Xã'}
                                            labelCol={{ span: 12 }}
                                            wrapperCol={{ span: 12 }}
                                            name='WardId'
                                            rules={[{ /**required: true**/ }]}
                                        >
                                            <Select
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                                // filterSort={(optionA, optionB) =>
                                                //     (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                                // }
                                                placeholder='-Chọn-' options={state.wards} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Địa chỉ'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Address' >
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Website'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Website' >
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Email'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Email' >
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Số điện thoại'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='PhoneNumber' >
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item label={'Lĩnh vực'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Field' >
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label={'Loại KH'}
                                            labelCol={{ span: 6 }}
                                            wrapperCol={{ span: 24 }}
                                            name='Type'
                                            rules={[{ /**required: true**/ }]}
                                        >
                                            <Radio.Group>
                                                <Radio value="0"> Khách hàng chung </Radio>
                                                <Radio value="1"> Khách hàng cá nhân </Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label={'Phân loại KH'}
                                            labelCol={{ span: 6 }}
                                            wrapperCol={{ span: 24 }}
                                            name='CustomerGroupId'
                                            rules={[{ /**required: true**/ }]}
                                        >
                                            <Select
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                                // filterSort={(optionA, optionB) =>
                                                //     (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                                // }
                                                placeholder='-Chọn-' options={state.customerGroups} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label={'Loại hình KH'}
                                            labelCol={{ span: 6 }}
                                            wrapperCol={{ span: 24 }}
                                            name='CustomerTypeId'
                                        >
                                            <Select
                                                showSearch
                                                allowClear
                                                mode="multiple"
                                                optionFilterProp="children"
                                                filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                                // filterSort={(optionA, optionB) =>
                                                //     (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                                // }
                                                placeholder='-Chọn-' options={state.customerTypes} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Mô tả'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Description'>
                                            <TextArea autoSize={{ minRows: 3, maxRows: 5 }} allowClear />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Title level={3}>Thông tin liên hệ đại diện</Title>

                        {/* <Form form={form} component={false}> */}
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
                        {/* </Form> */}

                        <Title level={3}>Thông tin bổ sung</Title>
                        <Row gutter={16} justify='start'>
                            <Col span={12}>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item label={'Số tài khoản'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='STK' >
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Ngày thành lập'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='EstablishDate' >
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Doanh thu'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Revenue' >
                                            <InputNumber style={{ width: '100%' }} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(value) => value!.replace(/\$\s?|(,*)/g, '')} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Số ngày được nợ'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='NumberOfDaysOwed'>
                                            <InputNumber style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item label={'Mở tại ngân hàng'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='BankName' >
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Nguồn khách hàng'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='CustomerResources' >
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Quy mô nhân sự'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Scale' >
                                        <InputNumber style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Hạn mức nợ'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='DebtLimit' >
                                        <InputNumber style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Title level={3}>Thông tin hợp tác</Title>
                        <Row gutter={16} justify='start'>
                            <Col span={12}>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item
                                            label={'Tình trạng'}
                                            labelCol={{ span: 6 }}
                                            wrapperCol={{ span: 24 }}
                                            name='StatusCooperation'
                                            rules={[{ /**required: true**/ }]}
                                        >
                                            <Select
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                                // filterSort={(optionA, optionB) =>
                                                //     (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                                // }
                                                placeholder='-Chọn-' options={state.productCategories} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label={'Ký MOU'}
                                            labelCol={{ span: 6 }}
                                            wrapperCol={{ span: 24 }}
                                            name='MOU'
                                            rules={[{ /**required: true**/ }]}
                                        >
                                            <Radio.Group>
                                                <Radio value="0"> Đã ký </Radio>
                                                <Radio value="1"> Chưa ký </Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Thời hạn MOU'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='MOUPeriod' >
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Các hợp tác khác'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='OtherCooperation' >
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Đại lý phối hợp(nếu có)'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='CoordinatingAgent' >
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item label={'Lĩnh vực hợp tác'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='CooperationField' >
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Sản phẩm, dịch vụ'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Service' >
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Tần suất sử dụng'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Frequency' >
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Ghi chú'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='DescriptionCooperate'>
                                            <TextArea autoSize={{ minRows: 3, maxRows: 5 }} allowClear />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                    </Form>
                }
            </Card>
        </div>
    );
}

export default CustomerCreate;

//<Title level={3}>Thông tin đặc thù(Sở/Phòng GD)</Title>
//                        <Row gutter={16} justify='start'>
//                            <Col span={12}>
//                                <Row>
//                                   <Col span={24}>
//                                        <Form.Item label={'Số trường tiểu học'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' >
//                                            <InputNumber style={{ width: '100%' }} />
//                                        </Form.Item>
//                                    </Col>
//                                    <Col span={24}>
//                                        <Form.Item label={'Số trường THCS'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' >
//                                            <Input allowClear />
//                                        </Form.Item>
//                                    </Col>
//                                    <Col span={24}>
//                                        <Form.Item label={'Số trường THPT'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' >
//                                            <Input allowClear />
//                                        </Form.Item>
//                                   </Col>
//                                    <Col span={24}>
//                                        <Form.Item label={'Chính sách...'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' >
//                                            <Input allowClear />
//                                        </Form.Item>
//                                    </Col>
//                                </Row>
//                            </Col>
//                            <Col span={12}>
//                                <Row>
//                                    <Col span={24}>
//                                        <Form.Item label={'Thông tin thêm 1'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' >
//                                            <Input allowClear />
//                                        </Form.Item>
//                                    </Col>
//                                    <Col span={24}>
//                                        <Form.Item label={'Thông tin thêm 2'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' >
//                                            <Input allowClear />
//                                        </Form.Item>
//                                    </Col>
//                                    <Col span={24}>
//                                        <Form.Item label={'Thông tin thêm 3'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' >
//                                            <Input allowClear />
//                                        </Form.Item>
//                                    </Col>
//                                    <Col span={24}>
//                                        <Form.Item label={'Thông tin thêm 4'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' >
//                                            <Input allowClear />
//                                        </Form.Item>
//                                   </Col>
//                                </Row>
//                            </Col>
//                        </Row>
