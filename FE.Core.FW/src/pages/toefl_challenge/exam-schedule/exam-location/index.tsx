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

import { OptionModel, SelectOptionModel } from '@/@types/data';
import { ExamLocationModel } from '@/apis/models/toefl-challenge/ExamLocationModel';
import { ExamScheduleModel } from '@/apis/models/toefl-challenge/ExamScheduleModel';
import { ProvinceModel } from '@/apis/models/toefl-challenge/ProvinceModel';
import { getAministrativeDivisions1 } from '@/apis/services/toefl-challenge/AministrativeDivisionsService';
import { deleteManyDivision } from '@/apis/services/toefl-challenge/DivisionService';
import { deleteExamLocation, getExamLocation, getExamLocationById } from '@/apis/services/toefl-challenge/ExamLocationService';
import Permission from '@/components/Permission';
import { examRegistrationScheduleState } from '@/store/exam-atom';
import { PermissionAction, layoutCode } from '@/utils/constants';
import { ConvertOptionSelectModel } from '@/utils/convert';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import ExamLocationCreateTFC from './create';
import ExamLocationEditTFC from './edit';
interface Props {
    examSchedule: ExamScheduleModel
    provinces: SelectOptionModel[]
}
function ExamLocationTFC({ examSchedule, provinces }: Props) {
    const navigate = useNavigate();
    const [examRegistrationSchedules, setExamRegistrationSchedules] = useRecoilState(examRegistrationScheduleState);
    // console.log('vòng thi:', provinces)
    // Load
    const { Panel } = Collapse;
    const initState = {
        examLocationEdit: {},
        districtsByProvinceId: [],
        examLocationId: ""
    };
    const [buttonLoading, setButtonLoading] = useState<any>({});
    const [list, setList] = useState<ExamLocationModel[]>([]);
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
        getList(1);
    }, []);

    const deleteRecord = (id: string) => {
        Modal.confirm({
            title: 'Cảnh báo',
            content: `Xác nhận xóa bản ghi này?`,
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk: async () => {
                const response = await deleteExamLocation(id);
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
    const onHandleShowModelEdit = async (id: string) => {
        setButtonLoading((prevState: any) => ({ ...prevState, [id]: true }));
        const response: ResponseData<ExamLocationModel> = await getExamLocationById(id) as ResponseData<ExamLocationModel>;

        const responseDistricts: ResponseData = await getAministrativeDivisions1(response.data?.provinceId as string);
        const dataDistricts = responseDistricts.data as ProvinceModel;
        const districtOptions = ConvertOptionSelectModel(dataDistricts.districts as OptionModel[]);
        // const examLocationScheduleOptions = ConvertOptionSelectModel(responseExamLocationSchedule.data as OptionModel[]);
        if (response.code === Code._200) {
            setOpenEdit(true)
            setButtonLoading((prevState: any) => ({ ...prevState, [id]: false }));
            const stateDispatcher = {
                examLocationEdit: response.data,
                examLocationId: id,
                districtsByProvinceId: [
                    {
                        key: 'Default',
                        label: '-Chọn-',
                        value: '',
                    } as SelectOptionModel
                ].concat(districtOptions),
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
            const response: ResponseData = await getExamLocation(
                JSON.stringify(filter)
            );
            setList((response.data || []) as ExamLocationModel[]);
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

    const columns: ColumnsType<ExamLocationModel> = [
        {
            title: 'Địa điểm thi',
            dataIndex: 'name',
            key: "name",
            render: (_, record) => <span>{record.name}</span>,
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
                    provinces={provinces}
                />
            }
            {openEdit &&
                <ExamLocationEditTFC
                    open={openEdit}
                    setOpen={setOpenEdit}
                    reload={searchFormSubmit}
                    examSchedule={examSchedule}
                    provinces={provinces}
                    districtInits={state.districtsByProvinceId}
                    recordEdit={state.examLocationEdit}
                    examLocationId={state.examLocationId}
                />
            }
        </div>
    );
}

export default ExamLocationTFC;
