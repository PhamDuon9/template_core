import { Code, RoleModel } from '@/apis';
import { assignAccessData } from '@/apis/services/RoleService';
import { Col, Form, Modal, Row, TreeSelect, Typography, message } from 'antd';
import type { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
const { Text } = Typography;
interface Props {
    open: boolean;
    roleEdit: RoleModel;
    accessData: Omit<DefaultOptionType, 'label'>[];
    setOpen: (value: boolean) => void;
    reload: (current: number, pageSize: number) => void;
}
const AccessDataRole: React.FC<Props> = ({ open, setOpen, reload, roleEdit, accessData }) => {
    // const [value, setValue] = useState(['04f5211f-8927-47a1-8ce4-0ae8a0bfef84']);

    const onChange = (newValue: string[]) => {
        // console.log('onChange ', value);
        // setValue(newValue);
    };
    const { SHOW_PARENT, SHOW_CHILD } = TreeSelect;

    const [treeData, setTreeData] = useState<Omit<DefaultOptionType, 'label'>[]>([
        {
            title: 'Node2',
            value: '2',
            key: '2',
            disableCheckbox: true,
            children: [
                {
                    title: 'Child Node3',
                    value: '3',
                    key: '3',
                },

            ],
        },
    ]);
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
    useEffect(() => {
        setTreeData(accessData)
        setCheckedKeys(roleEdit?.accessDataHeaderQuater ? roleEdit?.accessDataHeaderQuater?.split(',') : [])
    }, [accessData.length])
    const tProps = {
        showSearch: true,
        allowClear: true,
        treeData,
        treeLine: true,
        treeNodeFilterProp: 'title',
        // value,
        onChange,
        treeDefaultExpandAll: true,
        treeCheckable: true,
        showCheckedStrategy: SHOW_CHILD,
        placeholder: '-Chọn địa điểm-',
        style: {
            width: '100%',
        },
    };
    // const tProps = {
    //     treeData,
    //     showLine: true,
    //     checkable: true,
    //     defaultExpandAll: true,
    //     showCheckedStrategy: SHOW_CHILD,
    //     // checkedKeys: checkedKeys,
    //     style: {
    //         width: '100%',
    //     },
    // };
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
            AccessDataHeaderQuater: fieldsValue.AccessDataHeaderQuater ? fieldsValue.AccessDataHeaderQuater.toString() : ''
        }
        // console.log(objBody)
        // setConfirmLoading(false);
        // return

        const response = await assignAccessData(roleEdit?.id ?? "", "", objBody);
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
                    <Text strong>Phân quyền truy cập dữ liệu</Text>
                </>
            } open={open} okText={modalButtonOkText} cancelText="Hủy bỏ" width={'75vw'}
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
                        ["Name"]: roleEdit.name ?? '',
                        ["Code"]: roleEdit.code ?? '',
                        ["Id"]: roleEdit.id?.toLowerCase(),
                        ["AccessDataHeaderQuater"]: roleEdit?.accessDataHeaderQuater ? roleEdit?.accessDataHeaderQuater?.split(',') : [],
                    }}
                >
                    <Row gutter={16} justify='start'>
                        <Col span={12}>
                            <Form.Item labelAlign='left' label={<Text strong>Mã vai trò</Text>} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} name='Code'>
                                <Text>{roleEdit.code}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item labelAlign='left' label={<Text strong>Tên vai trò</Text>} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} name='Name'>
                                <Text>{roleEdit.name}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label={<Text strong>Địa điểm</Text>} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='AccessDataHeaderQuater'>
                                <TreeSelect {...tProps} />
                                {/* <Tree {...tProps} /> */}

                                {/* <TreeSelect
                                    showSearch
                                    style={{ width: '100%' }}
                                    value={value}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    placeholder="Please select"
                                    allowClear
                                    multiple
                                    treeDefaultExpandAll
                                    onChange={onChange}
                                    treeData={treeData}
                                /> */}
                            </Form.Item>
                        </Col>

                    </Row>
                </Form>
            </Modal>
        </>
    );
}

export default AccessDataRole;