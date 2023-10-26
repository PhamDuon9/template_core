import React, { useEffect, useReducer, useState } from 'react';
import { Button, Col, Form, Modal, Row, Select, message, Input, DatePicker, Spin, Typography } from 'antd';
import { Code, ResponseData, RoleModel, UserModel } from '@/apis';
import dayjs from 'dayjs';
import { asignRole, getUserById, postUser, putUser } from '@/apis/services/UserService';
import moment from 'moment';
import { SelectOptionModel } from '@/@types/data';
const { Text } = Typography;
interface Props {
    open: boolean;
    role: SelectOptionModel[];
    userEdit: UserModel;
    initLoadingModal: boolean;
    setOpen: (value: boolean) => void;
    reload: (current: number, pageSize: number) => void;
}
const UserRole: React.FC<Props> = ({ open, setOpen, reload, userEdit, role, initLoadingModal }) => {
    console.log(role)
    const [searchForm] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalButtonOkText, setModalButtonOkText] = useState('Lưu');

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

        const response = await asignRole(userEdit?.id ?? "", "", objBody);
        if (response.code === Code._200) {
            message.success(response.message || "Cập nhật thành công")
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

            <Modal title={
                <>
                    <Text strong>Phân quyền cho người dùng</Text>
                </>
            } open={open} okText={modalButtonOkText} cancelText="Hủy bỏ" width={460}
                           /* onOk={onSubmit}*/ style={{ top: 20 }} onCancel={handleCancel}
                confirmLoading={confirmLoading}
                okButtonProps={{ form: 'myFormCreate', htmlType: 'submit' }}
            >
                <Spin spinning={initLoadingModal}>
                    <Form
                        form={searchForm}
                        name='nest-messages' id="myFormCreate"
                        onFinish={handleOk}
                        validateMessages={validateMessages}
                        initialValues={{
                            ["Username"]: userEdit.username ?? '',
                            ["Fullname"]: userEdit.fullname ?? '',
                            ["RoleId"]: userEdit.roleId?.toLowerCase(),
                        }}
                    >
                        <Row gutter={16} justify='start'>
                            <Col span={24}>
                                <Form.Item label={<Text strong>Tên đăng nhập</Text>} labelCol={{ span: 24 }} wrapperCol={{ span: 16 }} name='Username'>
                                    <Text strong>{userEdit.username}</Text>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label={<Text strong>Tên người dùng</Text>} labelCol={{ span: 24 }} wrapperCol={{ span: 16 }} name='Fullname'>
                                    <Text strong>{userEdit.fullname}</Text>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label={<Text strong>Vai trò</Text>} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='RoleId'>
                                    <Select
                                        showSearch
                                        allowClear
                                        optionFilterProp="children"
                                        filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                        }
                                        placeholder='Tìm kiếm' options={role} />
                                </Form.Item>
                            </Col>

                        </Row>
                    </Form>
                </Spin>
            </Modal>
        </>
    );
}

export default UserRole;