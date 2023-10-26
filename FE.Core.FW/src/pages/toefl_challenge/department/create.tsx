import { SelectOptionModel } from '@/@types/data';
import { Code } from '@/apis';
import { ResponseData } from '@/apis/models/ResponseData';
import { getDistrictByProvince } from '@/apis/services/PageService';
import { postDepartmentCreate } from '@/apis/services/toefl-challenge/DepartmentService';
import { ConvertOptionSelectModel } from '@/utils/convert';
import { Col, Form, Input, Modal, Row, Select, message } from 'antd';
import React, { useEffect, useReducer, useState } from 'react';

interface Props {
    open: boolean;
    provinces: SelectOptionModel[]
    setOpen: (value: boolean) => void;
    reload: (current: number, pageSize: number) => void;
}
const CreateDepartment: React.FC<Props> = ({ open, setOpen, reload, provinces }) => {
    const [searchForm] = Form.useForm();
    // const [open, setOpen] = useState(false);

    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalButtonOkText, setModalButtonOkText] = useState('Lưu');
    const initState = {
        districts: [],
    }

    const [state, dispatch] = useReducer<(prevState: any, updatedProperty: any) => any>((prevState: any, updatedProperty: any) => ({
        ...prevState,
        ...updatedProperty,
    }), initState);

    const getList = async (): Promise<void> => {

        const stateDispatcher = {
            districts: [{
                key: 'Default',
                label: '-Chọn-',
                value: '',
            }],
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
        console.log(objBody)
        // return

        const response = await postDepartmentCreate(objBody);
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
        whitespace: '${label} không được để trống',
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
            <Modal title="Tạo mới thông tin Sở giáo dục" open={open} okText={modalButtonOkText} cancelText="Bỏ qua" width={800}
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
                        ["ProvinceId"]: '',
                    }}
                >
                    <Row gutter={16} justify='start'>

                        <Col span={12}>
                            <Form.Item label={'Tên sở giáo dục'} labelCol={{ span: 24 }} wrapperCol={{ span: 17 }} name='Name' rules={[{ required: true, whitespace: true }]}>
                                <Input placeholder='Nhập tên sở giáo dục' allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={'Tỉnh/TP'}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 17 }}
                                name='ProvinceId'
                                rules={[{ required: true }]}
                            >
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                    }
                                    placeholder='Chọn Tỉnh/TP' options={provinces} />
                            </Form.Item>
                        </Col>

                    </Row>
                </Form>
            </Modal>
        </>
    );
}

export default CreateDepartment;