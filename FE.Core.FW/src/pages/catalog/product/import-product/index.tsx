import { Code } from '@/apis';
import { PaymentStatus } from '@/apis/models/toefl-challenge/PaymentStatus';
import { PaymentType } from '@/apis/models/toefl-challenge/PaymentType';
import { RegistrationExamType } from '@/apis/models/toefl-challenge/RegistrationExamType';
import { RegistrationModel } from '@/apis/models/toefl-challenge/RegistrationModel';
import { RegistrationRound } from '@/apis/models/toefl-challenge/RegistrationRound';
import { TemplateType } from '@/apis/models/toefl-challenge/TemplateType';
import { getProduct2, postProduct1 } from '@/apis/services/ProductService';
import { getFile } from '@/apis/services/toefl-challenge/FileService';
import { postRegistrationPayment, postRegistrationPayment1, putRegistrationPayment } from '@/apis/services/toefl-challenge/RegistrationPaymentService';
import { InboxOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    DatePicker,
    Form,
    FormInstance,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Space,
    Switch,
    Typography,
    Upload,
    UploadFile,
    UploadProps,
    message
} from 'antd';
import locale from "antd/es/date-picker/locale/vi_VN";
import moment from 'moment';
import { useEffect, useReducer, useRef, useState } from 'react';



interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
    reload: (current: number, pageSize: number) => void;
}
function ImportProduct({ open, setOpen, reload }: Props) {
    const [searchForm] = Form.useForm();
    // Load
    const initState = {
        provinces: [],
        districts: [],
        exams: [],
    };

    const { Title, Paragraph, Text, Link } = Typography;
    const [state, dispatch] = useReducer<(prevState: any, updatedProperty: any) => any>(
        (prevState: any, updatedProperty: any) => ({
            ...prevState,
            ...updatedProperty,
        }),
        initState,
    );

    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalButtonOkText, setModalButtonOkText] = useState('Lưu');

    // Data
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [buttonOkText, setButtonOkText] = useState<string>('Lưu');

    // searchForm
    const [form] = Form.useForm();
    const formRef = useRef<FormInstance>(null);


    const handleCancel = () => {
        // console.log('Clicked cancel button');
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

    const handleOk = async () => {
        setConfirmLoading(true)
        const fieldsValue = await searchForm.validateFields();
        // setModalButtonOkText('Đang xử lý...');
        // setConfirmLoading(true);
        searchForm.resetFields()

        const objBody = {
            ...fieldsValue,
            FileUpload: fieldsValue.FileUpload?.fileList[0]?.originFileObj

        }
        // console.log(objBody)
        // return
        let file: Blob = fieldsValue.FileUpload?.fileList[0]?.originFileObj

        const response = await postProduct1("", { file: file });
        setConfirmLoading(false)
        if (response.code === Code._200) {
            message.success(response.message || "Upload file thành công")
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
    const [file, setFile] = useState<UploadFile>();
    const props: UploadProps = {
        name: 'file',
        multiple: false,
        // action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        maxCount: 1,
        showUploadList: { showRemoveIcon: true },
        onRemove: () => setFile(undefined),
        beforeUpload: (file) => {
            setFile(file);
            return false;
        },
        defaultFileList: []
        // onChange(info) {
        //     // console.log(info)
        //     // const { status } = info.file;
        //     // if (status !== 'uploading') {
        //     //     console.log(info.file, info.fileList);
        //     // }
        //     // if (status === 'done') {
        //     //     message.success(`${info.file.name} file uploaded successfully.`);
        //     // } else if (status === 'error') {
        //     //     message.error(`${info.file.name} file upload failed.`);
        //     // }
        // },
        // onDrop(e) {
        //     console.log('Dropped files', e.dataTransfer.files);
        // },
    };

    const downloadFileTemplate = async () => {
        // console.log('download');
        const response = await getProduct2();
        if (response.code === Code._200) {
            const { base64: base64Data, extention, name } = response.data as any
            // Tạo một đối tượng Blob từ dữ liệu base64
            // const blob = new Blob(["data:application/octet-stream;base64," + base64Data], { type: 'application/octet-stream' });

            fetch("data:application/octet-stream;base64," + base64Data).then(e => e.blob()).then(blob => {
                // Tạo một URL tạm thời từ Blob
                const url = URL.createObjectURL(blob);

                // Tạo một liên kết tải
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = name + extention; // Đặt tên tệp tải về ở đây

                // Thêm liên kết vào DOM và kích hoạt sự kiện click
                document.body.appendChild(a);
                a.click();

                // Xóa liên kết sau khi tải xong
                document.body.removeChild(a);
            })
        }
        else {
            message.error(response.message || "Thất bại")
        }
    };

    return (
        <>
            <Modal title="Upload danh sách sản phẩm" open={open} cancelText="Bỏ qua" width={'800px'}
                           /* onOk={onSubmit}*/ okText={modalButtonOkText} style={{ top: 20 }} onCancel={handleCancel}
                confirmLoading={confirmLoading}
                okButtonProps={{ form: 'myFormCreate', htmlType: 'submit' }}
            >
                <Form
                    form={searchForm}
                    name='nest-messages' id="myFormCreate"
                    onFinish={handleOk}
                    validateMessages={validateMessages}
                >
                    <Row gutter={16} justify='start'>
                        <Col span={24}>
                            <Form.Item label={'Mẫu file upload'} labelAlign='left' labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} name='TemplateFile'>
                                <Space>
                                    <Text>Để tải về mẫu file upload vui lòng</Text>
                                    <Button type='link' onClick={downloadFileTemplate}>Bấm vào đây</Button>
                                </Space>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label={'Chọn file upload'} labelAlign='left' labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} name='FileUpload'>
                                <Upload.Dragger {...props}>
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">Nhấn hoặc thả file vào đây để upload</p>
                                    <p className="ant-upload-hint">
                                        Chỉ hộ trợ tải lên duy nhất 1 file
                                    </p>
                                </Upload.Dragger>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
}

export default ImportProduct;
