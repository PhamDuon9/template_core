import React, { useEffect, useReducer, useState } from 'react';
import { Button, Col, Form, Modal, Row, Select, message, Input, DatePicker, Spin, Typography } from 'antd';
import { Code, ResponseData, RoleModel, UserModel } from '@/apis';
import dayjs from 'dayjs';
import { changePasswordUser, getUserById, postUser, putUser } from '@/apis/services/UserService';
import moment from 'moment';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
const { Text } = Typography;
interface Props {
    open: boolean;
    userEdit: UserModel;
    setOpen: (value: boolean) => void;
    logOut: () => void;
}
const ChangePassword: React.FC<Props> = ({ open, setOpen, userEdit, logOut }) => {
    // console.log(userEdit)
    const [searchForm] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalButtonOkText, setModalButtonOkText] = useState('Lưu');

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

        const response = await changePasswordUser(userEdit?.syncId ?? "", "", objBody);
        if (response.code === Code._200) {
            message.success(response.message || "Cập nhật thành công")
            setOpen(false);
            setConfirmLoading(false);
            logOut()
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

            <Modal title="Thay đổi mật khẩu người dùng" open={open} okText={modalButtonOkText} cancelText="Hủy bỏ" width={500}
                           /* onOk={onSubmit}*/ style={{ top: 20 }} onCancel={handleCancel}
                confirmLoading={confirmLoading}
                okButtonProps={{ form: 'myFormCreate', htmlType: 'submit' }}
            >
                <Spin spinning={false}>
                    <Form
                        form={searchForm}
                        name='nest-messages' id="myFormCreate"
                        onFinish={handleOk}
                        validateMessages={validateMessages}
                        initialValues={{
                            ["Username"]: userEdit.username ?? '',
                            ["Fullname"]: userEdit.fullname ?? '',
                            ["NewPassword"]: '',
                            ["ConfirmNewPassword"]: '',
                        }}
                    >
                        <Row gutter={16} justify='start'>
                            <Col span={24}>
                                <Form.Item label={'Tên đăng nhập'} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} name='Username'>
                                    <Text strong>{userEdit.username}</Text>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label={'Tên người dùng'} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} name='Fullname'>
                                    <Text strong>{userEdit.fullname}</Text>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label={'Mật khẩu mới'} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} name='NewPassword'
                                    rules={[{ required: true }]}
                                    hasFeedback>
                                    <Input.Password
                                        placeholder="Nhập mật khẩu mới"
                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label={'Xác nhận mật khẩu'} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} name='ConfirmNewPassword'
                                    dependencies={['NewPassword']}
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('NewPassword') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Xác nhận mật khẩu mới chưa khớp!'));
                                            },
                                        }),
                                    ]}>
                                    <Input.Password
                                        placeholder="Nhập xác nhận mật khẩu mới"
                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        </>
    );
}

export default ChangePassword;