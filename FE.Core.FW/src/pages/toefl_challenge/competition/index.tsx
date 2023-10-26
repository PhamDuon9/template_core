import { Code } from '@/apis';
import { PaginationConfig, ResponseData } from '@/utils/request';
import {
    Button,
    Card,
    Col,
    Collapse,
    DatePicker,
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

import { ExamModel } from '@/apis/models/toefl-challenge/ExamModel';
import { getAministrativeDivisions } from '@/apis/services/toefl-challenge/AministrativeDivisionsService';
import { deleteManyDivision } from '@/apis/services/toefl-challenge/DivisionService';
import { deleteExam, getExam } from '@/apis/services/toefl-challenge/ExamService';
import Permission from '@/components/Permission';
import { PermissionAction, layoutCode } from '@/utils/constants';
import {
    ConvertOptionSelectModel
} from '@/utils/convert';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { OptionModel, SelectOptionModel } from '@/@types/data';
function CompetitionTFC() {
    const navigate = useNavigate();
    // Load
    const { Panel } = Collapse;
    const initState = {
        provinces: [],
        districts: [],
        departmentEdit: {},
        departments: [],
        iigdepartments: [],
        years: []
    };
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    const [list, setList] = useState<ExamModel[]>([]);
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
            // const responseDepartment: ResponseData = await getDepartment();
            // const responseIIGDepartment: ResponseData = await getIigDepartment2();

            const provinceOptions = ConvertOptionSelectModel(responseProvinces.data as OptionModel[]);
            // const departmentOptions = ConvertOptionSelectModel(responseDepartment.data as OptionModel[]);
            const stateDispatcher = {
                provinces: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(provinceOptions),
            };
            dispatch(stateDispatcher);
        }
        // const fnGetProvince = async () => {
        //     const responseProvinces: ResponseData = await getSchoolTree();

        //     setOptions(responseProvinces.data as Option[])

        // }
        fnGetInitState()
        getList(1);
        // fnGetProvince()
    }, []);

    const deleteRecord = (id: string) => {
        Modal.confirm({
            title: 'Cảnh báo',
            content: `Xác nhận xóa bản ghi này?`,
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk: async () => {
                const response = await deleteExam(id);
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
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const onHandleShowModelCreate = async () => {
        navigate(`/toefl-challenge/competition/create`)
    };

    // searchForm
    const [searchForm] = Form.useForm();
    const searchFormSubmit = async (current: number = 1, pageSize: number = 20): Promise<void> => {
        try {
            const fieldsValue = await searchForm.validateFields();
            setLoading(true)
            const filter = {
                ...fieldsValue,
                ProvinceId: fieldsValue.ProvinceId ? fieldsValue.ProvinceId : undefined,
                Year: fieldsValue.Year ? "" + moment(fieldsValue.Year).years() : fieldsValue.Year === undefined ? "" + moment(new Date()).years() : '',
                page: current,
                size: pageSize,
                textSearch: fieldsValue.TextSearch,
            }
            console.log(filter)
            const response: ResponseData = await getExam(
                JSON.stringify(filter)
            );
            setList((response.data || []) as ExamModel[]);
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

        // const fieldsValue = await searchForm.validateFields();
        // const filter = {
        //     provinceId: fieldsValue.ProvinceId ? fieldsValue.ProvinceId : undefined,
        // }
        // const response: ResponseData = await getDepartment(
        //     JSON.stringify(filter)
        // );
        // const departmentOptions = ConvertOptionSelectModel(response.data as OptionModel[]);

        // const stateDispatcher = {
        //     departments: [{
        //         key: 'Default',
        //         label: '-Chọn-',
        //         value: '',
        //     }].concat(departmentOptions),
        // }
        // dispatch(stateDispatcher)
    };


    const columns: ColumnsType<ExamModel> = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: "index",
            width: 80,
            render: (_, record, index) => <>{(pagination.current - 1) * pagination.pageSize + index + 1}</>,
        },
        {
            title: 'Cuộc thi',
            dataIndex: 'name',
            key: "name",
            render: (_, record) => <span>{record.name}</span>,
        },
        {
            title: 'Năm thi',
            dataIndex: 'year',
            key: 'year',
            render: (_, record) => <span>{record.year}</span>,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdOnDate',
            key: 'createdOnDate',
            render: (_, record) => <span>{dayjs(record?.createdOnDate).format('DD/MM/YYYY HH:mm')}</span>,
        },

        {
            title: 'Thao tác',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            width: 300,
            render: (_, record) => (
                <Space>
                    <Permission noNode navigation={layoutCode.toeflChallengeCompetition as string} bitPermission={PermissionAction.Edit}>
                        <Button type='dashed' title='Cập nhật' loading={false} onClick={() => navigate(`/toefl-challenge/competition/edit/${record.id}`)}>
                            <EditOutlined />
                        </Button>
                    </Permission>
                    <Permission noNode navigation={layoutCode.toeflChallengeCompetition as string} bitPermission={PermissionAction.Delete}>
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
                                    <Permission noNode navigation={layoutCode.toeflChallengeCompetition as string} bitPermission={PermissionAction.Add}>
                                        <Button htmlType='button' type='default' onClick={() => onHandleShowModelCreate()}>
                                            <PlusOutlined />
                                            Tạo mới
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
                                                ['Year']: moment(new Date()),
                                                ['ProvinceId']: '',
                                                // ['DepartmentId']: '',
                                            }}
                                        >
                                            <Row gutter={16} justify='start'>
                                                <Col span={6}>
                                                    <Form.Item
                                                        label={'Tên cuộc thi'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        name='TextSearch'
                                                    >
                                                        <Input
                                                            placeholder='Tên cuộc thi'
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
                                                        label={'Năm thi'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        name='Year'
                                                    >
                                                        <DatePicker picker='year' placeholder='Chọn năm' format={['YYYY']} />
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
                // rowSelection={{
                //     selectedRowKeys: selectedRowDeleteKeys,
                //     onChange: (selectedRowKeys: React.Key[]) => setSelectedRowDeleteKeys(selectedRowKeys.map(value => value.toString()))
                // }}
                />
            </Card>
        </div>
    );
}

export default CompetitionTFC;
