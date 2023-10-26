import { PaginationConfig, ResponseData } from '@/utils/request';
import {
    Button,
    Card,
    Col,
    Collapse,
    Form,
    Input,
    Modal,
    Row,
    Select,
    Space,
    Typography,
    message
} from 'antd';
import { useEffect, useReducer, useRef, useState } from 'react';

import { Code } from '@/apis';
import { deleteManyDivision } from '@/apis/services/toefl-challenge/DivisionService';
import Permission from '@/components/Permission';
import { PermissionAction, layoutCode } from '@/utils/constants';
import { DeleteOutlined, EditOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { deleteProduct, getProduct } from '@/apis/services/ProductService';
import { getProductCategory } from '@/apis/services/ProductCategoryService';
import { ConvertOptionSelectModel } from '@/utils/convert';
import { OptionModel, SelectOptionModel } from '@/@types/data';
import { getProductType } from '@/apis/services/ProductTypeService';
import ImportProduct from './import-product';
import { ProductModel } from '@/apis/models/ProductModel';
function Product() {
    const navigate = useNavigate();
    // Load
    const { Panel } = Collapse;
    const initState = {
        productCategories: [],
        productTypes: [],
    };
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    const [list, setList] = useState<ProductModel[]>([]);
    const [showModelImport, setShowModelImport] = useState<boolean>(false);
    const [pagination, setPagination] = useState<PaginationConfig>({
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
    });
    const [selectedRowDeleteKeys, setSelectedRowDeleteKeys] = useState<string[]>([]);
    const { Title, Paragraph, Text, Link } = Typography;
    const [state, dispatch] = useReducer<(prevState: any, updatedProperty: any) => any>(
        (prevState: any, updatedProperty: any) => ({
            ...prevState,
            ...updatedProperty,
        }),
        initState,
    );

    const getList = async (current: number, pageSize: number = 20): Promise<void> => {
        setLoading(true);
        searchFormSubmit(current, pageSize);
        setLoading(false);
    };
    useEffect(() => {
        const fnGetInitState = async () => {
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
        }
        fnGetInitState()
        getList(1);
    }, []);

    const deleteRecord = (id: string) => {
        Modal.confirm({
            title: 'Cảnh báo',
            content: `Xác nhận xóa bản ghi này?`,
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk: async () => {
                const response = await deleteProduct(id);
                if (response.code === Code._200) {
                    message.success(response.message)
                    getList(1);
                }
                else {
                    message.error(response.message)
                }
            },
        });
    };

    const onChangeProductCategory = async () => {
        const fieldsValue = await searchForm.validateFields();
        searchForm?.setFieldsValue({
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

    const multiDeleteRecord = () => {
        setLoadingDelete(true)
        Modal.confirm({
            title: 'Cảnh báo',
            content: `Xác nhận xóa những bản ghi đã chọn?`,
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk: async () => {
                const response = await deleteManyDivision(selectedRowDeleteKeys);
                setLoadingDelete(false)
                if (response.code === Code._200) {
                    message.success(response.message)
                    setSelectedRowDeleteKeys([])
                    getList(1);
                }
                else {
                    message.error(response.message)
                }
            },
        });
    };

    const onHandleShowModelCreate = async () => {
        navigate(`/catalog/product/create`)
    };

    // searchForm
    const [searchForm] = Form.useForm();
    const searchFormSubmit = async (current: number = 1, pageSize: number = 20): Promise<void> => {
        try {
            const fieldsValue = await searchForm.validateFields();
            setLoading(true)
            const filter = {
                ...fieldsValue,
                page: current,
                size: pageSize,
            }
            const response: ResponseData = await getProduct(
                JSON.stringify(filter)
            );
            setList((response.data || []) as ProductModel[]);
            setPagination({
                ...pagination,
                current,
                total: response.totalCount || 0,
                pageSize: pageSize,
            });

            setLoading(false);
        } catch (error: any) {
            console.log(error);
        }
    };


    const columns: ProColumns<ProductModel>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            width: 80,
            render: (_, record, index) => <>{(pagination.current - 1) * pagination.pageSize + index + 1}</>,
        },
        {
            title: 'Mã SP',
            dataIndex: 'code',
            render: (_, record) => <span>{record.code}</span>,
        },
        {
            title: 'Tên SP',
            dataIndex: 'name',
            render: (_, record) => <span>{record.name}</span>,
        },
        {
            title: 'Loại SP',
            dataIndex: 'productTypeName',
            render: (_, record) => <span>{record.productTypeName}</span>,
        },
        {
            title: 'Nhóm SP',
            dataIndex: 'productCategoryName',
            render: (_, record) => <span>{record.productCategoryName}</span>,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            render: (_, record) => <span>{record.description}</span>,
        },
        {
            title: 'Thao tác',
            key: 'action',
            fixed: 'right',
            align: 'center',
            width: 300,
            render: (_, record) => (
                <Space>
                    <Permission noNode navigation={layoutCode.catalogProduct as string} bitPermission={PermissionAction.Edit}>
                        <Button type="dashed" title='Cập nhật' loading={false} onClick={() => navigate(`/catalog/product/edit/${record.id}`)}>
                            <EditOutlined />
                        </Button>
                    </Permission>
                    <Permission noNode navigation={layoutCode.catalogProduct as string} bitPermission={PermissionAction.Delete}>
                        <Button danger title='Xóa' loading={false} onClick={() => deleteRecord(record.id || '')}>
                            <DeleteOutlined />
                        </Button>
                    </Permission>
                </Space>
            ),
        },
    ];
    const onHandleShowImportRegistrationPayments = async () => {
        setShowModelImport(true)
    }

    const actionRef = useRef<ActionType>();
    return (
        <div className='layout-main-content'>
            <Card
                bordered={false}
                title={
                    <>
                        <Row gutter={16} justify='start'>
                            <Col span={24} className='gutter-row' style={{ marginBottom: '8px' }}>
                                <Space>
                                    {/* <Permission noNode navigation={layoutCode.catalogBranch as string} bitPermission={PermissionAction.Add}>
                                        <Button htmlType='button' type='default' onClick={() => onHandleShowModelCreate()}>
                                            <PlusOutlined />
                                            Tạo mới
                                        </Button>
                                    </Permission> */}
                                    <Permission noNode navigation={layoutCode.catalogProduct as string} bitPermission={PermissionAction.Delete}>
                                        {selectedRowDeleteKeys.length > 0 &&
                                            <Button htmlType='button' danger loading={loadingDelete} type='dashed' onClick={() => multiDeleteRecord()}>
                                                <DeleteOutlined />
                                                Xóa
                                            </Button>
                                        }
                                    </Permission>
                                </Space>
                            </Col>
                            <Col span={24} className='gutter-row'>
                                <Collapse>
                                    <Panel header='Tìm kiếm' key='1'>
                                        <Form
                                            form={searchForm}
                                            name='search'
                                            initialValues={{
                                                ['TextSearch']: '',
                                            }}
                                        >
                                            <Row gutter={16} justify='start'>
                                                <Col span={6}>
                                                    <Form.Item
                                                        label={'Tên SP'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 17 }}
                                                        name='TextSearch'
                                                    >
                                                        <Input
                                                            placeholder='Tên SP'
                                                            allowClear />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={6}>
                                                    <Form.Item
                                                        label={'Nhóm sản phẩm'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        name='ProductCategoryId'
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
                                                <Col span={6}>
                                                    <Form.Item
                                                        label={'Loại sản phẩm'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        name='ProductTypeId'
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
                                                    <Button type='primary' htmlType='submit' onClick={() => searchFormSubmit()}>
                                                        Tìm kiếm
                                                    </Button>
                                                    <Button htmlType='button' style={{ marginLeft: 8 }} onClick={() => searchForm.resetFields()}>
                                                        Làm lại
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </Panel>
                                </Collapse>
                            </Col>
                        </Row>
                    </>
                }
                extra={<div></div>}
            >
                {/* <Table
                    rowKey='id'
                    columns={columns}
                    dataSource={list}
                    loading={loading}
                    pagination={{
                        ...pagination,
                        onChange: (page: number, pageSize: number) => {
                            getList(page, pageSize);
                        },
                    }}
                    rowSelection={{
                        selectedRowKeys: selectedRowDeleteKeys,
                        onChange: (selectedRowKeys: React.Key[]) => setSelectedRowDeleteKeys(selectedRowKeys.map(value => value.toString()))
                    }}
                /> */}

                <ProTable<ProductModel>
                    dataSource={list}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        ...pagination,
                        onChange: (page: number, pageSize: number) => {
                            getList(page, pageSize);
                        },
                    }}
                    scroll={{ x: '100vw', y: '460px' }}
                    columns={columns}
                    search={false}
                    dateFormatter="string"
                    headerTitle="Tiêu đề"
                    toolBarRender={() => [
                        <Permission noNode navigation={layoutCode.catalogProduct as string} bitPermission={PermissionAction.Add}>
                            <Button htmlType='button' type='default' onClick={() => onHandleShowModelCreate()}>
                                <PlusOutlined />
                                Tạo mới
                            </Button>
                        </Permission>,
                        <Permission noNode navigation={layoutCode.toeflChallengeRegistration as string} bitPermission={PermissionAction.Edit}>
                            <Button htmlType='button' type='default' onClick={() => onHandleShowImportRegistrationPayments()}>
                                <ImportOutlined />
                                Import
                            </Button>
                        </Permission>
                    ]}
                />
            </Card>
            {showModelImport && (
                <ImportProduct
                    open={showModelImport}
                    setOpen={setShowModelImport}
                    reload={searchFormSubmit}
                />
            )}
        </div>
    );
}

export default Product;
