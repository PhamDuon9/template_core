import { Code, ResponseData } from '@/apis';
import { ExamModel } from '@/apis/models/toefl-challenge/ExamModel';
import { ProvinceModel } from '@/apis/models/toefl-challenge/ProvinceModel';
import { SchoolModel } from '@/apis/models/toefl-challenge/SchoolModel';
import { SchoolType } from '@/apis/models/toefl-challenge/SchoolType';
import { TemplateType } from '@/apis/models/toefl-challenge/TemplateType';
import { getAministrativeDivisions1 } from '@/apis/services/toefl-challenge/AministrativeDivisionsService';
import { getExam1 } from '@/apis/services/toefl-challenge/ExamService';
import { getFile } from '@/apis/services/toefl-challenge/FileService';
import { postRegistration1 } from '@/apis/services/toefl-challenge/RegistrationService';
import { getSchool, getSchool1 } from '@/apis/services/toefl-challenge/SchoolService';
import { ConvertOptionSelectModel } from '@/utils/convert';
import { InboxOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    Form,
    FormInstance,
    Input,
    Modal,
    Row,
    Select,
    Space,
    Typography,
    Upload,
    UploadProps,
    message
} from 'antd';
import { useReducer, useRef, useState } from 'react';
import { OptionModel, SelectOptionModel } from '@/@types/data';
import DebounceSelect from '@/components/DebounceSelect';



interface Props {
    temp: SelectOptionModel[]
    open: boolean;
    setOpen: (value: boolean) => void;
    reload: (current: number, pageSize: number) => void;
}
function ImportRegistrationRound1({ temp, open, setOpen, reload }: Props) {
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

    const [showErrorFile, setShowErrorFile] = useState('');
    const [disableExamType, setDisableExamType] = useState(true);
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

    const onGetSchoolDebounce = async (search: string, page: number = 1): Promise<ResponseData<SelectOptionModel[]>> => {
        const fieldsValue = await searchForm.validateFields();
        const filter = {
            provinceId: fieldsValue.ProvinceId ? fieldsValue.ProvinceId : undefined,
            districtId: fieldsValue.DistrictId ? fieldsValue.DistrictId : undefined,
            page: page,
            size: 20,
            textSearch: search,
        }
        return getSchool(
            JSON.stringify(filter)
        ).then((body: ResponseData | ResponseData<SchoolModel[]>) => {
            const recordOptions = ConvertOptionSelectModel(body.data as OptionModel[]);
            return {
                ...body,
                data: recordOptions
            }
        });
    }
    const onChangeExam = async () => {
        const fieldsValue = await searchForm.validateFields();
        searchForm.setFieldValue('ProvinceId', '');
        searchForm.setFieldValue('DistrictId', '');
        if (!fieldsValue.ExamId) {
            const stateDispatcher = {
                provinces: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                }],
            }
            dispatch(stateDispatcher)
            return
        }
        const response: ResponseData = await getExam1(fieldsValue.ExamId);
        const data = await response.data as ExamModel;
        const provinceOptions = ConvertOptionSelectModel(data.provinces as OptionModel[]);
        const stateDispatcher = {
            provinces: [{
                key: 'Default',
                label: '-Chọn-',
                value: '',
            } as SelectOptionModel].concat(provinceOptions),
        }
        dispatch(stateDispatcher)
    };

    const onChangeProvince = async () => {

        const fieldsValue = await searchForm.validateFields();
        const filter = {
            provinceId: fieldsValue.ProvinceId ? fieldsValue.ProvinceId : undefined,
        }
        if (!fieldsValue.ProvinceId) {
            const stateDispatcher = {
                districts: [{
                    key: 'Default',
                    label: '-Chọn-',
                    value: '',
                }],
            }
            dispatch(stateDispatcher)
            return
        }
        const response: ResponseData = await getAministrativeDivisions1(fieldsValue.ProvinceId);
        const data = await response.data as ProvinceModel
        const districtOptions = ConvertOptionSelectModel(data.districts as OptionModel[]);

        const stateDispatcher = {
            districts: [{
                key: 'Default',
                label: '-Chọn-',
                value: '',
            } as SelectOptionModel].concat(districtOptions),
        }
        dispatch(stateDispatcher)
    };

    const onChangeSchool = async () => {
        const fieldsValue = await searchForm.validateFields();
        setDisableExamType(true);
        searchForm.setFieldValue('ExamType', '');

        const response: ResponseData = await getSchool1(fieldsValue.SchoolId.value);
        var data = await response.data as SchoolModel;
        switch (data.schoolType) {
            case SchoolType._0:
                searchForm.setFieldValue('ExamType', '0');
                break;
            case SchoolType._1:
                searchForm.setFieldValue('ExamType', '1');
                break;
            case SchoolType._2:
                searchForm.setFieldValue('ExamType', '2');
                break;
            case SchoolType._3:
                searchForm.setFieldValue('ExamType', '');
                setDisableExamType(false);
                break;
            default:
                break;
        }
    };

    const handleOk = async () => {
        setShowErrorFile('');
        const fieldsValue = await searchForm.validateFields();
        searchForm.resetFields()
        let file: Blob = fieldsValue.FileUpload?.fileList[0]?.originFileObj
        const obj = {
            RegistrationExamType: +fieldsValue.ExamType,
            ExamId: fieldsValue.ExamId,
            SchoolId: fieldsValue.SchoolId.value,
            "PIC.Name": fieldsValue.PICName,
            "PIC.JobTitle": fieldsValue.PICJobTitle,
            "PIC.Tel": fieldsValue.PICTel,
            "PIC.Email": fieldsValue.PICEmail,
            File: file
        }
        console.log(obj);
        // return;
        const response = await postRegistration1(obj);
        if (response.code === Code._200) {
            message.success(response.message || "Upload danh sách đăng ký vòng 1 thành công")
            setOpen(false);
            setConfirmLoading(false);
            reload(1, 20)
        }
        else {
            setShowErrorFile(response.errorDetail.ErrorFile);
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
    const downloadFileTemplate = async () => {
        // console.log('download');
        const response = await getFile(TemplateType._0);
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
            <Modal title="Import danh sách vòng 1" open={open} cancelText="Bỏ qua" width={'800px'}
                           /* onOk={onSubmit}*/ okText={modalButtonOkText} style={{ top: 20 }} onCancel={handleCancel}
                confirmLoading={confirmLoading}
                okButtonProps={{ form: 'myFormCreate', htmlType: 'submit' }}
            >
                <Form
                    form={searchForm}
                    name='nest-messages' id="myFormCreate"
                    onFinish={handleOk}
                    validateMessages={validateMessages}
                    initialValues={{
                        ['ExamId']: undefined,
                        ['ProvinceId']: '',
                        ['DistrictId']: '',
                        ['SchoolId']: '',
                        ['ExamType']: '',
                    }}
                >
                    <Row gutter={16} justify='start'>
                        <Col span={24}>
                            <Form.Item
                                labelAlign='left'
                                label={'Cuộc thi'}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                name='ExamId'
                            >
                                <Select
                                    placeholder='-Chọn-'
                                    showSearch
                                    allowClear
                                    optionFilterProp='children'
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                                    }
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '')
                                            .toString()
                                            .toLowerCase()
                                            .localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                    }
                                    options={temp}
                                    onChange={() => onChangeExam()}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                labelAlign='left'
                                label={'Tỉnh/TP'}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                name='ProvinceId'
                            >
                                <Select
                                    placeholder='Chọn Tỉnh/TP'
                                    showSearch
                                    allowClear
                                    optionFilterProp='children'
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                                    }
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '')
                                            .toString()
                                            .toLowerCase()
                                            .localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                    }
                                    options={state.provinces}
                                    onChange={() => onChangeProvince()}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                labelAlign='left'
                                label={'Quận/Huyện'}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                name='DistrictId'
                            >
                                <Select
                                    placeholder='Chọn'
                                    showSearch
                                    allowClear
                                    optionFilterProp='children'
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                                    }
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '')
                                            .toString()
                                            .toLowerCase()
                                            .localeCompare((optionB?.label ?? '').toString().toLowerCase())
                                    }
                                    options={state.districts}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                labelAlign='left'
                                label={'Trường học'}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                name='SchoolId'
                            >
                                <DebounceSelect
                                    // mode="multiple"
                                    showSearch
                                    allowClear
                                    placeholder="Chọn trường"
                                    fetchOptions={onGetSchoolDebounce}
                                    style={{ width: '100%' }}
                                    onChange={() => onChangeSchool()}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                labelAlign='left'
                                label={'Bài thi'}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                name='ExamType'
                            >
                                <Select
                                    disabled={disableExamType}
                                    placeholder='Chọn'
                                    showSearch
                                    allowClear
                                    optionFilterProp='children'
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={[
                                        {
                                            value: '',
                                            label: '-Chọn-',
                                        },
                                        {
                                            value: '0',
                                            label: 'Primary',
                                        },
                                        {
                                            value: '1',
                                            label: 'Junior',
                                        },
                                        {
                                            value: '2',
                                            label: 'ITP',
                                        },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                labelAlign='left'
                                label={'PIC - Họ và tên'}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                name='PICName'
                            >
                                <Input allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                labelAlign='left'
                                label={'PIC - Chức vụ'}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                name='PICJobTitle'
                            >
                                <Input allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                labelAlign='left'
                                label={'PIC - Số điện thoại'}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                name='PICTel'
                            >
                                <Input allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                labelAlign='left'
                                label={'PIC - Email'}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                name='PICEmail'
                            >
                                <Input allowClear />
                            </Form.Item>
                        </Col>

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
                        {
                            showErrorFile ?
                                <Col span={24}>
                                    <a download="error-file.xlsx" href={'data:application/octet-stream;base64,' + showErrorFile}>Tải file lỗi</a>
                                </Col>
                                : null
                        }
                    </Row>
                </Form>
            </Modal >
        </>
    );
}

export default ImportRegistrationRound1;
