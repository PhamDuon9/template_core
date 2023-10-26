import { Code } from '@/apis';
import { PaginationConfig, ResponseData } from '@/utils/request';
import {
    Button,
    Card,
    Col,
    Collapse,
    Form,
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
import { ExamScheduleModel } from '@/apis/models/toefl-challenge/ExamScheduleModel';
import { RegistrationRound } from '@/apis/models/toefl-challenge/RegistrationRound';
import { deleteManyDivision } from '@/apis/services/toefl-challenge/DivisionService';
import { deleteExamSchedule, getExamSchedule } from '@/apis/services/toefl-challenge/ExamLocationService';
import { getExam } from '@/apis/services/toefl-challenge/ExamService';
import Permission from '@/components/Permission';
import { PermissionAction, layoutCode } from '@/utils/constants';
import {
    ConvertOptionSelectModel
} from '@/utils/convert';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { OptionModel, SelectOptionModel } from '@/@types/data';
function ExamScheduleTFC() {
    const navigate = useNavigate();
    // Load
    const { Panel } = Collapse;
    const initState = {
        provinces: [],
        districts: [],
        departmentEdit: {},
        exams: [],
    };
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    const [list, setList] = useState<ExamScheduleModel[]>([]);
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
            const responseExam: ResponseData = await getExam();

            // const provinceOptions = ConvertOptionSelectModel(responseProvinces.data as ProvinceModel[]);
            const examOptions = ConvertOptionSelectModel(responseExam.data as OptionModel[]);
            const stateDispatcher = {
                // provinces: [{
                //     key: 'Default',
                //     label: '-Chọn-',
                //     value: '',
                // }].concat(provinceOptions),
                exams: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(examOptions),
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
                const response = await deleteExamSchedule(id);
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
        navigate(`/toefl-challenge/exam-schedule/create`)
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
                // Year: fieldsValue.Year ? "" + moment(fieldsValue.Year).years() : fieldsValue.Year === undefined ? "" + moment(new Date()).years() : '',
                page: current,
                size: pageSize,
                textSearch: fieldsValue.TextSearch,
            }
            const response: ResponseData = await getExamSchedule(
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

    const columns: ColumnsType<ExamScheduleModel> = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: "index",
            width: 80,
            render: (_, record, index) => <>{(pagination.current - 1) * pagination.pageSize + index + 1}</>,
        },
        {
            title: 'Lịch thi',
            dataIndex: 'name',
            key: "name",
            render: (_, record) => <span>{record.name}</span>,
        },
        {
            title: 'Cuộc thi',
            dataIndex: 'examName',
            key: 'examName',
            render: (_, record) => <span>{record.examName}</span>,
        },
        {
            title: 'Khu vực',
            dataIndex: 'provinceName',
            key: 'provinceName',
            render: (_, record) => <span>{record.provinceName}</span>,
        },
        {
            title: 'Vòng thi',
            dataIndex: 'registrationRound',
            key: 'registrationRound',
            render: (_, record) => <span>{record.registrationRound === RegistrationRound._1 ? "Vòng 1" : record.registrationRound === RegistrationRound._2 ? "Vòng 2" : record.registrationRound === RegistrationRound._3 ? "Vòng 3" : ""}</span>,
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
                        <Button type='dashed' title='Cập nhật' loading={false} onClick={() => navigate(`/toefl-challenge/exam-schedule/edit/${record.id}`)}>
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
                                                ['ExamId']: '',
                                                // ['Year']: moment(new Date()),
                                                ['ProvinceId']: '',
                                            }}
                                        >
                                            <Row gutter={16} justify='start'>
                                                <Col span={6}>
                                                    <Form.Item
                                                        label={'Cuộc thi'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        name='ExamId'
                                                    >
                                                        <Select
                                                            placeholder='Chọn'
                                                            showSearch
                                                            optionFilterProp='children'
                                                            filterOption={(input, option) =>
                                                                (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                                                            }
                                                            options={state.exams}
                                                        // onChange={() => onChangeProvince()}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                {/* <Col span={6}>
                                                    <Form.Item
                                                        label={'Khu vực thi'}
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
                                                </Col> */}
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

export default ExamScheduleTFC;
