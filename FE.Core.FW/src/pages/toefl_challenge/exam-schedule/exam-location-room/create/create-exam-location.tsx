import { SelectOptionModel } from "@/@types/data";
import { Code, ResponseData } from "@/apis";
import { ExamLocationScheduleModel } from "@/apis/models/toefl-challenge/ExamLocationScheduleModel";
import { ExamScheduleModel } from "@/apis/models/toefl-challenge/ExamScheduleModel";
import { RegistrationRound } from "@/apis/models/toefl-challenge/RegistrationRound";
import { getExamLocationSchedule } from "@/apis/services/toefl-challenge/ExamLocationService";
import { examLocationMapScheduleState } from "@/store/exam-atom";
import { CheckOutlined, CloseOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Col, Form, FormInstance, Input, InputNumber, Row, Select, Switch } from "antd";
import React, { useReducer, useRef } from "react";
import { useRecoilState } from "recoil";

interface Props extends React.HTMLAttributes<HTMLElement> {
    handleOk: (value: any) => void;
    examSchedule: ExamScheduleModel;
    examLocations: SelectOptionModel[]
}

const CreateExamLocationInfor: React.FC<Props> = (({
    handleOk,
    examSchedule,
    examLocations
}: Props) => {
    const formRef = useRef<FormInstance>(null);
    const initState = {
        districts: [
            {
                key: 'Default',
                label: '-Chọn-',
                value: '',
            },
        ],
        registrationRounds: [
            {
                key: 'Default',
                label: '-Chọn-',
                value: '',
            },
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

    }

    const [state, dispatch] = useReducer<(prevState: any, updatedProperty: any) => any>((prevState: any, updatedProperty: any) => ({
        ...prevState,
        ...updatedProperty,
    }), initState);
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
    const [data, setData] = useRecoilState<ExamLocationScheduleModel[]>(examLocationMapScheduleState);
    const onChangeExamLocation = async () => {
        const fieldsValue = await formRef.current?.getFieldsValue();

        if (fieldsValue.ExamLocationId) {
            const filter = {
                ExamId: examSchedule.examId,
                ExamScheduleId: examSchedule.id,
                ExamLocationId: fieldsValue.ExamLocationId
            }
            const responseExamLocationSchedule: ResponseData<ExamLocationScheduleModel[]> = await getExamLocationSchedule(JSON.stringify(filter)) as ResponseData<ExamLocationScheduleModel[]>;
            if (responseExamLocationSchedule.code === Code._200) {
                setData(responseExamLocationSchedule.data as ExamLocationScheduleModel[])
            }
        }

    };
    return (
        <Form
            // form={searchForm}
            ref={formRef}
            name='nest-messages1' id="myFormCreate1"
            onFinish={handleOk}
            validateMessages={validateMessages}
            initialValues={{
                ["ExamLocationId"]: '',
                ["Order"]: 1,
                ["Status"]: true,
            }}
        >
            <Row gutter={16} justify='start'>

                <Col span={12}>
                    <Form.Item label={'Địa điểm thi'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}
                     name='ExamLocationId' rules={[{ required: true }]}
                     tooltip={{ title: 'Thay đổi địa điểm thi sẽ xóa hết danh sách ca thi theo phòng thi', icon: <InfoCircleOutlined /> }}
                     >
                        <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                            }
                            placeholder='-Chọn-' options={examLocations} onChange={onChangeExamLocation} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={'Mã phòng thi'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Code' rules={[{ required: true }]}>
                        <Input placeholder='Nhập mã phòng thi' allowClear />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={'Tên phòng thi'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Name' rules={[{ required: true }]}>
                        <Input placeholder='Nhập tên phòng thi' allowClear />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={'Hạn mức'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Amount' rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={'Thứ tự sắp xếp'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Order' rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={'Trạng thái'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Status' valuePropName='checked'>
                        <Switch
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                            defaultChecked
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
})
export default CreateExamLocationInfor