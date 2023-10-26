import { Code } from '@/apis';
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
    Table,
    message
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useEffect, useReducer, useState } from 'react';

import { getDistrictByProvince } from '@/apis/services/PageService';
import {
    ConvertOptionSelectModel
} from '@/utils/convert';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
// import CreateDividingExamRoom from './CreateDividingExamRoom';
import { DepartmentModel } from '@/apis/models/toefl-challenge/DepartmentModel';
import { getAministrativeDivisions } from '@/apis/services/toefl-challenge/AministrativeDivisionsService';
import { deleteDepartment, deleteManyDepartment, getDepartment, getDepartmentId } from '@/apis/services/toefl-challenge/DepartmentService';
import Permission from '@/components/Permission';
import { PermissionAction, layoutCode } from '@/utils/constants';
import CreateDepartment from './create';
import EditDepartment from './edit';
import { OptionModel, SelectOptionModel } from '@/@types/data';
function DepartmentTFC() {
    const navigate = useNavigate();
    // Load
    const { Panel } = Collapse;
    const initState = {
        provinces: [],
        districts: [],
        departmentEdit: {}
    };
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    const [list, setList] = useState<DepartmentModel[]>([]);
    const [pagination, setPagination] = useState<PaginationConfig>({
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
    });
    const [selectedRowDeleteKeys, setSelectedRowDeleteKeys] = useState<string[]>([]);
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
            const responseProvinces: ResponseData = await getAministrativeDivisions();

            const provinceOptions = ConvertOptionSelectModel(responseProvinces.data as OptionModel[]);
            const stateDispatcher = {
                provinces: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(provinceOptions),
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
        setLoadingDelete(true)
        Modal.confirm({
            title: 'Cảnh báo',
            content: `Xác nhận xóa những bản ghi đã chọn?`,
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk: async () => {
                const response = await deleteManyDepartment(selectedRowDeleteKeys);
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

    // Data
    const [showModelCreate, setShowModelCreate] = useState<boolean>(false);
    const [showModelEdit, setShowModelEdit] = useState<boolean>(false);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const onHandleShowModelCreate = async () => {
        setShowModelCreate(true);
    };

    // searchForm
    const [searchForm] = Form.useForm();
    const searchFormSubmit = async (current: number = 1, pageSize: number = 20): Promise<void> => {
        try {
            const fieldsValue = await searchForm.validateFields();
            setLoading(true)
            const filter = {
                provinceId: fieldsValue.ProvinceId ? fieldsValue.ProvinceId : undefined,
                page: current,
                size: pageSize,
                textSearch: fieldsValue.TextSearch
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

    const onHandleEdit = async (id: string, provinceId: string) => {
        const response: ResponseData = await getDepartmentId(id);
        const responseDistricts: ResponseData = await getDistrictByProvince(provinceId);
        const districtOptions = ConvertOptionSelectModel(responseDistricts.data as OptionModel[]);
        if (response.code == Code._200) {
            const stateDispatcher = {
                departmentEdit: response.data,
                districts: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(districtOptions),
            };
            dispatch(stateDispatcher);
            setShowModelEdit(true)
        }
    }


    const columns: ColumnsType<DepartmentModel> = [
        {
            title: 'STT',
            dataIndex: 'index',
            width: 80,
            render: (_, record, index) => <>{(pagination.current - 1) * pagination.pageSize + index + 1}</>,
        },
        {
            title: 'Tên sở giáo dục',
            dataIndex: 'name',
            render: (_, record) => <span>{record.name}</span>,
        },

        {
            title: 'Tỉnh/TP',
            dataIndex: 'provinceName',
            render: (_, record) => <span>{record.provinceName}</span>,
        },

        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: 300,
            render: (_, record) => (
                <Space>
                    <Permission noNode navigation={layoutCode.toeflChallengeDepartment as string} bitPermission={PermissionAction.Edit}>
                        <Button type='dashed' title='Cập nhật' loading={false} onClick={() => onHandleEdit(record.id as string, record.provinceId as string)}>
                            <EditOutlined />
                        </Button>
                    </Permission>
                    <Permission noNode navigation={layoutCode.toeflChallengeDepartment as string} bitPermission={PermissionAction.Delete}>
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
                            <Col span={24} className='gutter-row' style={{ marginBottom: '8px' }}>
                                <Space>
                                    <Permission noNode navigation={layoutCode.toeflChallengeDepartment as string} bitPermission={PermissionAction.Add}>
                                        <Button htmlType='button' type='default' onClick={() => onHandleShowModelCreate()}>
                                            <PlusOutlined />
                                            Tạo mới
                                        </Button>
                                    </Permission>
                                    <Permission noNode navigation={layoutCode.toeflChallengeDepartment as string} bitPermission={PermissionAction.Add}>
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
                                                ['ProvinceId']: '',
                                            }}
                                        >
                                            <Row gutter={16} justify='start'>
                                                <Col span={6}>
                                                    <Form.Item
                                                        label={'Tên sở giáo dục'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 17 }}
                                                        name='TextSearch'
                                                    >
                                                        <Input
                                                            placeholder='Tên sở giáo dục'
                                                            allowClear />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={6}>
                                                    <Form.Item
                                                        label={'Tỉnh/TP'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 17 }}
                                                        name='ProvinceId'
                                                    >
                                                        <Select
                                                            placeholder='Chọn Tỉnh/TP'
                                                            showSearch
                                                            allowClear
                                                            optionFilterProp='children'
                                                            filterOption={(input, option) =>
                                                                (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                                                            }
                                                            filterSort={(optionA, optionB) =>
                                                                (optionA?.label ?? '')
                                                                    .toString()
                                                                    .toLowerCase()
                                                                    .localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                                            }
                                                            options={state.provinces}
                                                        />
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
                <Table
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
                />
            </Card>
            {showModelCreate && (
                <CreateDepartment
                    open={showModelCreate}
                    setOpen={setShowModelCreate}
                    reload={searchFormSubmit}
                    provinces={state.provinces}
                />
            )}
            {showModelEdit && (
                <EditDepartment
                    open={showModelEdit}
                    setOpen={setShowModelEdit}
                    reload={searchFormSubmit}
                    provinces={state.provinces}
                    districtDepends={state.districts}
                    departmentEdit={state.departmentEdit}
                />
            )}
        </div>
    );
}

export default DepartmentTFC;
