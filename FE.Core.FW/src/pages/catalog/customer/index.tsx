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
import { ConvertOptionSelectModel } from '@/utils/convert';
import { OptionModel, SelectOptionModel } from '@/@types/data';
import ImportCustomer from './import-customer';
import { CustomerModel } from '@/apis/models/CustomerModel';
import { deleteCustomer, getCustomer } from '@/apis/services/CustomerService';
import { getAdministrativeDivision } from '@/apis/services/AdministrativeDivisionService';
function Customer() {
    // Default
    const [loading, setLoading] = useState<boolean>(false);
    const [list, setList] = useState<CustomerModel[]>([]);
    const [pagination, setPagination] = useState<PaginationConfig>({
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
    });
    const getList = async (current: number, pageSize: number = 20): Promise<void> => {
        setLoading(true);
        searchFormSubmit(current, pageSize);
        setLoading(false);
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
            const response: ResponseData = await getCustomer(
                JSON.stringify(filter)
            );
            setList((response.data || []) as CustomerModel[]);
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

    //Detail
    const navigate = useNavigate();
    const { Panel } = Collapse;
    const [showModelImport, setShowModelImport] = useState<boolean>(false);
    const [selectedRowDeleteKeys, setSelectedRowDeleteKeys] = useState<string[]>([]);
    const initState = {
        districts: [],
        provinces: [],
        departments: [],
    };
    const [state, dispatch] = useReducer<(prevState: any, updatedProperty: any) => any>(
        (prevState: any, updatedProperty: any) => ({
            ...prevState,
            ...updatedProperty,
        }),
        initState,
    );
    useEffect(() => {
        const fnGetInitState = async () => {
            const responseProvinces: ResponseData = await getAdministrativeDivision();

            const optionProvinces = ConvertOptionSelectModel(responseProvinces.data as OptionModel[]);
            const stateDispatcher = {
                provinces: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(optionProvinces),
                districts: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel],
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
                const response = await deleteCustomer(id);
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
        // const fieldsValue = await searchForm.validateFields();
        // searchForm?.setFieldsValue({
        //     "ProductTypeId": '',
        // })
        // const filter = {
        //     ProductCategoryId: fieldsValue.ProductCategoryId ? fieldsValue.ProductCategoryId : undefined,
        // }
        // if (!fieldsValue.ProductCategoryId) {
        //     const stateDispatcher = {
        //         productTypes: [{
        //             key: 'Default',
        //             label: '-Chọn-',
        //             value: '',
        //         }],
        //     }
        //     dispatch(stateDispatcher)
        //     return
        // }
        // const response: ResponseData = await getProductType(JSON.stringify(filter));

        // const options = ConvertOptionSelectModel(response.data as OptionModel[]);
        // const stateDispatcher = {
        //     productTypes: [{
        //         key: 'Default',
        //         label: '-Chọn-',
        //         value: '',
        //     } as SelectOptionModel].concat(options),
        // };
        // dispatch(stateDispatcher);
    }

    // const multiDeleteRecord = () => {
    //     setLoadingDelete(true)
    //     Modal.confirm({
    //         title: 'Cảnh báo',
    //         content: `Xác nhận xóa những bản ghi đã chọn?`,
    //         okText: 'Đồng ý',
    //         cancelText: 'Hủy',
    //         onOk: async () => {
    //             const response = await deleteManyDivision(selectedRowDeleteKeys);
    //             setLoadingDelete(false)
    //             if (response.code === Code._200) {
    //                 message.success(response.message)
    //                 setSelectedRowDeleteKeys([])
    //                 getList(1);
    //             }
    //             else {
    //                 message.error(response.message)
    //             }
    //         },
    //     });
    // };

    const onHandleShowModelCreate = async () => {
        navigate(`/catalog/customer/create`)
    };

    


    const columns: ProColumns<CustomerModel>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            width: 80,
            render: (_, record, index) => <>{(pagination.current - 1) * pagination.pageSize + index + 1}</>,
        },
        {
            title: 'Mã khách hàng',
            dataIndex: 'code',
            render: (_, record) => <span>{record.code}</span>,
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'name',
            render: (_, record) => <span>{record.name}</span>,
        },
        {
            title: 'Mã số thuê',
            dataIndex: 'taxCode',
            render: (_, record) => <span>{record.taxCode}</span>,
        },
        {
            title: 'Tỉnh/TP',
            dataIndex: 'provinceName',
            render: (_, record) => <span>{record.provinceName}</span>,
        },
        {
            title: 'Quận/Huyện',
            dataIndex: 'districtName',
            render: (_, record) => <span>{record.districtName}</span>,
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            render: (_, record) => <span>{record.address}</span>,
        },
        {
            title: 'Phòng ban phụ trách',
            dataIndex: 'departmentName',
            render: (_, record) => <span>{record.departmentName}</span>,
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
                    <Permission noNode navigation={layoutCode.catalogCustomer as string} bitPermission={PermissionAction.Edit}>
                        <Button type="dashed" title='Cập nhật' loading={false} onClick={() => navigate(`/catalog/customer/edit/${record.id}`)}>
                            <EditOutlined />
                        </Button>
                    </Permission>
                    <Permission noNode navigation={layoutCode.catalogCustomer as string} bitPermission={PermissionAction.Delete}>
                        <Button danger title='Xóa' loading={false} onClick={() => deleteRecord(record.id || '')}>
                            <DeleteOutlined />
                        </Button>
                    </Permission>
                </Space>
            ),
        },
    ];
    const onHandleShowModelImport = async () => {
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
                                                        label={'Tỉnh/TP'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        name='ProvinceId'
                                                    >
                                                        <Select
                                                            showSearch
                                                            optionFilterProp="children"
                                                            filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                                            // filterSort={(optionA, optionB) =>
                                                            //     (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                                            // }
                                                            placeholder='-Chọn-' options={state.provinces} onChange={onChangeProductCategory} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={6}>
                                                    <Form.Item
                                                        label={'Quận/Huyện'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        name='DistrictId'
                                                    >
                                                        <Select
                                                            showSearch
                                                            optionFilterProp="children"
                                                            filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                                            // filterSort={(optionA, optionB) =>
                                                            //     (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                                            // }
                                                            placeholder='-Chọn-' options={state.districts} />
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

                <ProTable<CustomerModel>
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
                        <Permission noNode navigation={layoutCode.catalogCustomer as string} bitPermission={PermissionAction.Add}>
                            <Button htmlType='button' type='default' onClick={() => onHandleShowModelCreate()}>
                                <PlusOutlined />
                                Tạo mới
                            </Button>
                        </Permission>,
                        <Permission noNode navigation={layoutCode.catalogCustomer as string} bitPermission={PermissionAction.Import}>
                            <Button htmlType='button' type='default' onClick={() => onHandleShowModelImport()}>
                                <ImportOutlined />
                                Import
                            </Button>
                        </Permission>
                    ]}
                />
            </Card>
            {showModelImport && (
                <ImportCustomer
                    open={showModelImport}
                    setOpen={setShowModelImport}
                    reload={searchFormSubmit}
                />
            )}
        </div>
    );
}

export default Customer;
