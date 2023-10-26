import { ResponseData } from '@/utils/request';
import {
    Button,
    Card,
    Col,
    Divider,
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
    Typography,
    message
} from 'antd';
import { useEffect, useReducer, useRef, useState } from 'react';

import { Code } from '@/apis';
import { DivisionModel } from '@/apis/models/toefl-challenge/DivisionModel';
import { PICModel } from '@/apis/models/toefl-challenge/PICModel';
import { ProvinceModel } from '@/apis/models/toefl-challenge/ProvinceModel';
import { getAministrativeDivisions, getAministrativeDivisions1 } from '@/apis/services/toefl-challenge/AministrativeDivisionsService';
import { getDepartment } from '@/apis/services/toefl-challenge/DepartmentService';
import { getDivisionId, putDivision } from '@/apis/services/toefl-challenge/DivisionService';
import {
    ConvertOptionSelectModel
} from '@/utils/convert';
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import EditableCell from './edit';
import { OptionModel } from '@/@types/data';
import { getBranch1, putBranch } from '@/apis/services/BranchService';




function BranchEdit() {
    const navigate = useNavigate();
    const params = useParams()
    console.log(params);
    // Load
    const initState = {
        recordEdit: {}
    };
    const [loading, setLoading] = useState<boolean>(false);

    const { Title, Paragraph, Text, Link } = Typography;
    const [state, dispatch] = useReducer<(prevState: any, updatedProperty: any) => any>(
        (prevState: any, updatedProperty: any) => ({
            ...prevState,
            ...updatedProperty,
        }),
        initState,
    );


    useEffect(() => {
        const fnGetInitState = async () => {
            setLoading(true);
            const responseDivision: ResponseData = await getBranch1(params.id);

            const stateDispatcher = {
                recordEdit: responseDivision.data
            };
            dispatch(stateDispatcher);
            setLoading(false);
        }
        fnGetInitState()
    }, []);

    // Data
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [buttonOkText, setButtonOkText] = useState<string>('Lưu');

    // searchForm
    const [form] = Form.useForm();
    const formRef = useRef<FormInstance>(null);


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

    const handleOk = async () => {
        const fieldsValue = await formRef?.current?.validateFields();
        setButtonOkText('Đang xử lý...');
        setButtonLoading(true);

        const objBody: DivisionModel = {
            ...fieldsValue,
        }

        const response = await putBranch(params.id, "", objBody);
        setButtonOkText('Lưu');
        setButtonLoading(false);
        if (response.code === Code._200) {
            message.success(response.message || "Cập nhật thành công")
            navigate(`/catalog/branch`)
        }
        else {
            message.error(response.message || "Thất bại")
        }
    };

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
    }

    return (
        <div className='layout-main-content'>
            <Card
                bordered={false}
                title={
                    <>
                        <Space className="title">
                            <Tooltip title="Quay lại">
                                <Button type="text" shape='circle' onClick={() => navigate('/catalog/branch')}>
                                    <ArrowLeftOutlined />
                                </Button>
                            </Tooltip>
                            <Text strong>Cập nhật chi nhánh</Text>
                        </Space>
                    </>
                }
                extra={
                    <Space>
                        <Button type="dashed" onClick={() => navigate('/catalog/branch')}>
                            Hủy bỏ
                        </Button>
                        <Button disabled={buttonLoading} htmlType="submit" type='primary' onClick={handleOk}>
                            {buttonOkText}
                        </Button>
                    </Space>
                }
            >
                {loading ? <Spin /> :
                    <Form
                        // form={searchForm}
                        ref={formRef}
                        name='nest-messages' id="myFormCreate"
                        onFinish={handleOk}
                        validateMessages={validateMessages}
                        initialValues={{
                            ["Name"]: state.recordEdit?.name,
                            ["Code"]: state.recordEdit?.code,
                            ["Description"]: state.recordEdit?.description,
                        }}
                    >
                        <Row gutter={16} justify='start'>
                            <Col span={12}>
                                <Form.Item label={'Mã chi nhánh'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Code' rules={[{ required: true, whitespace: true }]}>
                                    <Input placeholder='Nhập mã chi nhánh' allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={'Tên chi nhánh'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Name' rules={[{ required: true, whitespace: true }]}>
                                    <Input placeholder='Nhập tên chi nhánh' allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={'Mô tả'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Description'>
                                    <Input placeholder='Nhập mô tả' allowClear />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                }


            </Card>


        </div>
    );
}

export default BranchEdit;
