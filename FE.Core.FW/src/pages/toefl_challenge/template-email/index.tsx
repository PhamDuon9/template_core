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
    message
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useReducer, useState } from 'react';

import {
    ConvertOptionSelectModel
} from '@/utils/convert';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
// import CreateDividingExamRoom from './CreateDividingExamRoom';
import { EmailTemplateModel } from '@/apis/models/toefl-challenge/EmailTemplateModel';
import { deleteManyDepartment } from '@/apis/services/toefl-challenge/DepartmentService';
import { deleteEmailTemplate, getEmailTemplate, getEmailTemplate1, getEmailTemplateType } from '@/apis/services/toefl-challenge/EmailTemplateService';
import Permission from '@/components/Permission';
import { PermissionAction, layoutCode } from '@/utils/constants';
import CreateTemplateEmail from './create';
import EditTemplateEmail from './edit';
import { OptionModel, SelectOptionModel } from '@/@types/data';
function DepartmentTFC() {
    // Load
    const { Panel } = Collapse;
    const initState = {
        recordEdit: {},
        emailTemplateType: []
    };
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    const [list, setList] = useState<EmailTemplateModel[]>([]);
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
        const fnGetInitState = async () => {
            const responseEmailTemplateType: ResponseData = await getEmailTemplateType();

            const emailTemplateTypeOptions = ConvertOptionSelectModel(responseEmailTemplateType.data as OptionModel[]);

            const stateDispatcher = {
                emailTemplateType: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                } as SelectOptionModel].concat(emailTemplateTypeOptions),
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
                const response = await deleteEmailTemplate(id);
                if (response.code === Code._200) {
                    message.success(response.message ?? "Xóa thành công")
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
                const response = await deleteManyDepartment(selectedRowDeleteKeys);
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
    const [showModelCreate, setShowModelCreate] = useState<boolean>(false);
    const [showModelEdit, setShowModelEdit] = useState<boolean>(false);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const onHandleShowModelCreate = async () => {
        setShowModelCreate(true);
    };

    // searchForm
    const [searchForm] = Form.useForm();
    const searchFormSubmit = async (current: number = 1, pageSize: number = 20): Promise<void> => {
        try {
            const fieldsValue = await searchForm.validateFields();
            setLoading(true)
            const filter = {
                emailTemplateType: fieldsValue.EmailTemplateType,
                page: current,
                size: pageSize,
                textSearch: fieldsValue.TextSearch
            }
            const response: ResponseData = await getEmailTemplate(
                JSON.stringify(filter)
            );
            setList((response.data || []) as EmailTemplateModel[]);
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

    const onHandleEdit = async (id: string) => {
        const response: ResponseData = await getEmailTemplate1(id);
        if (response.code == Code._200) {
            const stateDispatcher = {
                recordEdit: response.data,
            };
            dispatch(stateDispatcher);
            setShowModelEdit(true)
        }
    }



    const columns: ColumnsType<EmailTemplateModel> = [
        {
            title: 'STT',
            dataIndex: 'index',
            width: 80,
            render: (_, record, index) => <>{(pagination.current - 1) * pagination.pageSize + index + 1}</>,
        },
        {
            title: 'Loại email',
            dataIndex: 'emailTemplateType',
            render: (_, record) => <span>
                {
                    state.emailTemplateType.filter((type: { value: any; }) => type.value === record.emailTemplateType).map((filterType: { label: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
                        <span>
                            {filterType.label}
                        </span>
                    ))
                }
            </span >,
        },

        {
            title: 'Subject',
            dataIndex: 'subject',
            render: (_, record) => <span>{record.subject}</span>,
        },

        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: 300,
            render: (_, record) => (
                <Space>
                    <Permission noNode navigation={layoutCode.toeflChallengeTemplateEmail as string} bitPermission={PermissionAction.Edit}>
                        <Button type='dashed' title='Cập nhật' loading={false} onClick={() => onHandleEdit(record.id as string)}>
                            <EditOutlined />
                        </Button>
                    </Permission>
                    <Permission noNode navigation={layoutCode.toeflChallengeTemplateEmail as string} bitPermission={PermissionAction.Delete}>
                        <Button danger title='Xóa' loading={false} onClick={() => deleteRecord(record.id || '')}>
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
                                    <Permission noNode navigation={layoutCode.toeflChallengeTemplateEmail as string} bitPermission={PermissionAction.Add}>
                                        <Button htmlType='button' type='default' onClick={() => onHandleShowModelCreate()}>
                                            <PlusOutlined />
                                            Tạo mới
                                        </Button>
                                    </Permission>
                                    <Permission noNode navigation={layoutCode.toeflChallengeTemplateEmail as string} bitPermission={PermissionAction.Add}>
                                        {selectedRowDeleteKeys.length > 0 &&
                                            <Button htmlType='button' danger loading={loadingDelete} type='dashed' onClick={() => multiDeleteRecord()}>
                                                <DeleteOutlined />
                                                Xóa
                                            </Button>
                                        }
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
                                                ['TextSearch']: '',
                                                ['EmailTemplateType']: '',
                                            }}
                                        >
                                            <Row gutter={16} justify='start'>

                                                <Col span={8}>
                                                    <Form.Item
                                                        label={'Loại email'}
                                                        labelCol={{ span: 24 }}
                                                        wrapperCol={{ span: 17 }}
                                                        name='EmailTemplateType'
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
                                                            options={state.emailTemplateType}
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
                // rowSelection={{
                //     selectedRowKeys: selectedRowDeleteKeys,
                //     onChange: (selectedRowKeys: React.Key[]) => setSelectedRowDeleteKeys(selectedRowKeys.map(value => value.toString()))
                // }}
                />
            </Card>
            {showModelCreate && (
                <CreateTemplateEmail
                    temp={state.emailTemplateType}
                    open={showModelCreate}
                    setOpen={setShowModelCreate}
                    reload={searchFormSubmit}
                />
            )}
            {showModelEdit && (
                <EditTemplateEmail
                    temp={state.emailTemplateType}
                    open={showModelEdit}
                    setOpen={setShowModelEdit}
                    reload={searchFormSubmit}
                    recordEdit={state.recordEdit}
                />
            )}
        </div>
    );
}

export default DepartmentTFC;
