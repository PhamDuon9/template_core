import { Code } from '@/apis';
import { PaginationConfig, ResponseData } from '@/utils/request';
import {
    Button,
    Card,
    Col,
    Collapse,
    Divider,
    Form,
    Input,
    Modal,
    PaginationProps,
    Row,
    Select,
    Space,
    Table,
    Typography,
    message
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useEffect, useReducer, useState } from 'react';

import { DivisionModel } from '@/apis/models/toefl-challenge/DivisionModel';
import { ProvinceModel } from '@/apis/models/toefl-challenge/ProvinceModel';
import { RegistrationCodeModel } from '@/apis/models/toefl-challenge/RegistrationCodeModel';
import { RegistrationRound } from '@/apis/models/toefl-challenge/RegistrationRound';
import { SchoolModel } from '@/apis/models/toefl-challenge/SchoolModel';
import { getAministrativeDivisions, getAministrativeDivisions1 } from '@/apis/services/toefl-challenge/AministrativeDivisionsService';
import { getExam } from '@/apis/services/toefl-challenge/ExamService';
import { deleteRegistrationCode, getRegistrationCode } from '@/apis/services/toefl-challenge/RegistrationCodeService';
import { getSchool } from '@/apis/services/toefl-challenge/SchoolService';
import Permission from '@/components/Permission';
import { PermissionAction, layoutCode } from '@/utils/constants';
import {
    ConvertOptionSelectModel
} from '@/utils/convert';
import { DeleteOutlined, ImportOutlined, MailOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import EmailRegistrationCode from './email';
import ImportRegistrationCode from './import';
import { OptionModel, SelectOptionModel } from '@/@types/data';
import DebounceSelect from '@/components/DebounceSelect';
function CodeTFC() {
    const navigate = useNavigate();
    // Load
    const { Panel } = Collapse;
    const initState = {
        provinces: [],
        districts: [],
        registrationRounds: [
            {
                key: RegistrationRound._1,
                label: 'Vòng 1',
                value: RegistrationRound._1,
            },
            {
                key: RegistrationRound._2,
                label: 'Vòng 2',
                value: RegistrationRound._2,
            },
            {
                key: RegistrationRound._3,
                label: 'Vòng 3',
                value: RegistrationRound._3,
            },
        ],
        isSelfRegistration: [
            {
                key: 'Default',
                label: '-Chọn-',
                value: '',
            },
            {
                key: 1,
                label: 'TS tự do',
                value: 1,
            },
            {
                key: 0,
                label: 'Không phải TS tự do',
                value: 0,
            },
        ],
        isUsedForCommunication: [
            {
                key: 'Default',
                label: '-Chọn-',
                value: '',
            },
            {
                key: 1,
                label: 'Cho phép',
                value: 1,
            },
            {
                key: 0,
                label: 'Không cho phép',
                value: 0,
            },
        ],
        blocks: [],
        exams: [],
        recordView: {},
        departments: [],
    };
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [list, setList] = useState<RegistrationCodeModel[]>([]);
    const showTotal: PaginationProps['showTotal'] = (total) => `Total ${total} items`;
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
            const responseExam: ResponseData = await getExam(JSON.stringify({
                status: 1
            }));

            const provinceOptions = ConvertOptionSelectModel(responseProvinces.data as OptionModel[]);
            const examOptions = ConvertOptionSelectModel(responseExam.data as OptionModel[]);
            let blocks: SelectOptionModel[] = []
            for (let idx = 1; idx <= 12; idx++) {
                blocks.push({
                    key: `${idx}`,
                    label: `${idx}`,
                    value: `${idx}`,
                })
            }
            const stateDispatcher = {
                provinces: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(provinceOptions),
                districts: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                }],
                exams: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(examOptions),
                blocks: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(blocks)
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
                const response = await deleteRegistrationCode(id);
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

    // Data
    const [buttonLoading, setButtonLoading] = useState<any>({});
    const [showModelImport, setShowModelImport] = useState<boolean>(false);
    const [showModelEmail, setShowModelEmail] = useState<boolean>(false);

    const onHandleShowModelCreate = async () => {
        navigate(`/toefl-challenge/registration-code/create`)
    };

    const onHandleShowImportRegistrationCode = async () => {
        setShowModelImport(true)
    }

    const onHandleShowEmailRegistrationCode = async () => {
        setShowModelEmail(true)
    }

    // searchForm
    const [searchForm] = Form.useForm();
    const searchFormSubmit = async (current: number = 1, pageSize: number = 20): Promise<void> => {
        try {
            const fieldsValue = await searchForm.validateFields();
            setLoading(true)
            const filter = {
                provinceId: fieldsValue.ProvinceId ? fieldsValue.ProvinceId : undefined,
                districId: fieldsValue.DistrictId ? fieldsValue.DistrictId : undefined,
                ExamId: fieldsValue.ExamId ? fieldsValue.ExamId : undefined,
                SchoolId: fieldsValue.SchoolId ? fieldsValue.SchoolId.value : undefined,
                page: current,
                size: pageSize,
                TextSearch: fieldsValue.RegistrationNumber
            }

            const response: ResponseData = await getRegistrationCode(
                JSON.stringify(filter)
            );
            setList((response.data || []) as DivisionModel[]);
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

    const onGetSchoolDebounce = async (search: string, page: number = 1): Promise<ResponseData<SelectOptionModel[]>> => {
        const fieldsValue = await searchForm.validateFields();
        const filter = {
            provinceId: fieldsValue.ProvinceId ? fieldsValue.ProvinceId : undefined,
            districtId: fieldsValue.DistrictId ? fieldsValue.DistrictId : undefined,
            page: page,
            size: 20,
            textSearch: search,
        }
        return getSchool(
            JSON.stringify(filter)
        ).then((body: ResponseData | ResponseData<SchoolModel[]>) => {
            const recordOptions = ConvertOptionSelectModel(body.data as OptionModel[]);
            return {
                ...body,
                data: recordOptions
            }
        });
    }
    const onChangeProvince = async () => {

        const fieldsValue = await searchForm.validateFields();
        const filter = {
            provinceId: fieldsValue.ProvinceId ? fieldsValue.ProvinceId : undefined,
        }
        if (!fieldsValue.ProvinceId) {
            const stateDispatcher = {
                districts: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                }],
            }
            dispatch(stateDispatcher)
            return
        }
        const response: ResponseData = await getAministrativeDivisions1(fieldsValue.ProvinceId);
        const data = await response.data as ProvinceModel
        const districtOptions = ConvertOptionSelectModel(data.districts as OptionModel[]);

        const stateDispatcher = {
            districts: [{
                key: 'Default',
                label: '-Chọn-',
                value: '',
            } as SelectOptionModel].concat(districtOptions),
        }
        dispatch(stateDispatcher)
    };

    const columns: ColumnsType<RegistrationCodeModel> = [
        {
            title: 'STT',
            dataIndex: 'index',
            width: 60,
            render: (_, record, index) => <>{(pagination.current - 1) * pagination.pageSize + index + 1}</>,
        },
        {
            title: 'Số báo danh',
            width: 250,
            dataIndex: 'registrationNumber',
            render: (_, record) => <span>{record.registrationNumber}</span>,
        },
        {
            title: 'Code',
            width: 250,
            dataIndex: 'Code',
            render: (_, record) => <span>{record.code}</span>,
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'startDate',
            render: (_, record) => <span>{record.startDate}</span>,
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'endDate',
            render: (_, record) => <span>{record.endDate}</span>,
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: 200,
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Permission noNode navigation={layoutCode.toeflChallengeRegistrationCode as string} bitPermission={PermissionAction.View}>
                        <Button type='dashed' size='small' title='Gửi email code thi' loading={false} >
                            <MailOutlined />
                        </Button>
                    </Permission>
                    <Permission noNode navigation={layoutCode.toeflChallengeRegistrationCode as string} bitPermission={PermissionAction.Delete}>
                        <Button danger size='small' title='Xóa' loading={false} onClick={() => deleteRecord(record.id || '')}>
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
                                    <Permission noNode navigation={layoutCode.toeflChallengeRegistrationCode as string} bitPermission={PermissionAction.Add}>
                                        <Button htmlType='button' type='default' onClick={() => onHandleShowModelCreate()}>
                                            <PlusOutlined />
                                            Tạo mới
                                        </Button>
                                    </Permission>
                                    <Permission noNode navigation={layoutCode.toeflChallengeRegistrationCode as string} bitPermission={PermissionAction.Import}>
                                        <Button htmlType='button' type='default' onClick={() => onHandleShowImportRegistrationCode()}>
                                            <ImportOutlined />
                                            Import DS Code
                                        </Button>
                                    </Permission>
                                    <Permission noNode navigation={layoutCode.toeflChallengeRegistrationCode as string} bitPermission={PermissionAction.View}>
                                        <Button htmlType='button' type='default' onClick={() => onHandleShowEmailRegistrationCode()}>
                                            <MailOutlined />
                                            Gửi email code thi
                                        </Button>
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
                                                ['ExamId']: undefined,
                                                ['ProvinceId']: '',
                                                ['DistrictId']: '',
                                                ['SchoolId']: '',
                                                ['RegistrationNumber']: ''
                                            }}
                                        >
                                            <Row gutter={16} justify='start'>
                                                <Col span={4}>
                                                    <Form.Item
                                                        label={'Cuộc thi'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        name='ExamId'
                                                    >
                                                        <Select
                                                            placeholder='-Chọn-'
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
                                                            options={state.exams}
                                                        // onChange={() => onChangeProvince()}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={4}>
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
                                                <Col span={4}>
                                                    <Form.Item
                                                        label={'Quận/Huyện'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        name='DistrictId'
                                                    >
                                                        <Select
                                                            placeholder='Chọn'
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
                                                            options={state.districts}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={4}>
                                                    <Form.Item
                                                        label={'Trường học'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        name='SchoolId'
                                                    >
                                                        <DebounceSelect
                                                            // mode="multiple"
                                                            showSearch
                                                            allowClear
                                                            placeholder="Chọn trường"
                                                            fetchOptions={onGetSchoolDebounce}
                                                            style={{ width: '100%' }}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Divider />
                                            <Row gutter={16} justify='start'>
                                                <Col span={4}>
                                                    <Form.Item
                                                        label={'Số báo danh'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        name='RegistrationNumber'
                                                    >
                                                        <Input
                                                            placeholder='Nhập số báo danh'
                                                            allowClear />
                                                    </Form.Item>
                                                </Col>

                                                <Col span={24}>
                                                    <Space>
                                                        <Button type='primary' htmlType='submit' onClick={() => searchFormSubmit()}>
                                                            Tìm kiếm
                                                        </Button>
                                                        <Button htmlType='button' onClick={() => searchForm.resetFields()}>
                                                            Làm lại
                                                        </Button>
                                                    </Space>
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
                        showTotal
                    }}
                    // rowSelection={{
                    //     selectedRowKeys: selectedRowDeleteKeys,
                    //     onChange: (selectedRowKeys: React.Key[]) => setSelectedRowDeleteKeys(selectedRowKeys.map(value => value.toString()))
                    // }}
                    scroll={{ x: '100vw', y: '460px' }}
                />
            </Card>
            {showModelImport && (
                <ImportRegistrationCode temp={state.exams}
                    open={showModelImport} setOpen={setShowModelImport} reload={searchFormSubmit} ></ImportRegistrationCode>
            )}
            {showModelEmail && (
                <EmailRegistrationCode temp={state.exams}
                    open={showModelEmail} setOpen={setShowModelEmail} reload={searchFormSubmit} ></EmailRegistrationCode>
            )}
        </div>
    );
}

export default CodeTFC;
