import { ResponseData } from '@/utils/request';
import {
    Button,
    Card,
    Checkbox,
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
    TreeSelect,
    Typography,
    message
} from 'antd';
import { useEffect, useReducer, useRef, useState } from 'react';

import { Code, DepartmentModel } from '@/apis';
import {
    ConvertOptionSelectModel
} from '@/utils/convert';
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import EditableCell from './create';
import { OptionModel, SelectOptionModel } from '@/@types/data';
import { getBranch } from '@/apis/services/BranchService';
import { getDepartment, getDepartment2, postDepartment } from '@/apis/services/DepartmentService';




function DepartmentCreate() {
    const navigate = useNavigate();
    // Load
    const initState = {
        branches: [],
        departments: [],
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
            const response: ResponseData = await getBranch();
            const options = ConvertOptionSelectModel(response.data as OptionModel[]);

            const responseDepartment: ResponseData = await getDepartment2();
            const stateDispatcher = {
                branches: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(options),
                departments: responseDepartment.data,
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
        // const fieldsValue = await searchForm.validateFields();
        const fieldsValue = await formRef?.current?.validateFields();
        setButtonOkText('Đang xử lý...');
        setButtonLoading(true);
        // setConfirmLoading(true);
        // searchForm.resetFields()

        const objBody: DepartmentModel = {
            ...fieldsValue,
            ParentId: fieldsValue.ParentId ? fieldsValue.ParentId : undefined
        }
        console.log(objBody)

        const response = await postDepartment("", objBody);
        setButtonOkText('Lưu');
        setButtonLoading(false);
        if (response.code === Code._200) {
            message.success(response.message || "Tạo thành công")
            //redirect đến trang chỉnh sửa
            navigate(`/catalog/department`)
        }
        else {
            message.error(response.message || "Thất bại")
        }
    };
    const onChangeBranch = async () => {
        // const fieldsValue = await formRef.current?.getFieldsValue();
        // formRef.current?.setFieldsValue({
        //     "ParentId": '',
        // })

        // const filter = {
        //     BranchId: fieldsValue.BranchId ? fieldsValue.BranchId : undefined,
        // }

        // const responseDepartment: ResponseData = await getDepartment(JSON.stringify(filter));
        // const optionDepartment = ConvertOptionSelectModel(responseDepartment.data as OptionModel[]);
        // const stateDispatcher = {
        //     departments: [{
        //         key: 'Default',
        //         label: '-Chọn-',
        //         value: '',
        //     } as SelectOptionModel].concat(optionDepartment),
        // };
        // dispatch(stateDispatcher);
    };

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
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
                                <Button type="text" shape='circle' onClick={() => navigate('/catalog/department')}>
                                    <ArrowLeftOutlined />
                                </Button>
                            </Tooltip>
                            <Text strong>Thêm mới phòng ban</Text>
                        </Space>
                    </>
                }
                extra={
                    <Space>
                        <Button type="dashed" onClick={() => navigate('/catalog/department')}>
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
                            ["Name"]: '',
                        }}
                    >
                        <Row gutter={16} justify='start'>
                            <Col span={12}>
                                <Form.Item label={'Mã phòng ban'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Code' rules={[{ required: true, whitespace: true }]}>
                                    <Input placeholder='Nhập mã phòng ban' allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={'Tên phòng ban'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Name' rules={[{ required: true, whitespace: true }]}>
                                    <Input placeholder='Nhập tên phòng ban' allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={'Mô tả'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Description'>
                                    <Input placeholder='Nhập mô tả' allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={' '} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='IsCom' valuePropName="checked">
                                    <Checkbox>Tính hoa hồng</Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={'Chi nhánh'}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    name='BranchId'
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                        // filterSort={(optionA, optionB) =>
                                        //     (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                        // }
                                        placeholder='-Chọn-' options={state.branches} onChange={() => onChangeBranch()} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={'Phòng ban cha'}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    name='ParentId'
                                >
                                    <TreeSelect
                                        showSearch
                                        treeLine
                                        style={{ width: '100%' }}
                                        // value={value}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        placeholder="-Chọn phòng ban-"
                                        allowClear
                                        treeDefaultExpandAll
                                        showCheckedStrategy={TreeSelect.SHOW_CHILD}
                                        treeData={state.departments}
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

export default DepartmentCreate;
