import { ExamLocationScheduleModel } from "@/apis/models/toefl-challenge/ExamLocationScheduleModel";
import { examLocationScheduleState } from "@/store/exam-atom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Form, FormInstance, PaginationProps, Popconfirm, Space, Table, Typography } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import EditableCell from "./edit-cell";
import { Code, ResponseData } from "@/apis";
import { getExamLocationSchedule } from "@/apis/services/toefl-challenge/ExamLocationService";
import { ExamScheduleModel } from "@/apis/models/toefl-challenge/ExamScheduleModel";

interface Props extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
    examSchedule: ExamScheduleModel;
    examLocationId: string;
}

const ExamLocationScheduleEdit: React.FC<Props> = ({
    children,
    examSchedule,
    examLocationId,
    ...restProps
}) => {
    const [data, setData] = useRecoilState<ExamLocationScheduleModel[]>(examLocationScheduleState);
    const showTotal: PaginationProps['showTotal'] = (total) => `Total ${total} items`;
    const formRef = useRef<FormInstance>(null);
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setData([])
        const loadData = async () => {
            setLoading(true)
            const filter = {
                ExamId: examSchedule.examId,
                ExamScheduleId: examSchedule.id,
                ExamLocationId: examLocationId
            }
            const responseExamLocationSchedule: ResponseData<ExamLocationScheduleModel[]> = await getExamLocationSchedule(JSON.stringify(filter)) as ResponseData<ExamLocationScheduleModel[]>;
            if (responseExamLocationSchedule.code === Code._200) {
                setData(responseExamLocationSchedule.data as ExamLocationScheduleModel[])
                setLoading(false)
            }
        }
        loadData()
    }, [examSchedule, examLocationId])
    // const [data, setData] = useState<ExamLocationScheduleModel[]>([]);
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record: ExamLocationScheduleModel) => record.id === editingKey;

    const edit = (record: Partial<ExamLocationScheduleModel>) => {
        formRef?.current?.setFieldsValue({ ...record, startTime: record.startTime ? moment(record.startTime, 'HH:mm') : '', endTime: record.endTime ? moment(record.endTime, 'HH:mm') : '' });
        setEditingKey(record.id as string);
    };

    const cancel = () => {
        setEditingKey('');
    };
    const saveRow = async (id: string) => {
        try {
            let row = (await formRef?.current?.validateFields()) as ExamLocationScheduleModel;

            row = {
                ...row,
                startTime: dayjs(row.startTime).format('HH:mm'),
                endTime: dayjs(row.endTime).format('HH:mm')
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
            title: 'Tên ca thi',
            dataIndex: 'name',
            key: "name",
            width: '30%',
            editable: true,
        },
        {
            title: 'Thời điểm bắt đầu',
            dataIndex: 'startTime',
            inputType: 'time',
            key: 'startTime',
            width: '25%',
            editable: true,
            render: (_: any, record: ExamLocationScheduleModel) => <span>{record.startTime ? moment(record.startTime, 'HH:mm').format('HH:mm') : ''}</span>,
        },
        {
            title: 'Thời điểm kết thúc',
            dataIndex: 'endTime',
            key: 'endTime',
            inputType: 'time',
            width: '25%',
            editable: true,
            render: (_: any, record: ExamLocationScheduleModel) => <span>{record.endTime ? moment(record.endTime, 'HH:mm').format('HH:mm') : ''}</span>,
        },
        {
            title: 'Thao tác',
            dataIndex: 'operation',
            width: '20%',
            key: 'operation',
            render: (_: any, record: ExamLocationScheduleModel) => {
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
            onCell: (record: ExamLocationScheduleModel) => ({
                record,
                inputType: col.inputType === 'time' ? 'time' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    const handleAdd = () => {
        console.log(uuidv4())
        const newData: ExamLocationScheduleModel = {
            // key: count,
            id: uuidv4(),
            name: ``,
            startTime: ``,
            endTime: ``,
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
export default ExamLocationScheduleEdit

