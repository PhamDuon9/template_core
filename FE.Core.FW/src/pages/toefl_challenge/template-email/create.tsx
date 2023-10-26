import { SelectOptionModel } from '@/@types/data';
import { Code } from '@/apis';
import { postEmailTemplate } from '@/apis/services/toefl-challenge/EmailTemplateService';
import Editor from '@/components/CKEditor';
import { Col, Form, Input, Modal, Row, Select, message } from 'antd';
import React, { useReducer, useState } from 'react';

interface Props {
    temp: SelectOptionModel[]
    open: boolean;
    setOpen: (value: boolean) => void;
    reload: (current: number, pageSize: number) => void;
}
const CreateTemplateEmail: React.FC<Props> = ({ temp, open, setOpen, reload }) => {
    const [searchForm] = Form.useForm();
    // const [open, setOpen] = useState(false);

    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalButtonOkText, setModalButtonOkText] = useState('Lưu');
    const initState = {
        emailTemplateType: []
    }

    const [state, dispatch] = useReducer<(prevState: any, updatedProperty: any) => any>((prevState: any, updatedProperty: any) => ({
        ...prevState,
        ...updatedProperty,
    }), initState);


    const handleOk = async () => {
        const fieldsValue = await searchForm.validateFields();
        setModalButtonOkText('Đang xử lý...');
        setConfirmLoading(true);
        searchForm.resetFields()

        const objBody = {
            ...fieldsValue,
        }
        console.log(objBody)
        // return

        const response = await postEmailTemplate(objBody);
        if (response.code === Code._200) {
            message.success(response.message || "Tạo thành công")
            setOpen(false);
            setConfirmLoading(false);
            reload(1, 20)
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
            <Modal title="Tạo mới mẫu email" open={open} okText={modalButtonOkText} cancelText="Bỏ qua" width={'75vw'}
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
                        ["Subject"]: '',
                        ["EmailTemplateType"]: '',
                        ["Body"]: '',
                    }}
                >
                    <Row gutter={16} justify='start'>
                        <Col span={24}>
                            <Form.Item
                                label={'Loại email'}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                name='EmailTemplateType'
                                rules={[{ required: true }]}
                            >
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                    }
                                    placeholder='Chọn' options={temp} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label={'Subject'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Subject' rules={[{ required: true }]}>
                                <Input placeholder='Nhập Subject' allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label={'Body'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Body' rules={[{ required: true }]}>
                                <Editor />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
}

export default CreateTemplateEmail;