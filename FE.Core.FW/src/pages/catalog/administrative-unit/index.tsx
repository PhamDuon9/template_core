import { Code } from '@/apis';
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
import { OptionModel, SelectOptionModel } from '@/@types/data';
import { AdministrativeUnitModel } from '@/apis/models/AdministrativeUnitModel';
import { DeleteOutlined, DownOutlined, EditOutlined, EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { deleteAdministrativeUnit, getAdministrativeUnit, getAdministrativeUnitById, getAdministrativeUnitTree } from '@/apis/services/AdministrativeUnitService';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import CreateAdministrativeUnit from './create';
import EditAdministrativeUnit from './edit';

function AdministrativeUnit() {
    //Default
    const [loading, setLoading] = useState<boolean>(false);
    const [list, setList] = useState<AdministrativeUnitModel[]>([]);
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
                pageNumber: current,
                pageSize: pageSize,
                textSearch: fieldsValue.TextSearch,
                ParentId: fieldsValue.ParentId ? fieldsValue.ParentId : undefined,
            }
            const response: ResponseData = await getAdministrativeUnit(
                JSON.stringify(filter)
            );
            console.log(response.data)
            setList((response.data || []) as AdministrativeUnitModel[]);
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
    const [administrativeUnitEdit, setAdministrativeUnitEdit] = useState<AdministrativeUnitModel>({});
    const [initLoadingModal, setInitLoadingModal] = useState<boolean>(false);
    const initState = {
        administrativeUnitEdit: {},
        administrativeUnits: [],
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
        const responseAdministrativeUnit: ResponseData = await getAdministrativeUnitTree();
        const stateDispatcher = {
            administrativeUnits: responseAdministrativeUnit.data ?? []
        };
        dispatch(stateDispatcher);
        setShowCreateForm(true)
        setLoading(false)
    };
    const onHandleShowModelEdit = async (id: string) => {
        setLoading(true)
        await getAdministrativeUnitCurrentEdit(id)
        setLoading(false)
    }
    /**
   * Lấy thông tin người dùng cần update
   * @param id 
   */
    const getAdministrativeUnitCurrentEdit = async (id: string): Promise<void> => {
        setInitLoadingModal(true)
        const response: ResponseData = await getAdministrativeUnitById(id);
        const responseAdministrativeUnit: ResponseData = await getAdministrativeUnitTree();
        if (response && response.code === Code._200) {
            const AdministrativeUnitCurrent = response.data as AdministrativeUnitModel ?? {};
            const stateDispatcher = {
                administrativeUnits: responseAdministrativeUnit.data ?? []
            };
            dispatch(stateDispatcher);
            setAdministrativeUnitEdit(AdministrativeUnitCurrent)
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
                const response = await deleteAdministrativeUnit(id);
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






    const columns: ProColumns<AdministrativeUnitModel>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            width: 80,
            render: (_, record, index) => <>{(pagination.current - 1) * pagination.pageSize + index + 1}</>,
        },
        {
            title: 'Mã đơn vị hành chính',
            dataIndex: 'code',
            render: (_, record) => <span>{record.code}</span>,
        },
        {
            title: 'Tên đơn vị hành chính',
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
                                                        label={'Tên đơn vị hành chính'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 17 }}
                                                        name='TextSearch'
                                                    >
                                                        <Input
                                                            placeholder='Tên đơn vị hành chính'
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
                <ProTable<AdministrativeUnitModel>
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
                <CreateAdministrativeUnit
                    open={showCreateForm}
                    setOpen={setShowCreateForm}
                    reload={searchFormSubmit}
                    administrativeUnits={state.administrativeUnits}
                />
            )}
            {showEditForm && (
                <EditAdministrativeUnit
                    open={showEditForm}
                    setOpen={setShowEditForm}
                    reload={searchFormSubmit}
                    administrativeUnitEdit={administrativeUnitEdit}
                    administrativeUnits={state.administrativeUnits}
                    initLoadingModal={initLoadingModal}
                />
            )}

        </div>
    );
}

export default AdministrativeUnit;
