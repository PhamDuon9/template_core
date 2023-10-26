import { Code } from '@/apis';
import { PaginationConfig, ResponseData } from '@/utils/request';
import {
    Button,
    Card,
    Col,
    Collapse,
    Modal,
    Row,
    Space,
    Table,
    message
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useEffect, useReducer, useState } from 'react';

import { ExamLocationModel } from '@/apis/models/toefl-challenge/ExamLocationModel';
import { ExamLocationRoomModel } from '@/apis/models/toefl-challenge/ExamLocationRoomModel';
import { ExamScheduleModel } from '@/apis/models/toefl-challenge/ExamScheduleModel';
import { deleteExamLocation2, getExamLocation, getExamLocation2, getExamLocationRoomById } from '@/apis/services/toefl-challenge/ExamLocationService';
import Permission from '@/components/Permission';
import { examRegistrationScheduleState } from '@/store/exam-atom';
import { PermissionAction, layoutCode } from '@/utils/constants';
import { ConvertOptionSelectModel } from '@/utils/convert';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import ExamLocationCreateTFC from './create';
import ExamLocationEditTFC from './edit';
import { OptionModel, SelectOptionModel } from '@/@types/data';
interface Props {
    examSchedule: ExamScheduleModel
}
function ExamLocationRoomTFC({ examSchedule }: Props) {
    const navigate = useNavigate();
    const [examRegistrationSchedules, setExamRegistrationSchedules] = useRecoilState(examRegistrationScheduleState);
    // console.log('vòng thi:', provinces)
    // Load
    const { Panel } = Collapse;
    const initState = {
        examLocationRoomEdit: {},
        examLocationId: "",
        examLocations: []
    };
    const [buttonLoading, setButtonLoading] = useState<any>({});
    const [list, setList] = useState<ExamLocationRoomModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [openCreate, setOpenCreate] = useState<boolean>(false);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
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
        getList(1);
    }, []);

    const deleteRecord = (id: string) => {
        Modal.confirm({
            title: 'Cảnh báo',
            content: `Xác nhận xóa bản ghi này?`,
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk: async () => {
                const response = await deleteExamLocation2(id);
                if (response.code === Code._200) {
                    message.success(response.message ?? "Xóa thành công")
                    getList(1);
                }
                else {
                    message.error(<>
                        <p>Xóa thất bại</p>
                        <p>{JSON.stringify(response.errorDetail)}</p>
                    </>)
                }
            },
        });
    };

    // const [dataExamLocationMapSchedule, setDataExamLocationMapSchedule] = useRecoilState<ExamLocationScheduleModel[]>(examLocationMapScheduleState);
    const onHandleShowModelCreate = async () => {
        setLoadingCreate(true)
        const filter = {
            examId: examSchedule.examId,
            examScheduleId: examSchedule.id
        }
        const response: ResponseData<ExamLocationModel[]> = await getExamLocation(JSON.stringify(filter)) as ResponseData<ExamLocationModel[]>;
        if (response.code === Code._200) {
            setOpenCreate(true)
            setLoadingCreate(false)
            const options = ConvertOptionSelectModel(response.data as OptionModel[]);
            const stateDispatcher = {
                examLocations: [
                    {
                        key: 'Default',
                        label: '-Chọn-',
                        value: '',
                    } as SelectOptionModel
                ].concat(options),
            };
            dispatch(stateDispatcher);
        }
    };
    const onHandleShowModelEdit = async (id: string) => {
        setButtonLoading((prevState: any) => ({ ...prevState, [id]: true }));
        const response: ResponseData<ExamLocationRoomModel> = await getExamLocationRoomById(id) as ResponseData<ExamLocationRoomModel>;
        if (response.code === Code._200) {
            setOpenEdit(true)
            setButtonLoading((prevState: any) => ({ ...prevState, [id]: false }));
            const stateDispatcher = {
                examLocationRoomEdit: response.data,
            };
            dispatch(stateDispatcher);
        }

    };

    // searchForm
    const searchFormSubmit = async (current: number = 1, pageSize: number = 20): Promise<void> => {
        try {
            setLoading(true)
            const filter = {
                // Year: fieldsValue.Year ? "" + moment(fieldsValue.Year).years() : fieldsValue.Year === undefined ? "" + moment(new Date()).years() : '',
                examScheduleId: examSchedule?.id,
                examId: examSchedule?.examId,
                page: current,
                size: pageSize,
            }
            const response: ResponseData = await getExamLocation2(
                JSON.stringify(filter)
            );
            setList((response.data || []) as ExamLocationRoomModel[]);
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

    const columns: ColumnsType<ExamLocationRoomModel> = [
        {
            title: 'Tên phòng thi',
            dataIndex: 'name',
            key: "name",
            render: (_, record) => <span>{record.name}</span>,
        },
        {
            title: 'Địa điểm thi',
            dataIndex: 'examLocationName',
            key: 'examLocationName',
            render: (_, record) => <span>{record.examLocationName}</span>,
        },
        {
            title: 'Hạn mức',
            dataIndex: 'amount',
            key: 'amount',
            render: (_, record) => <span>{record.amount}</span>,
        },
        {
            title: 'Hiển thị',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => <>{record.status ? <CheckOutlined /> : <CloseOutlined />}</>,
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
                        <Button type='dashed' title='Cập nhật' loading={buttonLoading[record.id as string]} onClick={() => onHandleShowModelEdit(record.id as string)}>
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
                                        <Button htmlType='button' type='default'
                                            loading={loadingCreate}
                                            onClick={() => onHandleShowModelCreate()}>
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
                    dataSource={list ?? []}
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
                <ExamLocationCreateTFC
                    open={openCreate}
                    setOpen={setOpenCreate}
                    reload={searchFormSubmit}
                    examSchedule={examSchedule}
                    examLocations={state.examLocations}
                />
            }
            {openEdit &&
                <ExamLocationEditTFC
                    open={openEdit}
                    setOpen={setOpenEdit}
                    reload={searchFormSubmit}
                    examSchedule={examSchedule}
                    recordEdit={state.examLocationRoomEdit}
                />
            }
        </div>
    );
}

export default ExamLocationRoomTFC;
