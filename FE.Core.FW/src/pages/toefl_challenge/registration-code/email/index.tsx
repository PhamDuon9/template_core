import { Code, ResponseData } from '@/apis';
import {
    Col,
    Form,
    FormInstance,
    Modal,
    Row,
    Select,
    Typography,
    message
} from 'antd';
import { useReducer, useRef, useState } from 'react';
import { SchoolModel } from '@/apis/models/toefl-challenge/SchoolModel';
import { getAministrativeDivisions1 } from '@/apis/services/toefl-challenge/AministrativeDivisionsService';
import { getSchool, getSchool1 } from '@/apis/services/toefl-challenge/SchoolService';
import { ConvertOptionSelectModel } from '@/utils/convert';
import { ProvinceModel } from '@/apis/models/toefl-challenge/ProvinceModel';
import { getExam1 } from '@/apis/services/toefl-challenge/ExamService';
import { ExamModel } from '@/apis/models/toefl-challenge/ExamModel';
import { SchoolType } from '@/apis/models/toefl-challenge/SchoolType';
import { postEmailRegistrationCode } from '@/apis/services/toefl-challenge/RegistrationCodeService';
import { OptionModel, SelectOptionModel } from '@/@types/data';
import DebounceSelect from '@/components/DebounceSelect';



interface Props {
    temp: SelectOptionModel[]
    open: boolean;
    setOpen: (value: boolean) => void;
    reload: (current: number, pageSize: number) => void;
}
function EmailRegistrationCode({ temp, open, setOpen, reload }: Props) {
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
        const response = await postEmailRegistrationCode(fieldsValue.ExamId);
        if (response.code === Code._200) {
            message.success(response.message || "Gửi email thành công")
            setOpen(false);
            setConfirmLoading(false);
            reload(1, 20)
        }
        else {
            if (response.errorDetail.ErrorFile)
                setShowErrorFile(response.errorDetail.ErrorFile);
            setConfirmLoading(false);
            message.error(response.message || "Thất bại")
        }
    };

    return (
        <>
            <Modal title="Gửi email code thi" open={open} cancelText="Bỏ qua" width={'800px'}
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
                    </Row>
                </Form>
            </Modal >
        </>
    );
}

export default EmailRegistrationCode;
