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
    Typography,
    message
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useEffect, useReducer, useState } from 'react';

import { SchoolModel } from '@/apis/models/toefl-challenge/SchoolModel';
import { getDepartment2 } from '@/apis/services/DepartmentService';
import { getAministrativeDivisions } from '@/apis/services/toefl-challenge/AministrativeDivisionsService';
import { getDepartment } from '@/apis/services/toefl-challenge/DepartmentService';
import { deleteManyDivision } from '@/apis/services/toefl-challenge/DivisionService';
import { deleteSchool, getSchool, getSchoolTree } from '@/apis/services/toefl-challenge/SchoolService';
import Permission from '@/components/Permission';
import { PermissionAction, layoutCode } from '@/utils/constants';
import {
    ConvertOptionSelectModel
} from '@/utils/convert';
import { DeleteOutlined, EditOutlined, GatewayOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SchoolCoordinator from './school-coordinator';
import { OptionModel, SelectOptionModel } from '@/@types/data';
function SchoolTFC() {
    const navigate = useNavigate();
    // Load
    const { Panel } = Collapse;
    const initState = {
        provinces: [],
        districts: [],
        departmentEdit: {},
        departments: [],
        iigdepartments: []
    };
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    const [list, setList] = useState<SchoolModel[]>([]);
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
            const responseProvinces: ResponseData = await getAministrativeDivisions();
            const responseDepartment: ResponseData = await getDepartment();
            // const responseIIGDepartment: ResponseData = await getIigDepartment2();
            const responseIIGDepartment: ResponseData = await getDepartment2();

            const provinceOptions = ConvertOptionSelectModel(responseProvinces.data as OptionModel[]);
            const departmentOptions = ConvertOptionSelectModel(responseDepartment.data as OptionModel[]);
            const stateDispatcher = {
                provinces: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(provinceOptions),
                departments: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(departmentOptions),
                iigdepartments: responseIIGDepartment.data ?? []
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
                const response = await deleteSchool(id);
                if (response.code === Code._200) {
                    message.success(response.message)
                    getList(1);
                }
                else {
                    message.success(response.message)
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
                const response = await deleteManyDivision(selectedRowDeleteKeys);
                setLoadingDelete(false)
                if (response.code === Code._200) {
                    message.success(response.message)
                    setSelectedRowDeleteKeys([])
                    getList(1);
                }
                else {
                    message.success(response.message)
                }
            },
        });
    };

    // Data
    const [showModelSchoolCoordinator, setShowModelSchoolCoordinator] = useState<boolean>(false);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const onHandleShowModelCreate = async () => {
        navigate(`/toefl-challenge/school/create`)
    };

    const onHandleShowModelSchoolCoordinator = async () => {
        setButtonLoading(true)
        const responseSchoolCascader: ResponseData = await getSchoolTree();
        if (responseSchoolCascader.code === Code._200) {
            setButtonLoading(false)
            setOptions(responseSchoolCascader.data as Option[])
            setShowModelSchoolCoordinator(true)
        }
        else {
            message.error(responseSchoolCascader.message)
        }
    };
    // searchForm
    const [searchForm] = Form.useForm();
    const searchFormSubmit = async (current: number = 1, pageSize: number = 20): Promise<void> => {
        try {
            const fieldsValue = await searchForm.validateFields();
            setLoading(true)
            const filter = {
                code: fieldsValue.Code,
                provinceId: fieldsValue.ProvinceId ? fieldsValue.ProvinceId : undefined,
                page: current,
                size: pageSize,
                textSearch: fieldsValue.TextSearch,
                departmentId: fieldsValue.DepartmentId ? fieldsValue.DepartmentId : undefined,
                divisionId: fieldsValue.DivisionId ? fieldsValue.DivisionId : undefined,
            }
            const response: ResponseData = await getSchool(
                JSON.stringify(filter)
            );
            setList((response.data || []) as SchoolModel[]);
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

    const onChangeProvince = async () => {

        const fieldsValue = await searchForm.validateFields();
        const filter = {
            provinceId: fieldsValue.ProvinceId ? fieldsValue.ProvinceId : undefined,
        }
        const response: ResponseData = await getDepartment(
            JSON.stringify(filter)
        );
        const departmentOptions = ConvertOptionSelectModel(response.data as OptionModel[]);

        const stateDispatcher = {
            departments: [{
                key: 'Default',
                label: '-Chọn-',
                value: '',
            } as SelectOptionModel].concat(departmentOptions),
        }
        dispatch(stateDispatcher)
    };


    const columns: ColumnsType<SchoolModel> = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: "index",
            width: 80,
            render: (_, record, index) => <>{(pagination.current - 1) * pagination.pageSize + index + 1}</>,
        },
        {
            title: 'Tên trường',
            dataIndex: 'name',
            key: "name",
            render: (_, record) => <span>{record.name}</span>,
        },
        {
            title: 'Mã trường',
            dataIndex: 'code',
            key: 'code',
            render: (_, record) => <span>{record.code}</span>,
        },
        {
            title: 'Sở giáo dục',
            dataIndex: 'departmentName',
            key: 'departmentName',
            render: (_, record) => <span>{record.departmentName}</span>,
        },
        {
            title: 'Phòng giáo dục',
            dataIndex: 'divisionName',
            key: 'divisionName',
            render: (_, record) => <span>{record.divisionName}</span>,
        },
        {
            title: 'Tỉnh/TP',
            dataIndex: 'provinceName',
            key: 'provinceName',
            render: (_, record) => <span>{record.provinceName}</span>,
        },
        {
            title: 'Quận/huyện',
            dataIndex: 'districtName',
            key: 'districtName',
            render: (_, record) => <span>{record.districtName}</span>,
        },

        {
            title: 'Thao tác',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            width: 300,
            render: (_, record) => (
                <Space>
                    <Permission noNode navigation={layoutCode.toeflChallengeSchool as string} bitPermission={PermissionAction.Edit}>
                        <Button type='dashed' title='Cập nhật' loading={false} onClick={() => navigate(`/toefl-challenge/school/edit/${record.id}`)}>
                            <EditOutlined />
                        </Button>
                    </Permission>
                    <Permission noNode navigation={layoutCode.toeflChallengeSchool as string} bitPermission={PermissionAction.Delete}>
                        <Button danger title='Xóa' loading={false} onClick={() => deleteRecord(record.id || '')}>
                            <DeleteOutlined />
                        </Button>
                    </Permission>
                </Space>
            ),
        },
    ];
    const columnsChild: ColumnsType<SchoolModel> = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: "index",
            width: 80,
            render: (_, record, index) => <>{index + 1}</>,
        },

        {
            title: 'Tên trường',
            dataIndex: 'name',
            key: "name",
            render: (_, record) => <span>{record.name}</span>,
        },
        {
            title: 'Mã trường',
            dataIndex: 'code',
            key: 'code',
            render: (_, record) => <span>{record.code}</span>,
        },
        {
            title: 'Sở giáo dục',
            dataIndex: 'departmentName',
            key: 'departmentName',
            render: (_, record) => <span>{record.departmentName}</span>,
        },
        {
            title: 'Phòng giáo dục',
            dataIndex: 'divisionName',
            key: 'divisionName',
            render: (_, record) => <span>{record.divisionName}</span>,
        },
        {
            title: 'Tỉnh/TP',
            dataIndex: 'provinceName',
            key: 'provinceName',
            render: (_, record) => <span>{record.provinceName}</span>,
        },
        {
            title: 'Quận/huyện',
            dataIndex: 'districtName',
            key: 'districtName',
            render: (_, record) => <span>{record.districtName}</span>,
        },

        {
            title: 'Thao tác',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            width: 300,
            render: (_, record) => (
                <Space>
                    <Permission noNode navigation={layoutCode.toeflChallengeSchool as string} bitPermission={PermissionAction.Edit}>
                        <Button type='dashed' title='Cập nhật' loading={false} onClick={() => navigate(`/toefl-challenge/school/edit/${record.id}`)}>
                            <EditOutlined />
                        </Button>
                    </Permission>
                    <Permission noNode navigation={layoutCode.toeflChallengeSchool as string} bitPermission={PermissionAction.Delete}>
                        <Button danger title='Xóa' loading={false} onClick={() => deleteRecord(record.id || '')}>
                            <DeleteOutlined />
                        </Button>
                    </Permission>
                </Space>
            ),
        },
    ];

    interface Option {
        value: string | number;
        label: string;
        children?: Option[];
    }

    const [options, setOptions] = useState<Option[]>([]);

    return (
        <div className='layout-main-content'>
            <Card
                bordered={false}
                title={
                    <>
                        <Row gutter={16} justify='start'>
                            <Col span={24} className='gutter-row' style={{ marginBottom: '8px' }}>
                                <Space>
                                    <Permission noNode navigation={layoutCode.toeflChallengeSchool as string} bitPermission={PermissionAction.Add}>
                                        <Button htmlType='button' type='default' onClick={() => onHandleShowModelCreate()}>
                                            <PlusOutlined />
                                            Tạo mới
                                        </Button>
                                    </Permission>
                                    <Permission noNode navigation={layoutCode.toeflChallengeSchool as string} bitPermission={PermissionAction.Add}>
                                        <Button htmlType='button' loading={buttonLoading} type='default' onClick={() => onHandleShowModelSchoolCoordinator()}>
                                            <GatewayOutlined />
                                            Điều phối trường
                                        </Button>
                                    </Permission>
                                    {/* <Permission noNode navigation={layoutCode.toeflChallengeDepartment as string} bitPermission={PermissionAction.Add}>
                                        {selectedRowDeleteKeys.length > 0 &&
                                            <Button htmlType='button' danger loading={loadingDelete} type='dashed' onClick={() => multiDeleteRecord()}>
                                                <DeleteOutlined />
                                                Xóa
                                            </Button>
                                        }
                                    </Permission> */}
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
                                                ['Code']: '',
                                                ['ProvinceId']: '',
                                                ['DepartmentId']: '',
                                            }}
                                        >
                                            <Row gutter={16} justify='start'>
                                                <Col span={6}>
                                                    <Form.Item
                                                        label={'Tên trường học'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        name='TextSearch'
                                                    >
                                                        <Input
                                                            placeholder='Tên trường học'
                                                            allowClear />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={6}>
                                                    <Form.Item
                                                        label={'Mã trường'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        name='Code'
                                                    >
                                                        <Input
                                                            placeholder='Mã trường học'
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
                                                            onChange={() => onChangeProvince()}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={6}>
                                                    <Form.Item
                                                        label={'Sở giáo dục'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        name='DepartmentId'
                                                    >
                                                        <Select
                                                            placeholder='Chọn sở giáo dục'
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
                                                            options={state.departments}
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
                    expandable={{
                        expandedRowRender: (record) => (
                            <>
                                <Text strong>Danh sách trường</Text>
                                <Table
                                    rowKey='id'
                                    columns={columnsChild}
                                    dataSource={record.childNodes as SchoolModel[]}
                                    pagination={false}

                                />
                            </>
                        ),
                        rowExpandable: (record) => (record.childNodes?.length ?? 0) > 0,
                    }}
                // rowSelection={{
                //     selectedRowKeys: selectedRowDeleteKeys,
                //     onChange: (selectedRowKeys: React.Key[]) => setSelectedRowDeleteKeys(selectedRowKeys.map(value => value.toString()))
                // }}
                />
            </Card>
            {showModelSchoolCoordinator &&
                <SchoolCoordinator
                    open={showModelSchoolCoordinator}
                    setOpen={setShowModelSchoolCoordinator}
                    reload={searchFormSubmit}
                    provinces={state.provinces}
                    optionInit={options}
                    iigdepartments={state.iigdepartments}
                />}
        </div>
    );
}

export default SchoolTFC;
