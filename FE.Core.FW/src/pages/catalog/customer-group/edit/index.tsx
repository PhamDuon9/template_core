import { ResponseData } from '@/utils/request';
import {
    Button,
    Card,
    Col,
    Divider,
    Form,
    Modal,
    Input,
    Popconfirm,
    Row,
    Select,
    Space,
    Spin,
    Table,
    Tooltip,
    Typography,
    message
} from 'antd';
import { useEffect, useReducer, useRef, useState } from 'react';

import { Code } from '@/apis';
import { CustomerGroupModel } from '@/apis/models/CustomerGroupModel'; 
import { getCustomerGroupById, putCustomerGroup } from '@/apis/services/CustomerGroupService';

interface Props {
    open: boolean;
    customerGroupEdit: CustomerGroupModel;
    initLoadingModal: boolean;
    setOpen: (value: boolean) => void;
    reload: (current: number, pageSize: number) => void;
}
const Edit: React.FC<Props> = ({ open, setOpen, reload, customerGroupEdit, initLoadingModal }) => {
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
            ...fieldsValue
        }
        // console.log(objBody)
        // return

        const response = await putCustomerGroup(customerGroupEdit?.id ?? "", "", objBody);
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
                            ["Code"]: customerGroupEdit?.code,
                            ["Name"]: customerGroupEdit?.name,
                            ["Description"]: customerGroupEdit?.description,
                        }}
                    >
                        <Row gutter={16} justify='start'>
                            <Col span={24}>
                                <Form.Item label={'Mã chi nhánh'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Code' rules={[{ required: true, whitespace: true }]}>
                                    <Input placeholder='Nhập mã chi nhánh' allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label={'Tên chi nhánh'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Name' rules={[{ required: true, whitespace: true }]}>
                                    <Input placeholder='Nhập tên chi nhánh' allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label={'Mô tả'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Description'>
                                    <Input placeholder='Nhập mô tả' allowClear />
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
