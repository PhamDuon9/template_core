import { Code } from '@/apis';
import { CustomerGroupModel } from '@/apis/models/CustomerGroupModel';
import { PaginationConfig, ResponseData } from '@/utils/request';
import {
    Button,
    Card,
    Checkbox,
    Col,
    Collapse,
    Form,
    Input,
    Modal,
    Row,
    Space,
    Typography,
    message
} from 'antd';
import { useEffect, useReducer, useRef, useState } from 'react';

import Permission from '@/components/Permission';
import { PermissionAction, layoutCode } from '@/utils/constants';
import {
    ConvertOptionSelectModel
} from '@/utils/convert';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { deleteCustomerGroup, getCustomerGroup, deleteManyCustomerGroup, getCustomerGroupById } from '@/apis/services/CustomerGroupService';
import CreateCustomerGroup from './create'
import EditCustomerGroup from './edit'

function CustomerGroup() {
    // Load
    const { Panel } = Collapse;
    const initState = {
        departments: [],
    };
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
    const [showEditForm, setShowEditForm] = useState<boolean>(false);
    const [customerGroupEdit, setCustomerGroupEdit] = useState<CustomerGroupModel>({});
    const [initLoadingModal, setInitLoadingModal] = useState<boolean>(false);
    const [list, setList] = useState<CustomerGroupModel[]>([]);
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
            // const responseProvinces: ResponseData = await getAministrativeDivisions();
            // const responseDepartment: ResponseData = await getDepartment();

            // const provinceOptions = ConvertOptionSelectModel(responseProvinces.data as ProvinceModel[]);
            // const departmentOptions = ConvertOptionSelectModel(responseDepartment.data as OptionModel[]);
            // const stateDispatcher = {
            //     provinces: [{
            //         key: 'Default',
            //         label: '-Chọn-',
            //         value: '',
            //     }].concat(provinceOptions),
            //     departments: [{
            //         key: 'Default',
            //         label: '-Chọn-',
            //         value: '',
            //     }].concat(departmentOptions)
            // };
            // dispatch(stateDispatcher);
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
                const response = await deleteCustomerGroup(id);
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

    const multiDeleteRecord = () => {
        setLoadingDelete(true)
        Modal.confirm({
            title: 'Cảnh báo',
            content: `Xác nhận xóa những bản ghi đã chọn?`,
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk: async () => {
                const response = await deleteManyCustomerGroup(selectedRowDeleteKeys);
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
        setLoadingCreate(true)
        setShowCreateForm(true)
        setLoadingCreate(false)
        // const responseIIGDepartment: ResponseData = await getDepartment2();
        // if (responseIIGDepartment.code === Code._200) {
        //     const stateDispatcher = {
        //         iigdepartments: responseIIGDepartment.data ?? []
        //     };
        //     dispatch(stateDispatcher);
        //     setShowCreateForm(true)
        //     setLoadingCreate(false)

        // }
        // else {
        //     message.error(responseIIGDepartment.message)
        // }
    };
    const onHandleShowModalEdit = async (userId: string) => {
        await getCustomerGroupCurrentEdit(userId)
    };

    /**
   * Lấy thông tin người dùng cần update
   * @param id 
   */
    const getCustomerGroupCurrentEdit = async (id: string): Promise<void> => {
        setInitLoadingModal(true)
        const response: ResponseData = await getCustomerGroupById(id);
        if (response && response.code === Code._200) {
            const getCustomerGroupCurrent = response.data as CustomerGroupModel ?? {};
            setCustomerGroupEdit(getCustomerGroupCurrent)
            setInitLoadingModal(false)
            setShowEditForm(true);
        }
    };

    // searchForm
    const [searchForm] = Form.useForm();
    const searchFormSubmit = async (current: number = 1, pageSize: number = 20): Promise<void> => {
        try {
            const fieldsValue = await searchForm.validateFields();
            setLoading(true)
            const filter = {
                pageNumber: current,
                pageSize: pageSize,
                textSearch: fieldsValue.TextSearch,
            }
            const response: ResponseData = await getCustomerGroup(
                JSON.stringify(filter)
            );
            setList((response.data || []) as CustomerGroupModel[]);
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


    const columns: ProColumns<CustomerGroupModel>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            width: 80,
            render: (_, record, index) => <>{(pagination.current - 1) * pagination.pageSize + index + 1}</>,
        },
        {
            title: 'Mã nhóm khách hàng',
            dataIndex: 'code',
            render: (_, record) => <span>{record.code}</span>,
        },
        {
            title: 'Tên nhóm khách hàng',
            dataIndex: 'name',
            render: (_, record) => <span>{record.name}</span>,
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
                    <Permission noNode navigation={layoutCode.catalogCustomerGroup as string} bitPermission={PermissionAction.Edit}>
                        <Button type="dashed" title='Cập nhật' loading={false} onClick={() => onHandleShowModalEdit(record.id || '')}>
                            <EditOutlined />
                        </Button>
                    </Permission>
                    <Permission noNode navigation={layoutCode.catalogCustomerGroup as string} bitPermission={PermissionAction.Delete}>
                        <Button danger title='Xóa' loading={false} onClick={() => deleteRecord(record.id || '')}>
                            <DeleteOutlined />
                        </Button>
                    </Permission>
                </Space>
            ),
        },
    ];

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
                                            <Row gutter={24} justify='start'>
                                                <Col span={6}>
                                                    <Form.Item
                                                        // label={'Tên chi nhánh'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 17 }}
                                                        name='TextSearch'
                                                    >
                                                        <Input
                                                            placeholder='Tên chi nhánh'
                                                            allowClear />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={24} style={{float:'right'}}>
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

                <ProTable<CustomerGroupModel>
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
                        <Permission noNode navigation={layoutCode.catalogCustomerGroup as string} bitPermission={PermissionAction.Add}>
                            <Button htmlType='button' type='default' onClick={() => onHandleShowModelCreate()}>
                                <PlusOutlined />
                                Tạo mới
                            </Button>
                        </Permission>,
                        // <Permission noNode navigation={layoutCode.catalogCustomerGroup as string} bitPermission={PermissionAction.Delete}>
                        //     <Button htmlType='button' danger type='default' onClick={() => multiDeleteRecord()}>
                        //         <DeleteOutlined />
                        //         Xóa
                        //     </Button>
                        // </Permission>
                    ]}
                />
            </Card>
            {showCreateForm && (
                <CreateCustomerGroup
                    open={showCreateForm}
                    setOpen={setShowCreateForm}
                    reload={searchFormSubmit}
                />
            )}
            {showEditForm && (
                <EditCustomerGroup
                    open={showEditForm}
                    setOpen={setShowEditForm}
                    reload={searchFormSubmit}
                    customerGroupEdit={customerGroupEdit}
                    initLoadingModal={initLoadingModal}
                />
            )}
        </div>
    );
}

export default CustomerGroup;
