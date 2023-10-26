import { Code, RoleModel } from '@/apis';
import { ResponseData } from '@/apis/models/ResponseData';
import { createRole, getRole } from '@/apis/services/RoleService';
import { ConvertOptionModel } from '@/utils/convert';
import { Col, Form, Input, Modal, Row, Select, message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useReducer, useState } from 'react';

interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
    reload: (current: number, pageSize: number) => void;
}
const CreateRole: React.FC<Props> = ({ open, setOpen, reload }) => {
    const [searchForm] = Form.useForm();

    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalButtonOkText, setModalButtonOkText] = useState('Lưu');
    const initState = {
        role: []
    }

    const [state, dispatch] = useReducer<(prevState: any, updatedProperty: any) => any>((prevState: any, updatedProperty: any) => ({
        ...prevState,
        ...updatedProperty,
    }), initState);

    const getList = async (): Promise<void> => {
        const responseRole: ResponseData = await getRole();

        const role = responseRole && responseRole.code === Code._200 ? responseRole.data as RoleModel[] : [];

        type typeOption = {
            id: string,
            name: string
        };
        const stateDispatcher = {
            role: ConvertOptionModel<typeOption>(role as typeOption[]),
        }
        dispatch(stateDispatcher)


    };
    useEffect(() => {
        getList();
    }, []);


    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const handleOk = async () => {
        const fieldsValue = await searchForm.validateFields();
        setModalButtonOkText('Đang xử lý...');
        setConfirmLoading(true);
        searchForm.resetFields()

        const objBody = {
            ...fieldsValue,
        }
        // console.log(objBody)
        // return

        const response = await createRole("", objBody);
        if (response.code === Code._200) {
            message.success(response.message || "Tạo thành công")
            setOpen(false);
            setConfirmLoading(false);
            reload(1, 10)
        }
        else {
            setOpen(false);
            setConfirmLoading(false);
            message.error(response.message || "Thất bại")
        }
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        searchForm.resetFields()
        setOpen(false);
    };
    const validateMessages = {
        required: '${label} không được để trống',
        types: {
            email: '${label} không đúng định dạng email',
            number: '${label} không đúng định dạng số',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };

    return (
        <>
            <Modal title="Thêm vai trò" open={open} okText={modalButtonOkText} cancelText="Hủy bỏ" width={500}
                           /* onOk={onSubmit}*/ style={{ top: 20 }} onCancel={handleCancel}
                confirmLoading={confirmLoading}
                okButtonProps={{ form: 'myFormCreate', htmlType: 'submit' }}
            >
                <Form
                    form={searchForm}
                    name='nest-messages' id="myFormCreate"
                    onFinish={handleOk}
                    validateMessages={validateMessages}
                    initialValues={{
                        ["Name"]: '',
                        ["Code"]: '',
                        ["RecordCloneId"]: '',
                        ["Description"]: '',
                    }}
                >
                    <Row gutter={16} justify='start'>
                        <Col span={24}>
                            <Form.Item label={'Mã'} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} name='Code' rules={[{ required: true }]}>
                                <Input allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label={'Tên vai trò'} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} name='Name' rules={[{ required: true }]}>
                                <Input allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label={'Nhân bản từ vai trò'} labelCol={{ span: 8 }} wrapperCol={{ span: 17 }} name='RecordCloneId' rules={[{ required: true }]}>
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                    }
                                    placeholder='Tìm kiếm' options={state.role} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label={'Mô tả vai trò'}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 17 }}
                                name='Description'
                                rules={[{ required: true }]}
                            >
                                <TextArea allowClear />
                            </Form.Item>
                        </Col>

                    </Row>
                </Form>
            </Modal>
        </>
    );
}

export default CreateRole;