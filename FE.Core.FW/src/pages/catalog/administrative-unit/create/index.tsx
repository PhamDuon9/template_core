import { ResponseData } from '@/utils/request';
import {
    Button,
    Card,
    Checkbox,
    Col,
    Modal,
    Form,
    FormInstance,
    Input,
    Row,
    Select,
    Space,
    Spin,
    Table,
    Tooltip,
    TreeSelect,
    Typography,
    message
} from 'antd';
import { useEffect, useReducer, useState } from 'react';

import { Code } from '@/apis';
import { AdministrativeUnitModel } from '@/apis/models/AdministrativeUnitModel';
import {
    ConvertOptionSelectModel
} from '@/utils/convert';
import { OptionModel, SelectOptionModel } from '@/@types/data';
import { getBranch } from '@/apis/services/BranchService';
import { getAdministrativeUnitTree, postAdministrativeUnit } from '@/apis/services/AdministrativeUnitService';
import { DataNode } from 'antd/es/tree';
const { Text } = Typography;
interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
    reload: (current: number, pageSize: number) => void;
    administrativeUnits: DataNode[];
}

const Create: React.FC<Props> = ({ open, setOpen, reload, administrativeUnits }) => {
    const [searchForm] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalButtonOkText, setModalButtonOkText] = useState('Lưu');

    const handleOk = async () => {
        const fieldsValue = await searchForm.validateFields();
        // setModalButtonOkText('Đang xử lý...');
        setConfirmLoading(true);
        // searchForm.resetFields()

        const objBody: AdministrativeUnitModel = {
            ...fieldsValue,
            ParentId: fieldsValue.ParentId ? fieldsValue.ParentId : undefined,
        }

        const response = await postAdministrativeUnit("", objBody);
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
            <Modal title='Thêm đơn vị hành chính'
                open={open} okText={modalButtonOkText} cancelText="Hủy bỏ" width={500}
                style={{ top: 20 }} onCancel={handleCancel}
                confirmLoading={confirmLoading}
                okButtonProps={{ form: 'myFormCreate', htmlType: 'submit' }}
            >
                <Form
                    form={searchForm}
                    name='nest-messages' id="myFormCreate"
                    onFinish={handleOk}
                    validateMessages={validateMessages}
                    initialValues={{
                        ["Code"]: '',
                        ["Name"]: '',
                        ["Description"]: '',
                        ["ParentId"]: '',
                    }}
                >
                    <Row gutter={16} justify='start'>
                        <Col span={24}>
                            <Form.Item label={'Mã đơn vị hành chính'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Code' rules={[{ required: true, whitespace: true }]}>
                                <Input placeholder='Nhập mã đơn vị hành chính' allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label={'Tên đơn vị hành chính'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Name' rules={[{ required: true, whitespace: true }]}>
                                <Input placeholder='Nhập tên đơn vị hành chính' allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label={'Đơn vị hành chính cha'}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                name='ParentId'
                            >
                                <TreeSelect
                                    showSearch
                                    treeLine
                                    style={{ width: '100%' }}
                                    // value={value}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    placeholder="-Chọn đơn vị hành chính-"
                                    allowClear
                                    // treeDefaultExpandAll
                                    showCheckedStrategy={TreeSelect.SHOW_CHILD}
                                    treeData={administrativeUnits}
                                    treeNodeFilterProp="title"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label={'Mô tả'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Description'>
                                <Input placeholder='Nhập mô tả' allowClear />
                            </Form.Item>
                        </Col>

                    </Row>
                </Form>
            </Modal>
        </>
    );
}

export default Create;
