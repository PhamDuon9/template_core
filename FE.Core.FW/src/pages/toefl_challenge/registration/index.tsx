import { Code } from '@/apis';
import { PaginationConfig, ResponseData } from '@/utils/request';
import {
    Button,
    Card,
    Col,
    Collapse,
    DatePicker,
    Divider,
    Dropdown,
    Form,
    Input,
    MenuProps,
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
import { PaymentStatus } from '@/apis/models/toefl-challenge/PaymentStatus';
import { PaymentType } from '@/apis/models/toefl-challenge/PaymentType';
import { ProvinceModel } from '@/apis/models/toefl-challenge/ProvinceModel';
import { RegistrationModel } from '@/apis/models/toefl-challenge/RegistrationModel';
import { RegistrationRound } from '@/apis/models/toefl-challenge/RegistrationRound';
import { SchoolModel } from '@/apis/models/toefl-challenge/SchoolModel';
import { getAministrativeDivisions, getAministrativeDivisions1 } from '@/apis/services/toefl-challenge/AministrativeDivisionsService';
import { deleteManyDivision } from '@/apis/services/toefl-challenge/DivisionService';
import { getExam } from '@/apis/services/toefl-challenge/ExamService';
import { deleteRegistration, getRegistration, getRegistration1, postRegistration3, postRegistration4, postRegistration5 } from '@/apis/services/toefl-challenge/RegistrationService';
import { getSchool } from '@/apis/services/toefl-challenge/SchoolService';
import Permission from '@/components/Permission';
import { PermissionAction, layoutCode } from '@/utils/constants';
import {
    ConvertOptionSelectModel
} from '@/utils/convert';
import { CreditCardOutlined, DeleteOutlined, EditOutlined, EyeOutlined, ImportOutlined, MailOutlined, PlusOutlined } from '@ant-design/icons';
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import ImportRegistrationPaymentTFC from './import-registration-payment';
import ImportRegistrationRound1 from './import-registration-round-1';
import ImportRegistrationRound2 from './import-registration-round-2';
import ImportRegistrationUpdateTFC from './import-update';
import RegistrationPaymentTFC from './update-registration-payment';
import ShowDetailRegistrationTFC from './view-detail';
import { OptionModel, SelectOptionModel } from '@/@types/data';
import DebounceSelect from '@/components/DebounceSelect';
function DivisionTFC() {
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <Button type="link" >Code V1</Button>
            ),
        },
        {
            key: '2',
            label: (
                <Button type="link">Xác nhận đăng ký</Button>
            ),
        },
        {
            key: '3',
            label: (
                <Button type="link">Thanh toán V2</Button>
            ),
        },
        {
            key: '4',
            label: (
                <Button type="link">Thanh toán V3</Button>
            ),
        },

    ];

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
    const [list, setList] = useState<RegistrationModel[]>([]);
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

    const emailCodeRound1 = (id: string) => {
        console.log('emailCodeRound1:' + id);
        Modal.confirm({
            title: 'Thông báo',
            content: `Xác nhận gửi email code thi cho thí sinh này?`,
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk: async () => {
                const response = await postRegistration3(id);
                if (response.code === Code._200) {
                    message.success(response.message || 'thành công')
                    getList(1);
                }
                else {
                    message.error(response.message || 'thất bại')
                }
            },
        });
    }

    const emailRegistration = (id: string) => {
        Modal.confirm({
            title: 'Thông báo',
            content: `Xác nhận gửi email xác nhận đăng ký thành công cho thí sinh này?`,
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk: async () => {
                const response = await postRegistration4(id);
                if (response.code === Code._200) {
                    message.success(response.message || 'thành công')
                    getList(1);
                }
                else {
                    message.error(response.message || 'thất bại')
                }
            },
        });
    }

    const emailRegistrationPayment = (id: string, round: RegistrationRound) => {
        Modal.confirm({
            title: 'Thông báo',
            content: `Xác nhận gửi email xác nhận thanh toán thành công cho thí sinh này?`,
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk: async () => {
                const response = await postRegistration5(id, round);
                if (response.code === Code._200) {
                    message.success(response.message || 'thành công')
                    getList(1);
                }
                else {
                    message.error(response.message || 'thất bại')
                }
            },
        });
    }

    const emailRegistrationScheduleRound2 = (id: string) => {
        console.log('emailRegistrationScheduleRound2:' + id);
    }

    const emailRegistrationScoreRound2 = (id: string) => {
        console.log('emailRegistrationScheduleRound2:' + id);
    }

    const deleteRecord = (id: string) => {
        Modal.confirm({
            title: 'Cảnh báo',
            content: `Xác nhận xóa bản ghi này?`,
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk: async () => {
                const response = await deleteRegistration(id);
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
    const [showModelRegistrationPayment, setShowModelRegistrationPayment] = useState<boolean>(false);
    const [buttonLoading, setButtonLoading] = useState<any>({});
    const [buttonLoadingRegistrationPayment, setButtonLoadingRegistrationPayment] = useState<any>({});
    const [showModelImport, setShowModelImport] = useState<boolean>(false);
    const [showModelImportRegistrationRound1, setShowModelImportRegistrationRound1] = useState<boolean>(false);
    const [showModelImportRegistrationRound2, setShowModelImportRegistrationRound2] = useState<boolean>(false);
    const [showModelImportRegistrationUpdate, setShowModelImportRegistrationUpdate] = useState<boolean>(false);

    const onHandleShowModelCreate = async () => {
        navigate(`/toefl-challenge/registration/create`)
    };

    const onHandleShowImportRegistrationPayments = async () => {
        setShowModelImport(true)
    }
    const onHandleShowImportRegistrationUpdate = async () => {
        setShowModelImportRegistrationUpdate(true)
    }

    const onHandleShowImportRegistrationRound1 = async () => {

        setShowModelImportRegistrationRound1(true);
    }

    const onHandleShowImportRegistrationRound2 = async () => {
        setShowModelImportRegistrationRound2(true);
    }

    const onHandleShowModelViewDetail = async (id: string) => {
        setShowDetail(false)
        setButtonLoading((prevState: any) => ({ ...prevState, [id]: true }));
        const response: ResponseData<RegistrationModel> = await getRegistration1(id) as ResponseData<RegistrationModel>;
        if (response.code == Code._200) {
            const stateDispatcher = {
                recordView: response.data,
            };
            dispatch(stateDispatcher);
            setShowDetail(true)
            setButtonLoading((prevState: any) => ({ ...prevState, [id]: false }));
        }
    };

    const onHandleShowModelUpdateRegistrationPayment = async (id: string) => {
        setShowModelRegistrationPayment(false)
        setButtonLoadingRegistrationPayment((prevState: any) => ({ ...prevState, [id]: true }));
        const response: ResponseData<RegistrationModel> = await getRegistration1(id) as ResponseData<RegistrationModel>;
        if (response.code == Code._200) {
            const stateDispatcher = {
                recordView: response.data,
            };
            dispatch(stateDispatcher);
            setShowModelRegistrationPayment(true)
            setButtonLoadingRegistrationPayment((prevState: any) => ({ ...prevState, [id]: false }));
        }
    };

    // searchForm
    const [searchForm] = Form.useForm();
    const searchFormSubmit = async (current: number = 1, pageSize: number = 20): Promise<void> => {
        try {
            const fieldsValue = await searchForm.validateFields();
            setLoading(true)
            const filter = {
                ...fieldsValue,
                provinceId: fieldsValue.ProvinceId ? fieldsValue.ProvinceId : undefined,
                ExamId: fieldsValue.ExamId ? fieldsValue.ExamId : undefined,
                SchoolId: fieldsValue.SchoolId ? fieldsValue.SchoolId.value : undefined,
                page: current,
                size: pageSize,
            }
            const response: ResponseData = await getRegistration(
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

    const columns: ColumnsType<RegistrationModel> = [
        {
            title: 'STT',
            dataIndex: 'index',
            width: 60,
            render: (_, record, index) => <>{(pagination.current - 1) * pagination.pageSize + index + 1}</>,
        },
        {
            title: 'Số báo danh',
            width: 180,
            dataIndex: 'registrationNumber',
            render: (_, record) => <span>{record.registrationNumber}</span>,
        },
        {
            title: 'Họ tên',
            width: 220,
            dataIndex: 'fullName',
            render: (_, record) => <span>{record.fullName}</span>,
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'birthDay',
            width: 120,
            render: (_, record) => <span>{String(record?.dayOfBirth).padStart(2, '0')}/{String(record?.monthOfBirth).padStart(2, '0')}/{String(record?.yearOfBirth).padStart(2, '0')}</span>,
        },
        {
            title: 'Lớp/Khối',
            dataIndex: 'districtName',
            width: 120,
            render: (_, record) => <span>{record.class + "/" + record.block}</span>,
        },
        {
            title: 'Trường',
            dataIndex: 'schoolName',
            width: 240,
            render: (_, record) => <span>{record.schoolName}</span>,
        },
        {
            title: 'Cuộc thi',
            dataIndex: 'examName',
            width: 220,
            render: (_, record) => <span>{record.examName}</span>,
        },
        {
            title: 'Vòng thi',
            width: 120,
            dataIndex: 'round',
            render: (_, record) => <span>{record.round === RegistrationRound._1 ? "Vòng 1" : record.round === RegistrationRound._2 ? "Vòng 2" : record.round === RegistrationRound._3 ? "Vòng 3" : ""}</span>,
        },
        {
            title: 'Họ tên phụ huynh(bố)',
            dataIndex: 'fatherName',
            width: 260,
            render: (_, record) => <span>{record.fatherName}</span>,
        },
        {
            title: 'Họ tên phụ huynh(mẹ)',
            dataIndex: 'motherName',
            width: 260,
            render: (_, record) => <span>{record.motherName}</span>,
        },
        {
            title: 'SĐT',
            dataIndex: 'tel',
            width: 160,
            render: (_, record) => <span>{record.tel}</span>,
        },
        {
            title: 'Email',
            width: 280,
            dataIndex: 'email',
            render: (_, record) => <span>{record.email}</span>,
        },
        {
            title: 'Lệ phí',
            dataIndex: 'priceExam',
            width: 180,
            align: 'right',
            render: (_, record) => <span>{record.priceExam?.toLocaleString('vi-VN') ?? ""}</span>,
        },
        {
            title: 'Hình thức',
            dataIndex: 'paymentType',
            width: 180,
            render: (_, record) => <span>{record.paymentType === PaymentType._0 ? 'Chuyển khoản/Tiền mặt' : record.paymentType === PaymentType._1 ? "Online" : "Chưa xác định"}</span>,
        },
        {
            title: 'Thanh toán',
            dataIndex: 'paymentStatus',
            width: 160,
            render: (_, record) => <span>{record.paymentStatus === PaymentStatus._0 ? "Chưa thanh toán" : record.paymentStatus === PaymentStatus._1 ? <Text type="warning">Đang xác nhận</Text> : record.paymentStatus === PaymentStatus._2 ? <Text type="success">Đã thanh toán</Text> : ""}</span>,
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: 200,
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Permission noNode navigation={layoutCode.toeflChallengeRegistration as string} bitPermission={PermissionAction.View}>
                        <Button type='dashed' size='small' title='Xem chi tiết' loading={buttonLoading[record.id as string]} onClick={() => onHandleShowModelViewDetail(record.id as string)}>
                            <EyeOutlined />
                        </Button>
                    </Permission>
                    <Permission noNode navigation={layoutCode.toeflChallengeRegistration as string} bitPermission={PermissionAction.Edit}>
                        <Button type='dashed' size='small' title='Cập nhật' loading={false} onClick={() => navigate(`/toefl-challenge/registration/edit/${record.id}`)}>
                            <EditOutlined />
                        </Button>
                    </Permission>
                    <Permission noNode navigation={layoutCode.toeflChallengeRegistration as string} bitPermission={PermissionAction.Edit}>
                        <Button type='dashed'
                            disabled={record.paymentStatus === PaymentStatus._2 && record?.paymentType === PaymentType._1}
                            size='small' title='Cập nhật thanh toán' loading={buttonLoadingRegistrationPayment[record.id as string]} onClick={() => onHandleShowModelUpdateRegistrationPayment(record.id as string)}>
                            <CreditCardOutlined />
                        </Button>
                    </Permission>
                    <Permission noNode navigation={layoutCode.toeflChallengeRegistration as string} bitPermission={PermissionAction.Delete}>
                        <Button danger size='small' title='Xóa' loading={false} onClick={() => deleteRecord(record.id || '')}>
                            <DeleteOutlined />
                        </Button>
                    </Permission>
                    <Permission noNode navigation={layoutCode.toeflChallengeRegistration as string} bitPermission={PermissionAction.Edit}>
                        <Dropdown menu={{
                            items, onClick: ({ key }) => {
                                switch (key) {
                                    case '1':
                                        emailCodeRound1(record.id || '')
                                        break;
                                    case '2':
                                        emailRegistration(record.id || '')
                                        break;
                                    case '3':
                                        emailRegistrationPayment(record.id || '', RegistrationRound._2)
                                        break;
                                    case '4':
                                        emailRegistrationPayment(record.id || '', RegistrationRound._3)
                                        break;
                                    case '5':
                                        break;
                                    case '6':
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }} placement="bottom" arrow>
                            <Button type='dashed' size='small' title='Cập nhật' loading={false} >
                                <MailOutlined />
                            </Button>
                        </Dropdown>
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
                                    <Permission noNode navigation={layoutCode.toeflChallengeRegistration as string} bitPermission={PermissionAction.Add}>
                                        <Button htmlType='button' type='default' onClick={() => onHandleShowModelCreate()}>
                                            <PlusOutlined />
                                            Tạo mới
                                        </Button>
                                    </Permission>
                                    <Permission noNode navigation={layoutCode.toeflChallengeRegistration as string} bitPermission={PermissionAction.Edit}>
                                        <Button htmlType='button' type='default' onClick={() => onHandleShowImportRegistrationUpdate()}>
                                            <ImportOutlined />
                                            Import DS cập nhật thông tin
                                        </Button>
                                    </Permission>
                                    <Permission noNode navigation={layoutCode.toeflChallengeRegistration as string} bitPermission={PermissionAction.Edit}>
                                        <Button htmlType='button' type='default' onClick={() => onHandleShowImportRegistrationPayments()}>
                                            <ImportOutlined />
                                            Import DS thanh toán
                                        </Button>
                                    </Permission>
                                    <Permission noNode navigation={layoutCode.toeflChallengeRegistration as string} bitPermission={PermissionAction.Delete}>
                                        {selectedRowDeleteKeys.length > 0 &&
                                            <Button htmlType='button' danger loading={loadingDelete} type='dashed' onClick={() => multiDeleteRecord()}>
                                                <DeleteOutlined />
                                                Xóa
                                            </Button>
                                        }
                                    </Permission>
                                    <Permission noNode navigation={layoutCode.toeflChallengeRegistration as string} bitPermission={PermissionAction.Import}>
                                        <Button htmlType='button' type='default' onClick={() => onHandleShowImportRegistrationRound1()}>
                                            <PlusOutlined />
                                            Import đăng ký vòng 1
                                        </Button>
                                    </Permission>
                                    <Permission noNode navigation={layoutCode.toeflChallengeRegistration as string} bitPermission={PermissionAction.Import}>
                                        <Button htmlType='button' type='default' onClick={() => onHandleShowImportRegistrationRound2()}>
                                            <PlusOutlined />
                                            Import đăng ký vòng 2
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
                                                ['DayReception']: '',
                                                ['ExamId']: undefined,
                                                ['Rounds']: undefined,
                                                ['IsSelfRegistration']: '',
                                                ['IsUsedForCommunication']: '',
                                                ['ProvinceId']: '',
                                                ['DistrictId']: '',
                                                // ['SchoolId']: '',
                                                ['Block']: '',
                                                ['Class']: '',
                                                ['RegistrationNumber']: '',
                                                ['FullName']: '',
                                                ['Tel']: '',
                                                ['Email']: '',
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
                                                    {/* <Form.Item
                                                        label={'Ngày tiếp nhận đăng ký'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        name='DayReception'
                                                    >
                                                        <DatePicker.RangePicker allowClear
                                                            ranges={{
                                                                'Hôm nay': [moment(), moment()],
                                                                'Tháng này': [moment().startOf('month'), moment().endOf('month')],
                                                                '7 ngày trước': [moment().add(-7, 'd'), moment()]
                                                            }}
                                                            placeholder={['Từ', 'Đến']}
                                                            locale={locale}
                                                            format="DD/MM/YYYY"
                                                        />
                                                    </Form.Item> */}
                                                </Col>

                                                <Col span={4}>
                                                    <Form.Item
                                                        label={'Vòng thi'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        name='Rounds'
                                                    >
                                                        <Select
                                                            placeholder='-Chọn-'
                                                            showSearch
                                                            mode='multiple'
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
                                                            options={state.registrationRounds}
                                                        // onChange={() => onChangeProvince()}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={4}>
                                                    <Form.Item
                                                        label={'Đối tượng'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        name='IsSelfRegistration'
                                                    >
                                                        <Select
                                                            placeholder='-Chọn-'
                                                            showSearch
                                                            allowClear
                                                            optionFilterProp='children'
                                                            filterOption={(input, option) =>
                                                                (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                                                            }
                                                            options={state.isSelfRegistration}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={4}>
                                                    <Form.Item
                                                        label={'Sd hình ảnh để truyền thông'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        name='IsUsedForCommunication'
                                                    >
                                                        <Select
                                                            placeholder='-Chọn-'
                                                            showSearch
                                                            allowClear
                                                            optionFilterProp='children'
                                                            filterOption={(input, option) =>
                                                                (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                                                            }
                                                            options={state.isUsedForCommunication}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={16} justify='start'>
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
                                                <Col span={4}>
                                                    <Form.Item
                                                        label={'Khối'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        name='Block'
                                                    >
                                                        <Select
                                                            placeholder='Chọn'
                                                            showSearch
                                                            allowClear
                                                            optionFilterProp='children'
                                                            filterOption={(input, option) =>
                                                                (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                                                            }
                                                            options={state.blocks}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={4}>
                                                    <Form.Item
                                                        label={'Lớp'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        name='Class'
                                                    >
                                                        <Input
                                                            placeholder='Nhập lớp'
                                                            allowClear />
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
                                                <Col span={4}>
                                                    <Form.Item
                                                        label={'Họ tên'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        name='FullName'
                                                    >
                                                        <Input
                                                            placeholder='Nhập họ tên'
                                                            allowClear />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={4}>
                                                    <Form.Item
                                                        label={'Số điện thoại'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        name='Tel'
                                                    >
                                                        <Input
                                                            placeholder='Nhập số điện thoại'
                                                            allowClear />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={4}>
                                                    <Form.Item
                                                        label={'Email'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 24 }}
                                                        name='Email'
                                                    >
                                                        <Input
                                                            placeholder='Nhập email'
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
            {showDetail && (
                <ShowDetailRegistrationTFC
                    open={showDetail}
                    setOpen={setShowDetail}
                    recordEdit={state.recordView}
                // reload={searchFormSubmit}
                // provinces={state.provinces}
                />
            )}
            {showModelRegistrationPayment && (
                <RegistrationPaymentTFC
                    open={showModelRegistrationPayment}
                    setOpen={setShowModelRegistrationPayment}
                    reload={searchFormSubmit}
                    recordEdit={state.recordView}
                />
            )}
            {showModelImport && (
                <ImportRegistrationPaymentTFC
                    open={showModelImport}
                    setOpen={setShowModelImport}
                    reload={searchFormSubmit}
                />
            )}
            {showModelImportRegistrationRound1 && (
                <ImportRegistrationRound1 temp={state.exams}
                    open={showModelImportRegistrationRound1} setOpen={setShowModelImportRegistrationRound1} reload={searchFormSubmit} ></ImportRegistrationRound1>
            )}
            {showModelImportRegistrationRound2 && (
                <ImportRegistrationRound2 temp={state.exams}
                    open={showModelImportRegistrationRound2} setOpen={setShowModelImportRegistrationRound2} reload={searchFormSubmit} ></ImportRegistrationRound2>
            )}
            {showModelImportRegistrationUpdate && (
                <ImportRegistrationUpdateTFC
                    open={showModelImportRegistrationUpdate}
                    setOpen={setShowModelImportRegistrationUpdate}
                    reload={searchFormSubmit}
                />
            )}
        </div>
    );
}

export default DivisionTFC;
