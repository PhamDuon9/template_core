import { Code } from '@/apis';
import { putRegistration } from '@/apis/services/toefl-challenge/RegistrationService';
import { InboxOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    Form,
    FormInstance,
    Modal,
    Row,
    Space,
    Typography,
    Upload,
    UploadProps,
    message
} from 'antd';
import { useReducer, useRef, useState } from 'react';

interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
    reload: (current: number, pageSize: number) => void;
}
function ImportRegistrationUpdateTFC({ open, setOpen, reload }: Props) {
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
        let isOverwrite: boolean = fieldsValue.IsOverwrite

        const response = await putRegistration({ File: file });
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
    const props: UploadProps = {
        name: 'file',
        multiple: false,
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        onChange(info) {
            // console.log(info)
            // const { status } = info.file;
            // if (status !== 'uploading') {
            //     console.log(info.file, info.fileList);
            // }
            // if (status === 'done') {
            //     message.success(`${info.file.name} file uploaded successfully.`);
            // } else if (status === 'error') {
            //     message.error(`${info.file.name} file upload failed.`);
            // }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <>
            <Modal title="Upload danh sách thay đổi thông tin" open={open} cancelText="Bỏ qua" width={'800px'}
                           /* onOk={onSubmit}*/ okText={modalButtonOkText} style={{ top: 20 }} onCancel={handleCancel}
                confirmLoading={confirmLoading}
                okButtonProps={{ form: 'myFormCreate', htmlType: 'submit' }}
            >
                <Form
                    form={searchForm}
                    name='nest-messages' id="myFormCreate"
                    onFinish={handleOk}
                    validateMessages={validateMessages}
                    initialValues={
                        {
                            ['IsOverwrite']: true
                        }
                    }
                >
                    <Row gutter={16} justify='start'>
                        <Col span={24}>
                            <Form.Item label={'Mẫu file upload'} labelAlign='left' labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} name='TemplateFile'>
                                <Space>
                                    <Text>Để tải về mẫu file upload vui lòng</Text>
                                    <Button type='link'>Bấm vào đây</Button>
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

export default ImportRegistrationUpdateTFC;
