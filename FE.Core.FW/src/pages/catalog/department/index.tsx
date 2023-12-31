import { Code, DepartmentModel } from '@/apis';
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
    message
} from 'antd';
import { useEffect, useReducer, useState } from 'react';
import Permission from '@/components/Permission';
import { PermissionAction, layoutCode } from '@/utils/constants';
import {
    ConvertOptionSelectModel
} from '@/utils/convert';
import { DeleteOutlined, DownOutlined, EditOutlined, EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { deleteDepartment, getDepartment, getDepartmentById, getDepartmentTree } from '@/apis/services/DepartmentService';
import { getBranch } from '@/apis/services/BranchService';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import CreateDepartment from './create';
import EditDepartment from './edit';
import { OptionModel, SelectOptionModel } from '@/@types/data';
function Department() {
    //Default
    const [loading, setLoading] = useState<boolean>(false);
    const [list, setList] = useState<DepartmentModel[]>([]);
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
                page: current,
                size: pageSize,
                textSearch: fieldsValue.TextSearch,
            }
            const response: ResponseData = await getDepartment(
                JSON.stringify(filter)
            );
            setList((response.data || []) as DepartmentModel[]);
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
    const { Panel } = Collapse;
    useEffect(() => {
        getList(1);
    }, []);
    const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
    const [showEditForm, setShowEditForm] = useState<boolean>(false);
    const [departmentEdit, setDepartmentEdit] = useState<DepartmentModel>({});
    const [initLoadingModal, setInitLoadingModal] = useState<boolean>(false);
    const initState = {
        departmentEdit: {},
        branchs: [],
        departments: [],
    };
    const [state, dispatch] = useReducer<(prevState: any, updatedProperty: any) => any>(
        (prevState: any, updatedProperty: any) => ({
            ...prevState,
            ...updatedProperty,
        }),
        initState,
    );

    //Function
    const onHandleShowModelCreate = async () => {
        setLoading(true)
        // setShowCreateForm(true)
        // setLoading(false)
        const responseDepartment: ResponseData = await getDepartmentTree();
        const responseBranch: ResponseData = await getBranch();
        const optionBranches = ConvertOptionSelectModel(responseBranch.data as OptionModel[]);
        const stateDispatcher = {
            branchs: [{
                key: 'Default',
                label: '-Chọn-',
                value: '',
            } as SelectOptionModel].concat(optionBranches),
            departments: responseDepartment.data ?? []
        };
        dispatch(stateDispatcher);
        setShowCreateForm(true)
        setLoading(false)
    };
    const onHandleShowModelEdit = async (id: string) => {
        await getDepartmentCurrentEdit(id)
    }
    /**
   * Lấy thông tin người dùng cần update
   * @param id 
   */
    const getDepartmentCurrentEdit = async (id: string): Promise<void> => {
        setInitLoadingModal(true)
        const response: ResponseData = await getDepartmentById(id);
        const responseDepartment: ResponseData = await getDepartmentTree();
        const responseBranch: ResponseData = await getBranch();
        console.log(responseBranch)
        if (response && response.code === Code._200) {
            const DepartmentCurrent = response.data as DepartmentModel ?? {};
            const optionBranches = ConvertOptionSelectModel(responseBranch.data as OptionModel[]);
            const stateDispatcher = {
                branchs: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(optionBranches),
                departments: responseDepartment.data ?? []
            };
            dispatch(stateDispatcher);
            setDepartmentEdit(DepartmentCurrent)
            setInitLoadingModal(false)
            setShowEditForm(true);
            
        }
    };
    const deleteRecord = (id: string) => {
        Modal.confirm({
            title: 'Cảnh báo',
            content: `Xác nhận xóa bản ghi này?`,
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk: async () => {
                const response = await deleteDepartment(id);
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
        setLoading(true)
        Modal.confirm({
            title: 'Cảnh báo',
            content: `Xác nhận xóa những bản ghi đã chọn?`,
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            // onOk: async () => {
            //     const response = await deleteManyDivision(selectedRowDeleteKeys);
            //     setLoading(false)
            //     if (response.code === Code._200) {
            //         message.success(response.message)
            //         setSelectedRowDeleteKeys([])
            //         getList(1);
            //     }
            //     else {
            //         message.error(response.message)
            //     }
            // },
        });
    };






    const columns: ProColumns<DepartmentModel>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            width: 80,
            render: (_, record, index) => <>{(pagination.current - 1) * pagination.pageSize + index + 1}</>,
        },
        {
            title: 'Mã phòng ban',
            dataIndex: 'code',
            render: (_, record) => <span>{record.code}</span>,
        },
        {
            title: 'Tên phòng ban',
            dataIndex: 'name',
            render: (_, record) => <span>{record.name}</span>,
        },
        {
            title: 'Tên chi nhánh',
            dataIndex: 'branchName',
            render: (_, record) => <span>{record.branchName}</span>,
        },
        {
            title: 'Tính hoa hồng',
            dataIndex: 'isCom',
            render: (_, record) => <span> <Checkbox checked={record.isCom} disabled /></span>,
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
                    <Permission noNode navigation={layoutCode.catalogDepartment as string} bitPermission={PermissionAction.Edit}>
                        <Button type="default" size={"small"} title='Cập nhật' loading={false} onClick={() => onHandleShowModelEdit(record.id || '')}>
                            <EditOutlined />
                        </Button>
                    </Permission>
                    <Permission noNode navigation={layoutCode.catalogDepartment as string} bitPermission={PermissionAction.Delete}>
                        <Button type="default" size={"small"} title='Xóa' loading={false} onClick={() => deleteRecord(record.id || '')}>
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
                                            <Row gutter={16} justify='start'>
                                                <Col span={6}>
                                                    <Form.Item
                                                        label={'Tên phòng ban'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 17 }}
                                                        name='TextSearch'
                                                    >
                                                        <Input
                                                            placeholder='Tên phòng ban'
                                                            allowClear />
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
                <ProTable<DepartmentModel>
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
                        <Permission noNode navigation={layoutCode.catalogDepartment as string} bitPermission={PermissionAction.Add}>
                            <Button htmlType='button' type='default' onClick={() => onHandleShowModelCreate()}>
                                <PlusOutlined />
                                Tạo mới
                            </Button>
                        </Permission>,
                        // <Permission noNode navigation={layoutCode.catalogDepartment as string} bitPermission={PermissionAction.Delete}>
                        //     <Button htmlType='button' danger type='default' onClick={() => multiDeleteRecord()}>
                        //         <DeleteOutlined />
                        //         Xóa
                        //     </Button>
                        // </Permission>
                    ]}
                />
            </Card>

            {showCreateForm && (
                <CreateDepartment
                    open={showCreateForm}
                    setOpen={setShowCreateForm}
                    reload={searchFormSubmit}
                    branches={state.branchs}
                    departments={state.departments}
                />
            )}
            {showEditForm && (
                <EditDepartment
                    open={showEditForm}
                    setOpen={setShowEditForm}
                    reload={searchFormSubmit}
                    departmentEdit={departmentEdit}
                    branches={state.branchs}
                    departments={state.departments}
                    initLoadingModal={initLoadingModal}
                />
            )}

        </div>
    );
}

export default Department;
