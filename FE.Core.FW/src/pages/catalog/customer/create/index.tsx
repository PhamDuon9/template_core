import {
    Button,
    Card,
    Col,
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
import { useEffect, useReducer, useRef, useState } from 'react';

import { Code, ResponseData } from '@/apis';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { OptionModel, SelectOptionModel } from '@/@types/data';
import { ConvertOptionSelectModel } from '@/utils/convert';
import { getProductCategory } from '@/apis/services/ProductCategoryService';
import { ProductTypeModel } from '@/apis/models/ProductTypeModel';
import { getProductType, postProductType } from '@/apis/services/ProductTypeService';
import { postCustomer } from '@/apis/services/CustomerService';

const { TextArea } = Input;




function CustomerCreate() {
    const navigate = useNavigate();
    // Load
    const initState = {
        productCategories: [],
        productTypes: [],
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
            const responseProductCategory: ResponseData = await getProductCategory();
            const responseProductType: ResponseData = await getProductType();

            const optionProductCategores = ConvertOptionSelectModel(responseProductCategory.data as OptionModel[]);
            const optionProductTypes = ConvertOptionSelectModel(responseProductType.data as OptionModel[]);
            const stateDispatcher = {
                productCategories: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(optionProductCategores),
                productTypes: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(optionProductTypes),
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
        console.log(fieldsValue)
        setButtonOkText('Đang xử lý...');
        setButtonLoading(true);
        // setConfirmLoading(true);
        // searchForm.resetFields()

        const objBody: ProductTypeModel = {
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

    const onChangeProductCategory = async () => {
        const fieldsValue = await formRef.current?.getFieldsValue();
        formRef.current?.setFieldsValue({
            "ProductTypeId": '',
        })
        const filter = {
            ProductCategoryId: fieldsValue.ProductCategoryId ? fieldsValue.ProductCategoryId : undefined,
        }
        if (!fieldsValue.ProductCategoryId) {
            const stateDispatcher = {
                productTypes: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                }],
            }
            dispatch(stateDispatcher)
            return
        }
        const response: ResponseData = await getProductType(JSON.stringify(filter));

        const options = ConvertOptionSelectModel(response.data as OptionModel[]);
        const stateDispatcher = {
            productTypes: [{
                key: 'Default',
                label: '-Chọn-',
                value: '',
            } as SelectOptionModel].concat(options),
        };
        dispatch(stateDispatcher);
    }

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
                            ["Name"]: '',
                        }}
                    >
                        <Title level={3}>Thông tin chung</Title>
                        <Row gutter={16} justify='start'>
                            <Col span={12}>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item label={'Mã khách hàng'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Code' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Tên đơn vị'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='DepartmentName' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Tên viết tắt'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='AbbreviationsName' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Mã số thuế'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='TaxCode' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Địa chỉ'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Address' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={'Phường/Xã'}
                                            labelCol={{ span: 12 }}
                                            wrapperCol={{ span: 12 }}
                                            name='ProductTypeId'
                                            rules={[{ /**required: true**/ }]}
                                        >
                                            <Select
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                                // filterSort={(optionA, optionB) =>
                                                //     (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                                // }
                                                placeholder='-Chọn-' options={state.productTypes} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={'Quận/Huyện'}
                                            labelCol={{ span: 12 }}
                                            wrapperCol={{ span: 12 }}
                                            name='ProductTypeId'
                                            rules={[{ /**required: true**/ }]}
                                        >
                                            <Select
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                                // filterSort={(optionA, optionB) =>
                                                //     (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                                // }
                                                placeholder='-Chọn-' options={state.productTypes} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={'Tỉnh/Thành phố'}
                                            labelCol={{ span: 12 }}
                                            wrapperCol={{ span: 12 }}
                                            name='ProductTypeId'
                                            rules={[{ /**required: true**/ }]}
                                        >
                                            <Select
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                                // filterSort={(optionA, optionB) =>
                                                //     (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                                // }
                                                placeholder='-Chọn-' options={state.productTypes} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={'Khu vực'}
                                            labelCol={{ span: 12 }}
                                            wrapperCol={{ span: 12 }}
                                            name='ProductTypeId'
                                            rules={[{ /**required: true**/ }]}
                                        >
                                            <Select
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                                // filterSort={(optionA, optionB) =>
                                                //     (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                                // }
                                                placeholder='-Chọn-' options={state.productTypes} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Website'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Website' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Quy mô'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Website' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Email'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Email' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Số điện thoại'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='PhoneNumber' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item label={'Lĩnh vực'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Field' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label={'Phân loại khách hàng'}
                                            labelCol={{ span: 6 }}
                                            wrapperCol={{ span: 24 }}
                                            name='CustomerTypeId'
                                            rules={[{ /**required: true**/ }]}
                                        >
                                            <Select
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                                // filterSort={(optionA, optionB) =>
                                                //     (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                                // }
                                                placeholder='-Chọn-' options={state.productCategories} onChange={onChangeProductCategory} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Loại hình'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
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
                        <Row gutter={16} justify='start'>
                            <Col span={12}>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item label={'Họ và tên'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Chức vụ'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Điện thoai'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Email'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Ghi chú(nếu có)'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Description'>
                                            <TextArea autoSize={{ minRows: 3, maxRows: 5 }} allowClear />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Title level={3}>Thông tin bổ sung</Title>
                        <Row gutter={16} justify='start'>
                            <Col span={12}>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item label={'Số tài khoản'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Ngày thành lập'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Doanh thu'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Số ngày được nợ'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item label={'Mở tại ngân hàng'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Là khách hàng từ'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Quy mô nhân sự'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Hạn mức nợ'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
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
                                            name=''
                                            rules={[{ /**required: true**/ }]}
                                        >
                                            <Select
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                                // filterSort={(optionA, optionB) =>
                                                //     (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                                // }
                                                placeholder='-Chọn-' options={state.productCategories} onChange={onChangeProductCategory} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label={'Ký MOU'}
                                            labelCol={{ span: 6 }}
                                            wrapperCol={{ span: 24 }}
                                            name='b'
                                            rules={[{ /**required: true**/ }]}
                                        >
                                            <Radio.Group>
                                                <Radio value="0"> Đã ký </Radio>
                                                <Radio value="1"> Chưa ký </Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Thời hạn MOU'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Các hợp tác khác'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Đại lý phối hợp(nếu có)'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item label={'Lĩnh vực hợp tác'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Sản phẩm, dịch vụ'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Tần suất sử dụng'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Ghi chú'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Description'>
                                            <TextArea autoSize={{ minRows: 3, maxRows: 5 }} allowClear />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Title level={3}>Thông tin đặc thù(Sở/Phòng GD)</Title>
                        <Row gutter={16} justify='start'>
                            <Col span={12}>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item label={'Số trường tiểu học'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Số trường THCS'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Số trường THPT'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Chính sách...'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item label={'Thông tin thêm 1'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Thông tin thêm 2'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Thông tin thêm 3'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label={'Thông tin thêm 4'} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} name='Type' rules={[{ /**required: true,**/ whitespace: true }]}>
                                            <Input allowClear />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Title level={3}>Thông tin hệ thống</Title>
                        <Row gutter={16} justify='start'>
                            <Col span={12}>
                                <Col span={24}>
                                    <Form.Item
                                        label=''
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 24 }}
                                        name='a'
                                        rules={[{ /**required: true**/ }]}
                                    >
                                        <Radio.Group>
                                            <Space direction="vertical">
                                                <Radio value="0"> Khách hàng chung </Radio>
                                                <Radio value="1"> Khách hàng cá nhân </Radio>
                                            </Space>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Col>
                        </Row>
                    </Form>
                }
            </Card>
        </div>
    );
}

export default CustomerCreate;
