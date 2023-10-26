import React, { useEffect, useReducer, useState } from 'react';
import { Button, Col, Form, Modal, Row, Select, message, Input, DatePicker, Typography, Space, TreeSelect } from 'antd';
import { Code, RoleModel } from '@/apis';
import dayjs from 'dayjs';
import { postUser } from '@/apis/services/UserService';
import { DataNode } from 'antd/lib/tree';
const { Text, Paragraph } = Typography;
interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
    reload: (current: number, pageSize: number) => void;
    iigdepartments: DataNode[],
}
const Create: React.FC<Props> = ({ open, setOpen, reload, iigdepartments }) => {
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

    // const getList = async (): Promise<void> => {
    //     const responseRole: ResponseData = await getRole();

    //     const role = responseRole && responseRole.code === Code._200 ? responseRole.data as RoleModel[] : [];

    //     type typeOption = {
    //         id: string,
    //         name: string
    //     };
    //     const stateDispatcher = {
    //         role: ConvertOptionModel<typeOption>(role as typeOption[]),
    //     }
    //     dispatch(stateDispatcher)


    // };

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
            DOB: fieldsValue.DOB ? fieldsValue.DOB : undefined
        }
        // console.log(objBody)
        // return

        const response = await postUser("", objBody);
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
            <Modal title={<Text>Thêm người dùng</Text>}
                open={open} okText={modalButtonOkText} cancelText="Hủy bỏ" width={500}
                           /* onOk={onSubmit}*/ style={{ top: 20 }} onCancel={handleCancel}
                confirmLoading={confirmLoading}
                okButtonProps={{ form: 'myFormCreate', htmlType: 'submit' }}
            >
                <Space>
                    <Paragraph strong>Mật khẩu mặc định:</Paragraph>
                    <Paragraph copyable>12345678</Paragraph>
                </Space>
                <Form
                    form={searchForm}
                    name='nest-messages' id="myFormCreate"
                    onFinish={handleOk}
                    validateMessages={validateMessages}
                    initialValues={{
                        ["Username"]: '',
                        ["Fullname"]: '',
                        ["Email"]: '',
                        ["DOB"]: '',
                        ["Phone"]: '',
                    }}
                >
                    <Row gutter={16} justify='start'>
                        <Col span={24}>
                            <Form.Item label={'Tên đăng nhập'} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} name='Username' rules={[{ required: true }]}>
                                <Input allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label={'Tên người dùng'} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} name='Fullname' rules={[{ required: true }]}>
                                <Input allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label={'Email'} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} name='Email' rules={[{ required: true }]}>
                                <Input allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label={'Ngày sinh'} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} name='DOB'>
                                <DatePicker format={'DD/MM/YYYY'} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label={'Số điện thoại'} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} name='Phone'>
                                <Input allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label={'Phòng ban'} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} name='DepartmentId'>
                                <TreeSelect
                                    showSearch
                                    treeLine
                                    style={{ width: '100%' }}
                                    // value={value}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    placeholder="-Chọn phòng ban-"
                                    allowClear
                                    treeDefaultExpandAll
                                    showCheckedStrategy={TreeSelect.SHOW_CHILD}
                                    treeData={iigdepartments}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
}

export default Create;