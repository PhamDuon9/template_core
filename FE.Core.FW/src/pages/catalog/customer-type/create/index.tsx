import {
    Button,
    Card,
    Col,
    Form,
    Modal,
    Input,
    Row,
    Space,
    Spin,
    Tooltip,
    Typography,
    message
} from 'antd';
import { useEffect, useReducer, useRef, useState } from 'react';
import { Code } from '@/apis';
import { CustomerTypeModel } from '@/apis/models/CustomerTypeModel';
import { postCustomerType } from '@/apis/services/CustomerTypeService';

interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
    reload: (current: number, pageSize: number) => void;
}

const Create: React.FC<Props> = ({ open, setOpen, reload }) => {
    const [searchForm] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalButtonOkText, setModalButtonOkText] = useState('Lưu');

    const handleOk = async () => {
        const fieldsValue = await searchForm.validateFields();
        setConfirmLoading(true);
        const objBody: CustomerTypeModel = {
            ...fieldsValue
        }
        const response = await postCustomerType("", objBody);
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
            <Modal title="Thêm loại KH"
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
                        ["Description"]: ''
                    }}
                >
                    <Row gutter={16} justify='start'>
                        <Col span={24}>
                            <Form.Item label={'Mã loại KH'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Code' rules={[{ required: true, whitespace: true }]}>
                                <Input placeholder='Nhập mã loại KH' allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label={'Tên loại KH'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Name' rules={[{ required: true, whitespace: true }]}>
                                <Input placeholder='Nhập tên loại KH' allowClear />
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
// function CustomerTypeCreate() {
//     const navigate = useNavigate();
//     // Load
//     const initState = {
//         provinces: [],
//         districts: [],
//         departmentEdit: {},
//         departments: [],
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
//             // const responseProvinces: ResponseData = await getAministrativeDivisions();
//             // const responseDepartment: ResponseData = await getDepartment();

//             // const provinceOptions = ConvertOptionSelectModel(responseProvinces.data as OptionModel[]);
//             // const departmentOptions = ConvertOptionSelectModel(responseDepartment.data as OptionModel[]);
//             // const stateDispatcher = {
//             //     provinces: [{
//             //         key: 'Default',
//             //         label: '-Chọn-',
//             //         value: '',
//             //     }].concat(provinceOptions),
//             //     departments: [{
//             //         key: 'Default',
//             //         label: '-Chọn-',
//             //         value: '',
//             //     }].concat(departmentOptions),
//             //     districts: [{
//             //         key: 'Default',
//             //         label: '-Chọn-',
//             //         value: '',
//             //     }]
//             // };
//             // dispatch(stateDispatcher);
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
//         // const fieldsValue = await searchForm.validateFields();
//         const fieldsValue = await formRef?.current?.validateFields();
//         setButtonOkText('Đang xử lý...');
//         setButtonLoading(true);
//         // setConfirmLoading(true);
//         // searchForm.resetFields()

//         const objBody: CustomerTypeModel = {
//             ...fieldsValue,
//         }

//         const response = await postCustomerType("", objBody);
//         setButtonOkText('Lưu');
//         setButtonLoading(false);
//         if (response.code === Code._200) {
//             message.success(response.message || "Tạo thành công")
//             //redirect đến trang chỉnh sửa
//             navigate(`/catalog/customer-type`)
//         }
//         else {
//             message.error(response.message || "Thất bại")
//         }
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
//                                 <Button type="text" shape='circle' onClick={() => navigate('/catalog/customer-type')}>
//                                     <ArrowLeftOutlined />
//                                 </Button>
//                             </Tooltip>
//                             <Text strong>Thêm mới loại KH</Text>
//                         </Space>
//                     </>
//                 }
//                 extra={
//                     <Space>
//                         <Button type="default" onClick={() => navigate('/catalog/customer-type')}>
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
//                             ["Name"]: '',
//                         }}
//                     >
//                         <Row gutter={16} justify='start'>
//                             <Col span={12}>
//                                 <Form.Item label={'Mã loại KH'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Code' rules={[{ required: true, whitespace: true }]}>
//                                     <Input placeholder='Nhập mã loại KH' allowClear />
//                                 </Form.Item>
//                             </Col>
//                             <Col span={12}>
//                                 <Form.Item label={'Tên loại KH'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Name' rules={[{ required: true, whitespace: true }]}>
//                                     <Input placeholder='Nhập tên loại KH' allowClear />
//                                 </Form.Item>
//                             </Col>
//                             <Col span={12}>
//                                 <Form.Item label={'Mô tả'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Description'>
//                                     <Input placeholder='Nhập mô tả' allowClear />
//                                 </Form.Item>
//                             </Col>
//                         </Row>
//                     </Form>
//                 }


//             </Card>


//         </div>
//     );
// }

export default Create;
