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
    Popconfirm,
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
import { useEffect, useReducer, useRef, useState } from 'react';

import { Code } from '@/apis';
import { AdministrativeUnitModel } from '@/apis/models/AdministrativeUnitModel';
import {
    ConvertOptionSelectModel
} from '@/utils/convert';
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import EditableCell from './edit';
import { OptionModel, SelectOptionModel } from '@/@types/data';
import { putAdministrativeUnit } from '@/apis/services/AdministrativeUnitService';
import { DataNode } from 'antd/es/tree';
const { Text } = Typography;
interface Props {
    open: boolean;
    administrativeUnitEdit: AdministrativeUnitModel;
    administrativeUnits:DataNode[];
    initLoadingModal: boolean;
    setOpen: (value: boolean) => void;
    reload: (current: number, pageSize: number) => void;
}
const Edit: React.FC<Props> = ({ open, setOpen, reload, administrativeUnitEdit, administrativeUnits, initLoadingModal }) => {
    const [searchForm] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalButtonOkText, setModalButtonOkText] = useState('Lưu');
    // const initState = {
    //     branches: [],
    //     departments: [],
    // }
    // const [state, dispatch] = useReducer<(prevState: any, updatedProperty: any) => any>((prevState: any, updatedProperty: any) => ({
    //     ...prevState,
    //     ...updatedProperty,
    // }), initState);

    const handleOk = async () => {
        const fieldsValue = await searchForm.validateFields();
        setConfirmLoading(true);
        // searchForm.resetFields()

        const objBody: AdministrativeUnitModel = {
            ...fieldsValue,
            ParentId: fieldsValue.ParentId ? fieldsValue.ParentId : undefined,
        }

        const response = await putAdministrativeUnit(administrativeUnitEdit?.id ?? "", "", objBody);
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
    const onChangeBranch = async () => {
        // const fieldsValue = await formRef.current?.getFieldsValue();
        // formRef.current?.setFieldsValue({
        //     "ParentId": '',
        // })

        // const filter = {
        //     BranchId: fieldsValue.BranchId ? fieldsValue.BranchId : undefined,
        // }

        // const responseDepartment: ResponseData = await getDepartment(JSON.stringify(filter));
        // const optionDepartment = ConvertOptionSelectModel(responseDepartment.data as OptionModel[]);
        // const stateDispatcher = {
        //     departments: [{
        //         key: 'Default',
        //         label: '-Chọn-',
        //         value: '',
        //     } as SelectOptionModel].concat(optionDepartment),
        // };
        // dispatch(stateDispatcher);
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

            <Modal title="Cập nhật đơn vị hành chính" open={open} okText={modalButtonOkText} cancelText="Hủy bỏ" width={500}
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
                            ["Code"]: administrativeUnitEdit?.code,
                            ["Name"]: administrativeUnitEdit?.name,
                            ["Description"]: administrativeUnitEdit?.description,
                            ["ParentId"]: administrativeUnitEdit?.parentId,
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
                </Spin>
            </Modal>
        </>
    );
}

export default Edit;
