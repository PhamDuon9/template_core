import React, { useEffect, useReducer, useState } from 'react';
import { Button, Col, Form, Modal, Row, Select, message, Input, DatePicker, Spin, Typography, TreeSelect } from 'antd';
import { Code, ResponseData, RoleModel, UserModel } from '@/apis';
import dayjs from 'dayjs';
import { getUserById, postUser, putUser } from '@/apis/services/UserService';
import moment from 'moment';
import { DataNode } from 'antd/lib/tree';
const { Text } = Typography;
interface Props {
    open: boolean;
    userEdit: UserModel;
    initLoadingModal: boolean;
    setOpen: (value: boolean) => void;
    reload: (current: number, pageSize: number) => void;
    iigdepartments: DataNode[],
}
const Edit: React.FC<Props> = ({ open, setOpen, reload, userEdit, initLoadingModal, iigdepartments }) => {
    // console.log(userEdit)
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
            DOB: fieldsValue.DOB ? fieldsValue.DOB : undefined
        }
        // console.log(objBody)
        // return

        const response = await putUser(userEdit?.id ?? "", "", objBody);
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

            <Modal title="Cập nhật thông tin người dùng" open={open} okText={modalButtonOkText} cancelText="Hủy bỏ" width={500}
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
                            ["Email"]: userEdit.email ?? '',
                            // ["DOB"]: userEdit.dob ? dayjs(userEdit.dob, "DD/MM/YYYY") : '',
                            ["DOB"]: userEdit.dob ? moment(userEdit.dob) : '',
                            ["Phone"]: userEdit.phone ?? '',
                            ["DepartmentId"]: userEdit?.departmentId,
                        }}
                    >
                        <Row gutter={16} justify='start'>
                            <Col span={24}>
                                <Form.Item label={'Tên đăng nhập'} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} name='Username'>
                                    <Text strong>{userEdit.username}</Text>
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
                </Spin>
            </Modal>
        </>
    );
}

export default Edit;