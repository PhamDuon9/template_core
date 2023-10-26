import { Code, ResponseData } from "@/apis";
import { ExamLocationRoomMapScheduleModel } from "@/apis/models/toefl-challenge/ExamLocationRoomMapScheduleModel";
import { ExamLocationScheduleModel } from "@/apis/models/toefl-challenge/ExamLocationScheduleModel";
import { ExamScheduleModel } from "@/apis/models/toefl-challenge/ExamScheduleModel";
import { RegistrationExamType } from "@/apis/models/toefl-challenge/RegistrationExamType";
import { getExamLocation4, getExamLocationSchedule } from "@/apis/services/toefl-challenge/ExamLocationService";
import { examLocationMapScheduleState } from "@/store/exam-atom";
import { ConvertOptionSelectModel } from "@/utils/convert";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Form, FormInstance, PaginationProps, Popconfirm, Space, Table, Typography } from "antd";
import { useEffect, useReducer, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import EditableCell from "./edit-cell";
import { OptionModel, SelectOptionModel } from "@/@types/data";

interface Props extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
    examSchedule: ExamScheduleModel;
    examLocationId: string;
    examLocationRoomId: string;
}

const ExamLocationRoomMapScheduleEdit: React.FC<Props> = ({
    children,
    examSchedule,
    examLocationId,
    examLocationRoomId,
    ...restProps
}) => {
    const initState = {
        examLocationMapScheduleOptions: [
            {
                key: 'Default',
                label: '-Chọn-',
                value: '',
            },
        ],
        registrationExamTypes: [
            {
                key: 'Default',
                label: '-Chọn-',
                value: '',
            },
            {
                key: RegistrationExamType._1,
                label: 'TOEFL Primary',
                value: RegistrationExamType._1,
            },
            {
                key: RegistrationExamType._2,
                label: 'TOEFL Junior',
                value: RegistrationExamType._2,
            },
            {
                key: RegistrationExamType._3,
                label: 'TOEFL ITP',
                value: RegistrationExamType._3,
            },
            {
                key: RegistrationExamType._4,
                label: 'TOEFL iBT',
                value: RegistrationExamType._4,
            },
        ]
    }

    const [state, dispatch] = useReducer<(prevState: any, updatedProperty: any) => any>((prevState: any, updatedProperty: any) => ({
        ...prevState,
        ...updatedProperty,
    }), initState);
    const [data, setData] = useRecoilState<ExamLocationRoomMapScheduleModel[]>(examLocationMapScheduleState);
    const showTotal: PaginationProps['showTotal'] = (total) => `Total ${total} items`;
    const formRef = useRef<FormInstance>(null);
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setData([])
        const loadData = async () => {
            setLoading(true)
            if (examLocationId) {
                const filter = {
                    ExamId: examSchedule.examId,
                    ExamScheduleId: examSchedule.id,
                    ExamLocationId: examLocationId
                }
                const responseExamLocationSchedule: ResponseData<ExamLocationScheduleModel[]> = await getExamLocationSchedule(JSON.stringify(filter)) as ResponseData<ExamLocationScheduleModel[]>;
                if (responseExamLocationSchedule.code === Code._200) {
                    const examLocationMapScheduleOptions = ConvertOptionSelectModel(responseExamLocationSchedule.data as OptionModel[]);
                    const stateDispatcher = {
                        examLocationMapScheduleOptions: [
                            {
                                key: 'Default',
                                label: '-Chọn-',
                                value: '',
                            } as SelectOptionModel
                        ].concat(examLocationMapScheduleOptions),
                    };
                    dispatch(stateDispatcher);
                }
            }
            const filter = {
                ExamId: examSchedule.examId,
                ExamScheduleId: examSchedule.id,
                ExamLocationId: examLocationId,
                ExamLocationRoomId: examLocationRoomId,
            }
            const responseExamLocationSchedule: ResponseData<ExamLocationRoomMapScheduleModel[]> = await getExamLocation4(JSON.stringify(filter)) as ResponseData<ExamLocationRoomMapScheduleModel[]>;
            if (responseExamLocationSchedule.code === Code._200) {
                setData(responseExamLocationSchedule.data as ExamLocationRoomMapScheduleModel[])
                setLoading(false)
            }
        }
        loadData()
    }, [examSchedule, examLocationId])
    // const [data, setData] = useState<ExamLocationScheduleModel[]>([]);
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record: ExamLocationRoomMapScheduleModel) => record.id === editingKey;

    const edit = (record: Partial<ExamLocationRoomMapScheduleModel>) => {
        formRef?.current?.setFieldsValue({ ...record, });
        setEditingKey(record.id as string);
    };

    const cancel = () => {
        setEditingKey('');
    };
    const saveRow = async (id: string) => {
        try {
            let row = (await formRef?.current?.validateFields()) as ExamLocationRoomMapScheduleModel;

            row = {
                ...row,
                examLocationScheduleId: row.examLocationScheduleSelect?.value as string,
                examType: +(row.examTypeSelect?.value ?? 0)
            }
            const newData = [...data];
            const index = newData.findIndex((item) => id === item.id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
    }

    const handleDelete = (id: string) => {
        const newData = data.filter((item) => item.id !== id);
        setData(newData);
    };
    const columns = [
        {
            title: 'Ca thi',
            dataIndex: 'examLocationScheduleSelect',
            inputType: 'select',
            key: "examLocationScheduleSelect",
            width: '30%',
            editable: true,
            render: (_: any, record: ExamLocationRoomMapScheduleModel) => <span>{record.examLocationScheduleSelect?.label}</span>,
        },
        {
            title: 'Bài thi',
            dataIndex: 'examTypeSelect',
            inputType: 'select',
            key: 'examTypeSelect',
            width: '25%',
            editable: true,
            render: (_: any, record: ExamLocationRoomMapScheduleModel) => <span>{record.examTypeSelect?.label}</span>,
        },
        {
            title: 'Số lượng',
            dataIndex: 'amount',
            key: 'amount',
            inputType: 'number',
            width: '25%',
            editable: true,
        },
        {
            title: 'Thao tác',
            dataIndex: 'operation',
            width: '20%',
            key: 'operation',
            render: (_: any, record: ExamLocationRoomMapScheduleModel) => {
                const editable = isEditing(record);
                return editable ? (
                    <Space>
                        <Typography.Link onClick={() => saveRow(record.id as string)} style={{ marginRight: 8 }}>
                            <Button type='dashed'>Lưu</Button>
                        </Typography.Link>
                        <Popconfirm title="Những thay đổi bạn đã thực hiện có thể không được lưu" onConfirm={cancel}>
                            <Button type='text' danger>Hủy bỏ</Button>
                        </Popconfirm>
                    </Space>
                ) : (
                    <Space>
                        <Typography.Link title='Chỉnh sửa' disabled={editingKey !== ''} onClick={() => edit(record)}>
                            <Button type='text'>
                                <EditOutlined />
                            </Button>
                        </Typography.Link>
                        <Typography.Link title='Chỉnh sửa' disabled={editingKey !== ''} onClick={() => handleDelete(record.id as string)}>
                            <Button type='text' danger>
                                <DeleteOutlined />
                            </Button>
                        </Typography.Link>
                    </Space>

                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: ExamLocationRoomMapScheduleModel) => ({
                record,
                inputType: col.inputType,
                dataIndex: col.dataIndex,
                optionDatas: col.dataIndex == 'examLocationScheduleSelect' ? state.examLocationMapScheduleOptions : state.registrationExamTypes,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    const handleAdd = () => {
        const newData: ExamLocationRoomMapScheduleModel = {
            // key: count,
            id: uuidv4(),
            examType: undefined,
            examLocationScheduleId: ``,
            amount: 0,
        };
        setData([...data, newData]);
    };
    return (
        <Form ref={formRef} component={false}>
            <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
                Thêm dòng
            </Button>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                bordered
                loading={loading}
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                    onChange: cancel,
                    showTotal
                }}
                scroll={{ y: '400px' }}
            />
        </Form>
    );
};
export default ExamLocationRoomMapScheduleEdit

