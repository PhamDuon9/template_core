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

import { Code, DepartmentModel } from '@/apis';
import {
    ConvertOptionSelectModel
} from '@/utils/convert';
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import EditableCell from './edit';
import { OptionModel, SelectOptionModel } from '@/@types/data';
import { getDepartment, getDepartmentById, getDepartmentTree, putDepartment } from '@/apis/services/DepartmentService';
import { getBranch } from '@/apis/services/BranchService';
import { DataNode } from 'antd/es/tree';
const { Text } = Typography;
interface Props {
    open: boolean;
    departmentEdit: DepartmentModel;
    branches:SelectOptionModel[];
    departments:DataNode[];
    initLoadingModal: boolean;
    setOpen: (value: boolean) => void;
    reload: (current: number, pageSize: number) => void;
}
const Edit: React.FC<Props> = ({ open, setOpen, reload, departmentEdit, branches, departments, initLoadingModal }) => {
    console.log(branches)
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

        const objBody: DepartmentModel = {
            ...fieldsValue,
            ParentId: fieldsValue.ParentId ? fieldsValue.ParentId : undefined,
            BranchId: fieldsValue.BranchId ? fieldsValue.BranchId : undefined,
        }

        const response = await putDepartment(departmentEdit?.id ?? "", "", objBody);
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

            <Modal title="Cập nhật thông tin phòng ban" open={open} okText={modalButtonOkText} cancelText="Hủy bỏ" width={500}
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
                            ["Code"]: departmentEdit?.code,
                            ["Name"]: departmentEdit?.name,
                            ["Description"]: departmentEdit?.description,
                            ["IsCom"]: departmentEdit?.isCom,
                            ["BranchId"]: departmentEdit?.branchId,
                            ["ParentId"]: departmentEdit?.parentId,
                        }}
                    >
                        <Row gutter={16} justify='start'>
                            <Col span={24}>
                                <Form.Item label={'Mã phòng ban'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Code' rules={[{ required: true, whitespace: true }]}>
                                    <Input placeholder='Nhập mã phòng ban' allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label={'Tên phòng ban'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Name' rules={[{ required: true, whitespace: true }]}>
                                    <Input placeholder='Nhập tên phòng ban' allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label={'Mô tả'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Description'>
                                    <Input placeholder='Nhập mô tả' allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label={' '} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='IsCom' valuePropName="checked">
                                    <Checkbox>Tính hoa hồng</Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label={'Chi nhánh'}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    name='BranchId'
                                    // rules={[{ required: true }]}
                                >
                                    <Select
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                                        // filterSort={(optionA, optionB) =>
                                        //     (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                        // }
                                        placeholder='-Chọn-' options={branches} onChange={() => onChangeBranch()} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label={'Phòng ban cha'}
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
                                        placeholder="-Chọn phòng ban-"
                                        allowClear
                                        treeDefaultExpandAll
                                        showCheckedStrategy={TreeSelect.SHOW_CHILD}
                                        treeData={departments}
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


// function DepartmentEdit() {
//     const navigate = useNavigate();
//     const params = useParams()
//     console.log(params);
//     // Load
//     const initState = {
//         branches: [],
//         departments: [],
//         recordEdit: {}
//     };
//     const [loading, setLoading] = useState<boolean>(false);

//     const { Title, Paragraph, Text, Link } = Typography;
//     const [state, dispatch] = useReducer<(prevState: any, updatedProperty: any) => any>(
//         (prevState: any, updatedProperty: any) => ({
//             ...prevState,
//             ...updatedProperty,
//         }),
//         initState,
//     );


//     useEffect(() => {
//         const fnGetInitState = async () => {
//             setLoading(true);
//             const responseRecordEdit: ResponseData = await getDepartment1(params.id);
//             const responseDataRecordEdit: DepartmentModel = responseRecordEdit.data as DepartmentModel;

//             const response: ResponseData = await getBranch();
//             const options = ConvertOptionSelectModel(response.data as OptionModel[]);

//             const responseDepartment: ResponseData = await getDepartment2();
//             const stateDispatcher = {
//                 branches: [{
//                     key: 'Default',
//                     label: '-Chọn-',
//                     value: '',
//                 } as SelectOptionModel].concat(options),
//                 departments: responseDepartment.data,
//                 recordEdit: responseDataRecordEdit
//             };
//             dispatch(stateDispatcher);
//             setLoading(false);
//         }
//         fnGetInitState()
//     }, []);

//     // Data
//     const [buttonLoading, setButtonLoading] = useState<boolean>(false);
//     const [buttonOkText, setButtonOkText] = useState<string>('Lưu');

//     // searchForm
//     const [form] = Form.useForm();
//     const formRef = useRef<FormInstance>(null);


//     const validateMessages = {
//         required: '${label} không được để trống',
//         whitespace: '${label} không được để trống',
//         types: {
//             email: '${label} không đúng định dạng email',
//             number: '${label} không đúng định dạng số',
//         },
//         number: {
//             range: '${label} must be between ${min} and ${max}',
//         },
//     };

//     const handleOk = async () => {
//         const fieldsValue = await formRef?.current?.validateFields();
//         setButtonOkText('Đang xử lý...');
//         setButtonLoading(true);

//         const objBody: DepartmentModel = {
//             ...fieldsValue,
//             ParentId: fieldsValue.ParentId ? fieldsValue.ParentId : undefined,
//             BranchId: fieldsValue.BranchId ? fieldsValue.BranchId : undefined,
//         }
//         console.log(objBody)

//         const response = await putDepartment(params.id, "", objBody);
//         setButtonOkText('Lưu');
//         setButtonLoading(false);
//         if (response.code === Code._200) {
//             message.success(response.message || "Cập nhật thành công")
//             navigate(`/catalog/department`)
//         }
//         else {
//             message.error(response.message || "Thất bại")
//         }
//     };
//     const onChangeBranch = async () => {
//         // const fieldsValue = await formRef.current?.getFieldsValue();
//         // formRef.current?.setFieldsValue({
//         //     "ParentId": '',
//         // })

//         // const filter = {
//         //     BranchId: fieldsValue.BranchId ? fieldsValue.BranchId : undefined,
//         // }

//         // const responseDepartment: ResponseData = await getDepartment(JSON.stringify(filter));
//         // const optionDepartment = ConvertOptionSelectModel(responseDepartment.data as OptionModel[]);
//         // const stateDispatcher = {
//         //     departments: [{
//         //         key: 'Default',
//         //         label: '-Chọn-',
//         //         value: '',
//         //     } as SelectOptionModel].concat(optionDepartment),
//         // };
//         // dispatch(stateDispatcher);
//     };

//     function uuidv4() {
//         return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
//             .replace(/[xy]/g, function (c) {
//                 const r = Math.random() * 16 | 0,
//                     v = c == 'x' ? r : (r & 0x3 | 0x8);
//                 return v.toString(16);
//             });
//     }

//     return (
//         <div className='layout-main-content'>
//             <Card
//                 bordered={false}
//                 title={
//                     <>
//                         <Space className="title">
//                             <Tooltip title="Quay lại">
//                                 <Button type="text" shape='circle' onClick={() => navigate('/catalog/department')}>
//                                     <ArrowLeftOutlined />
//                                 </Button>
//                             </Tooltip>
//                             <Text strong>Cập nhật phòng ban</Text>
//                         </Space>
//                     </>
//                 }
//                 extra={
//                     <Space>
//                         <Button type="dashed" onClick={() => navigate('/catalog/department')}>
//                             Hủy bỏ
//                         </Button>
//                         <Button disabled={buttonLoading} htmlType="submit" type='primary' onClick={handleOk}>
//                             {buttonOkText}
//                         </Button>
//                     </Space>
//                 }
//             >
//                 {loading ? <Spin /> :
//                     <Form
//                         // form={searchForm}
//                         ref={formRef}
//                         name='nest-messages' id="myFormCreate"
//                         onFinish={handleOk}
//                         validateMessages={validateMessages}
//                         initialValues={{
//                             ["Name"]: state.recordEdit?.name,
//                             ["Code"]: state.recordEdit?.code,
//                             ["Description"]: state.recordEdit?.description,
//                             ["IsCom"]: state.recordEdit?.isCom,
//                             ["BranchId"]: state.recordEdit?.branchId,
//                             ["ParentId"]: state.recordEdit?.parentId,

//                         }}
//                     >
//                         <Row gutter={16} justify='start'>
//                             <Col span={12}>
//                                 <Form.Item label={'Mã phòng ban'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Code' rules={[{ required: true, whitespace: true }]}>
//                                     <Input placeholder='Nhập mã phòng ban' allowClear />
//                                 </Form.Item>
//                             </Col>
//                             <Col span={12}>
//                                 <Form.Item label={'Tên phòng ban'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Name' rules={[{ required: true, whitespace: true }]}>
//                                     <Input placeholder='Nhập tên phòng ban' allowClear />
//                                 </Form.Item>
//                             </Col>
//                             <Col span={12}>
//                                 <Form.Item label={'Mô tả'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Description'>
//                                     <Input placeholder='Nhập mô tả' allowClear />
//                                 </Form.Item>
//                             </Col>
//                             <Col span={12}>
//                                 <Form.Item label={' '} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='IsCom' valuePropName="checked">
//                                     <Checkbox>Tính hoa hồng</Checkbox>
//                                 </Form.Item>
//                             </Col>
//                             <Col span={12}>
//                                 <Form.Item
//                                     label={'Chi nhánh'}
//                                     labelCol={{ span: 24 }}
//                                     wrapperCol={{ span: 24 }}
//                                     name='BranchId'
//                                     rules={[{ required: true }]}
//                                 >
//                                     <Select
//                                         showSearch
//                                         optionFilterProp="children"
//                                         filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
//                                         // filterSort={(optionA, optionB) =>
//                                         //     (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
//                                         // }
//                                         placeholder='-Chọn-' options={state.branches} onChange={() => onChangeBranch()} />
//                                 </Form.Item>
//                             </Col>
//                             <Col span={12}>
//                                 <Form.Item
//                                     label={'Phòng ban cha'}
//                                     labelCol={{ span: 24 }}
//                                     wrapperCol={{ span: 24 }}
//                                     name='ParentId'
//                                 >
//                                     <TreeSelect
//                                         showSearch
//                                         treeLine
//                                         style={{ width: '100%' }}
//                                         // value={value}
//                                         dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
//                                         placeholder="-Chọn phòng ban-"
//                                         allowClear
//                                         treeDefaultExpandAll
//                                         showCheckedStrategy={TreeSelect.SHOW_CHILD}
//                                         treeData={state.departments}
//                                     />
//                                 </Form.Item>
//                             </Col>
//                         </Row>
//                     </Form>
//                 }


//             </Card>


//         </div>
//     );
// }

export default Edit;
