import { Code } from '@/apis';
import { PaginationConfig } from '@/utils/request';
import {
    Button,
    Card,
    Col,
    Collapse,
    Form,
    Modal,
    Row,
    Space,
    Table,
    message
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useEffect, useReducer, useState } from 'react';

import { ExamRegistrationScheduleModel } from '@/apis/models/toefl-challenge/ExamRegistrationScheduleModel';
import { RegistrationExamType } from '@/apis/models/toefl-challenge/RegistrationExamType';
import { deleteManyDivision } from '@/apis/services/toefl-challenge/DivisionService';
import Permission from '@/components/Permission';
import { examRegistrationScheduleState } from '@/store/exam-atom';
import { PermissionAction, layoutCode } from '@/utils/constants';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import ExamRegistrationScheduleCreateTFC from './create';
import ExamRegistrationScheduleEditTFC from './edit';
interface Props {
    examRegistrationSchedules: ExamRegistrationScheduleModel[];
}
function ExamRegistrationScheduleTFC() {
    const navigate = useNavigate();
    const params = useParams()
    const [examRegistrationSchedules, setExamRegistrationSchedules] = useRecoilState(examRegistrationScheduleState);
    // console.log('vòng thi:', examRegistrationSchedules)
    // Load
    const { Panel } = Collapse;
    const initState = {
        examRegistrationScheduleStates: []
    };
    const [loading, setLoading] = useState<boolean>(false);
    const [openCreate, setOpenCreate] = useState<boolean>(false);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
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
        // const fnGetInitState = async () => {
        //     const responseProvinces: ResponseData = await getAministrativeDivisions();
        //     const provinceOptions = ConvertOptionSelectModel(responseProvinces.data as ProvinceModel[]);
        //     const stateDispatcher = {
        //         provinces: [{
        //             key: 'Default',
        //             label: '-Chọn-',
        //             value: '',
        //         }].concat(provinceOptions),
        //     };
        //     dispatch(stateDispatcher);
        // }

        // fnGetInitState()
        getList(1);
    }, []);

    const deleteRecord = (id: string) => {
        const findIdx = examRegistrationSchedules.findIndex((item: ExamRegistrationScheduleModel) => {
            return item.id === id
        })

        const cloneArray = [...examRegistrationSchedules];

        Modal.confirm({
            title: 'Cảnh báo',
            content: `Xác nhận xóa bản ghi này?`,
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk: async () => {
                cloneArray.splice(findIdx, 1)
                setExamRegistrationSchedules(cloneArray)
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

    const onHandleShowModelCreate = () => {
        setOpenCreate(true)
    };
    const onHandleShowModelEdit = (id: string) => {
        setOpenEdit(true)
        const recordEdit = (examRegistrationSchedules ?? []).find((item: ExamRegistrationScheduleModel) => {
            return item.id === id;
        })

        const stateDispatcher = {
            examRegistrationScheduleEdit: recordEdit,
        };
        dispatch(stateDispatcher);
    };

    // searchForm
    const [searchForm] = Form.useForm();
    const searchFormSubmit = async (current: number = 1, pageSize: number = 20): Promise<void> => {
        try {
            const fieldsValue = await searchForm.validateFields();
            setLoading(true)

            const stateDispatcher = {
                examRegistrationScheduleStates: examRegistrationSchedules,
            };
            dispatch(stateDispatcher);
            setLoading(false);
        } catch (error: any) {
            console.log(error);
        }
    };

    const columns: ColumnsType<ExamRegistrationScheduleModel> = [
        {
            title: 'Vòng thi',
            dataIndex: 'registrationRound',
            key: "registrationRound",
            width: 120,
            render: (_, record) => <span>Vòng {record.registrationRound}</span>,
        },
        {
            title: 'Bài thi',
            dataIndex: 'registrationExamType',
            key: 'registrationExamType',
            render: (_, record) => <span>{record.registrationExamType ===  RegistrationExamType._1 ? "TOEFL Primary" : record.registrationExamType ===  RegistrationExamType._2 ? "TOEFL Junior" : record.registrationExamType ===  RegistrationExamType._3 ? "TOEFL ITP" : record.registrationExamType ===  RegistrationExamType._4 ? "iBT" : ""}</span>,
        },
        {
            title: 'Thời gian mở đăng ký',
            dataIndex: 'startDate',
            key: 'startDate',
            width: 180,
            render: (_, record) => <span>{dayjs(record?.startDate).format('DD/MM/YYYY HH:mm')}</span>,
        },
        {
            title: 'Thời gian đóng đăng ký',
            dataIndex: 'endDate',
            key: 'endDate',
            width: 180,
            render: (_, record) => <span>{dayjs(record?.endDate).format('DD/MM/YYYY HH:mm')}</span>,
        },
        {
            title: 'Ngày thi',
            dataIndex: 'examDate',
            key: 'examDate',
            render: (_, record) => <span>{dayjs(record?.examDate).format('DD/MM/YYYY')}</span>,
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
                        <Button type='dashed' title='Cập nhật' loading={false} onClick={() => onHandleShowModelEdit(record.id as string)}>
                            <EditOutlined />
                        </Button>
                    </Permission>
                    <Permission noNode navigation={layoutCode.toeflChallengeCompetition as string} bitPermission={PermissionAction.Delete}>
                        <Button danger title='Xóa' loading={false} onClick={() => deleteRecord(record.id || '')}>
                            <DeleteOutlined />
                        </Button>
                    </Permission>
                </Space >
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
                        </Row>
                    </>
                }
                extra={<div></div>}
            >
                <Table
                    rowKey='id'
                    columns={columns}
                    // dataSource={state.examRegistrationScheduleStates ?? []}
                    dataSource={examRegistrationSchedules ?? []}
                    loading={loading}
                    pagination={{
                        ...pagination,
                        onChange: (page: number, pageSize: number) => {
                            getList(page, pageSize);
                        },
                    }}
                />
            </Card>
            {openCreate &&
                <ExamRegistrationScheduleCreateTFC
                    open={openCreate}
                    setOpen={setOpenCreate}
                    reload={searchFormSubmit}
                    examEdit={state.examEdit}
                />
            }
            {openEdit &&
                <ExamRegistrationScheduleEditTFC
                    open={openEdit}
                    setOpen={setOpenEdit}
                    reload={searchFormSubmit}
                    recordEdit={state.examRegistrationScheduleEdit}
                />
            }
        </div>
    );
}

export default ExamRegistrationScheduleTFC;
