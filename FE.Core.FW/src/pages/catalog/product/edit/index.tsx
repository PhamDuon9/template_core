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

import { OptionModel, SelectOptionModel } from '@/@types/data';
import { Code } from '@/apis';
import { ProductModel } from '@/apis/models/ProductModel';
import { ProductTypeModel } from '@/apis/models/ProductTypeModel';
import { getProductCategory } from '@/apis/services/ProductCategoryService';
import { getProduct1, putProduct } from '@/apis/services/ProductService';
import { getProductType } from '@/apis/services/ProductTypeService';
import { ConvertOptionSelectModel } from '@/utils/convert';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';




function ProductEdit() {
    const navigate = useNavigate();
    const params = useParams()
    console.log(params);
    // Load
    const initState = {
        recordEdit: {},
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
            const responseRecordEdit: ResponseData<ProductModel> = await getProduct1(params.id) as ResponseData<ProductModel>;
            const filter = {
                ProductCategoryId: responseRecordEdit.data?.productCategoryId ? responseRecordEdit.data?.productCategoryId : undefined,
            }
            const response: ResponseData = await getProductCategory();
            const options = ConvertOptionSelectModel(response.data as OptionModel[]);

            const responseProductType: ResponseData = await getProductType(JSON.stringify(filter));

            const optionProductTypes = ConvertOptionSelectModel(responseProductType.data as OptionModel[]);
            const stateDispatcher = {
                recordEdit: responseRecordEdit.data,
                productCategories: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(options),
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
        const fieldsValue = await formRef?.current?.validateFields();
        setButtonOkText('Đang xử lý...');
        setButtonLoading(true);

        const objBody: ProductTypeModel = {
            ...fieldsValue,
        }

        const response = await putProduct(params.id, "", objBody);
        setButtonOkText('Lưu');
        setButtonLoading(false);
        if (response.code === Code._200) {
            message.success(response.message || "Cập nhật thành công")
            navigate(`/catalog/product`)
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
                                <Button type="text" shape='circle' onClick={() => navigate('/catalog/product')}>
                                    <ArrowLeftOutlined />
                                </Button>
                            </Tooltip>
                            <Text strong>Cập nhật sản phẩm</Text>
                        </Space>
                    </>
                }
                extra={
                    <Space>
                        <Button type="dashed" onClick={() => navigate('/catalog/product')}>
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
                            ["Name"]: state.recordEdit?.name,
                            ["Code"]: state.recordEdit?.code,
                            ["Description"]: state.recordEdit?.description,
                            ["ProductCategoryId"]: state.recordEdit?.productCategoryId,
                            ["ProductTypeId"]: state.recordEdit?.productTypeId,
                        }}
                    >
                        <Row gutter={16} justify='start'>
                            <Col span={12}>
                                <Form.Item label={'Mã SP'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Code' rules={[{ required: true, whitespace: true }]}>
                                    <Input placeholder='Nhập mã SP' allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={'Tên SP'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Name' rules={[{ required: true, whitespace: true }]}>
                                    <Input placeholder='Nhập tên SP' allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={'Nhóm sản phẩm'}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    name='ProductCategoryId'
                                    rules={[{ required: true }]}
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
                            <Col span={12}>
                                <Form.Item
                                    label={'Loại sản phẩm'}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    name='ProductTypeId'
                                    rules={[{ required: true }]}
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
                                <Form.Item label={'Mô tả'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Description'>
                                    <Input placeholder='Nhập mô tả' allowClear />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                }


            </Card>


        </div>
    );
}

export default ProductEdit;
