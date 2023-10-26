import { PaymentStatus } from '@/apis/models/toefl-challenge/PaymentStatus';
import { RegistrationExamType } from '@/apis/models/toefl-challenge/RegistrationExamType';
import { RegistrationModel } from '@/apis/models/toefl-challenge/RegistrationModel';
import { RegistrationRound } from '@/apis/models/toefl-challenge/RegistrationRound';
import {
    Col,
    Divider,
    Form,
    FormInstance,
    Modal,
    Row,
    Typography
} from 'antd';
import moment from 'moment';
import { useEffect, useReducer, useRef, useState } from 'react';



interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
    recordEdit: RegistrationModel
}
function ShowDetailRegistrationTFC({ open, setOpen, recordEdit }: Props) {
    const [searchForm] = Form.useForm();
    // Load
    const initState = {
        provinces: [],
        districts: [],
        registrationRounds: [
            {
                key: RegistrationRound._1,
                label: 'Vòng 1',
                value: RegistrationRound._1,
            },
            {
                key: RegistrationRound._2,
                label: 'Vòng 2',
                value: RegistrationRound._2,
            },
            {
                key: RegistrationRound._3,
                label: 'Vòng 3',
                value: RegistrationRound._3,
            },
        ],
        registrationExamTypes: [
            {
                key: 'Default',
                label: '-Chọn-',
                value: '',
            },
            {
                key: RegistrationExamType._1,
                label: 'TOEFL Primary',
                value: RegistrationExamType._1,
            },
            {
                key: RegistrationExamType._2,
                label: 'TOEFL Junior',
                value: RegistrationExamType._2,
            },
            {
                key: RegistrationExamType._3,
                label: 'TOEFL ITP',
                value: RegistrationExamType._3,
            },
        ],
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
    useEffect(() => {

    }, [recordEdit]);

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
        setOpen(false);
    };


    return (
        <>
            <Modal title="Thông tin hồ sơ" open={open} cancelText="Bỏ qua" width={'1000px'}
                           /* onOk={onSubmit}*/ style={{ top: 20 }} onCancel={handleCancel}
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
                            <Form.Item label={'Cuộc thi theo tỉnh thành'} labelAlign='left' labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} name='FullName'>
                                <Text strong>{recordEdit?.examName ?? ''}</Text>
                            </Form.Item>
                        </Col>
                        <Divider orientation="left">Thông tin cá nhân</Divider>
                        <Col span={8}>
                            <Form.Item label={'Họ tên'} labelAlign='left' labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} name='Birthday'>
                                <Text strong>{recordEdit?.fullName ?? ''}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={'Ngày sinh'} labelAlign='left' labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} name='Gender'>
                                <Text strong>{String(recordEdit?.dayOfBirth).padStart(2, '0')}/{String(recordEdit?.monthOfBirth).padStart(2, '0')}/{String(recordEdit?.yearOfBirth).padStart(2, '0')}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label={'Giới tính'}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign='left'
                                name='ExamId'
                            >
                                <Text strong>{recordEdit?.gender === 0 ? "Nam" : recordEdit?.gender === 1 ? "Nữ" : ''}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label={'SĐT'}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                                labelAlign='left'
                                name='Tel'
                            >
                                <Text strong>{recordEdit?.tel ?? ''}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label={'Email'}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                                labelAlign='left'
                                name='Email'
                            >
                                <Text strong>{recordEdit?.email ?? ''}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label={'Địa chỉ gia đình'}
                                labelCol={{ span: 9 }}
                                wrapperCol={{ span: 15 }}
                                labelAlign='left'
                                name='Address'
                            >
                                <Text strong>{recordEdit?.address ?? ''}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label={'Trường học'}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                labelAlign='left'
                                name='SchoolName'
                            >
                                <Text strong>{recordEdit?.schoolName ?? ''}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label={'Khối'}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                                labelAlign='left'
                                name='Block'
                            >
                                <Text strong>{recordEdit?.block ?? ''}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label={'Lớp'}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                                labelAlign='left'
                                name='Class'
                            >
                                <Text strong>{recordEdit?.class ?? ''}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label={'Họ tên bố'}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign='left'
                                name='FatherName'
                            >
                                <Text strong>{recordEdit?.fatherName ?? ''}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label={'Tỉnh/TP trường học'}
                                labelCol={{ span: 10 }}
                                wrapperCol={{ span: 14 }}
                                labelAlign='left'
                                name='ProvinceName'
                            >
                                <Text strong>{recordEdit?.provinceName ?? ''}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label={'Quận/Huyện trường học'}
                                labelCol={{ span: 14 }}
                                wrapperCol={{ span: 10 }}
                                labelAlign='left'
                                name='DistrictName'
                            >
                                <Text strong>{recordEdit?.districtName ?? ''}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label={'Họ tên mẹ'}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign='left'
                                name='MotherName'
                            >
                                <Text strong>{recordEdit?.motherName ?? ''}</Text>
                            </Form.Item>
                        </Col>
                        <Divider orientation="left">Thông tin dự thi</Divider>
                        <Col span={8}>
                            <Form.Item
                                label={'Bài thi'}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign='left'
                                name='MotherName'
                            >
                                <Text strong>{recordEdit?.examType === RegistrationExamType._1 ? "TOEFL Primary" : recordEdit?.examType === RegistrationExamType._2 ? "TOEFL Junior" : recordEdit?.examType === RegistrationExamType._3 ? "TOEFL ITP" : ''}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label={'Vòng thi'}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign='left'
                                name='MotherName'
                            >
                                <Text strong>{recordEdit?.round === RegistrationRound._1 ? "Vòng 1" : recordEdit?.round === RegistrationRound._2 ? "Vòng 2" : recordEdit?.round === RegistrationRound._3 ? "Vòng 3" : ''}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label={'Ngày đăng ký'}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                labelAlign='left'
                                name='MotherName'
                            >
                                <Text strong>{moment(recordEdit?.createdOnDate).format("DD/MM/YYYY HH:mm")}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label={'Đối tượng'}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                labelAlign='left'
                                name='IsSelfRegistration'
                            >
                                <Text strong>{recordEdit?.isSelfRegistration ? "TS tự do" : "Không phải thí sinh tự do"}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label={'SBD'}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                                labelAlign='left'
                                name='RegistrationNumber'
                            >
                                <Text strong>{recordEdit?.registrationNumber}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label={'Ca thi mong muốn'}
                                labelCol={{ span: 10 }}
                                wrapperCol={{ span: 14 }}
                                labelAlign='left'
                                name='RegistrationNumber'
                            >
                                <Text strong>{recordEdit?.registrationExamTime}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label={'DV nhận phiếu điểm tại nhà'}
                                labelCol={{ span: 15 }}
                                wrapperCol={{ span: 9 }}
                                labelAlign='left'
                                name='IsDelivery'
                            >
                                <Text strong>{recordEdit?.isDelivery ? "Có đăng ký" : "Không đăng ký"}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label={'Địa chỉ nhận KQ'}
                                labelCol={{ span: 9 }}
                                wrapperCol={{ span: 15 }}
                                labelAlign='left'
                                name='DeliveryAddress'
                            >
                                <Text strong>{recordEdit?.deliveryAddress}</Text>
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                label={'Lệ phí'}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                                labelAlign='left'
                                name='PriceExam'
                            >
                                <Text strong>{recordEdit.priceExam?.toLocaleString('vi-VN') ?? ""}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label={'Trạng thái thanh toán'}
                                labelCol={{ span: 12 }}
                                wrapperCol={{ span: 12 }}
                                labelAlign='left'
                                name='PriceExam'
                            >
                                <Text strong>{recordEdit.paymentStatus === PaymentStatus._0 ? "Chưa thanh toán" : recordEdit.paymentStatus === PaymentStatus._1 ? "Đang xác nhận" : recordEdit.paymentStatus === PaymentStatus._2 ? "Đã thanh toán" : ""}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label={'SD hình ảnh cho truyền thông'}
                                labelCol={{ span: 16 }}
                                wrapperCol={{ span: 8 }}
                                labelAlign='left'
                                name='IsUsedForCommunication'
                            >
                                <Text strong>{recordEdit?.isUsedForCommunication ? "Có" : "Không"}</Text>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
}

export default ShowDetailRegistrationTFC;
