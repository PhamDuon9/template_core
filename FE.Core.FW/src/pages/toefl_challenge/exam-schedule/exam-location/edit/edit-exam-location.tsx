import { OptionModel, SelectOptionModel } from "@/@types/data";
import { ResponseData } from "@/apis";
import { ExamLocationModel } from "@/apis/models/toefl-challenge/ExamLocationModel";
import { ProvinceModel } from "@/apis/models/toefl-challenge/ProvinceModel";
import { RegistrationRound } from "@/apis/models/toefl-challenge/RegistrationRound";
import { getAministrativeDivisions1 } from "@/apis/services/toefl-challenge/AministrativeDivisionsService";
import { ConvertOptionSelectModel } from "@/utils/convert";
import { Col, Form, FormInstance, Input, Row, Select } from "antd";
import React, { useEffect, useReducer, useRef } from "react";

interface Props extends React.HTMLAttributes<HTMLElement> {
    handleOk: (value: any) => void;
    provinces: SelectOptionModel[];
    districtInits: SelectOptionModel[];
    recordEdit: ExamLocationModel;
}

const EditExamLocationInfor: React.FC<Props> = (({
    handleOk,
    provinces,
    recordEdit,
    districtInits,
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
    useEffect(() => {
        const stateDispatcher = {
            districts: districtInits,
        };
        dispatch(stateDispatcher);
    }, [districtInits])

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
    const onChangeProvince = async () => {
        const fieldsValue = await formRef.current?.getFieldsValue();
        const responseDistricts: ResponseData = await getAministrativeDivisions1(fieldsValue.ProvinceId);
        const dataDistricts = responseDistricts?.data as ProvinceModel
        const districtOptions = ConvertOptionSelectModel(dataDistricts.districts as OptionModel[]);
        formRef.current?.setFieldValue('DistrictId', '')
        const stateDispatcher = {
            districts: [{
                key: 'Default',
                label: '-Chọn-',
                value: '',
            } as SelectOptionModel].concat(districtOptions),
        }
        dispatch(stateDispatcher)
    };
    return (
        <Form
            // form={searchForm}
            ref={formRef}
            name='nest-messages1' id="myFormEdit1"
            onFinish={handleOk}
            validateMessages={validateMessages}
            initialValues={{
                ["ExamScheduleName"]: recordEdit?.examScheduleName ?? '',
                ["ProvinceId"]: recordEdit?.provinceId,
                ["DistrictId"]: recordEdit?.districtId,
                ["Code"]: recordEdit?.code,
                ["Name"]: recordEdit?.name,
                ["Address"]: recordEdit?.address,
                ["Description"]: recordEdit?.description,
            }}
        >
            <Row gutter={16} justify='start'>

                <Col span={24}>
                    <Form.Item label={'Lịch thi'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='ExamScheduleName' rules={[{ required: true }]}>
                        <Input disabled />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={'Mã địa điểm thi'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Code' rules={[{ required: true }]}>
                        <Input placeholder='Nhập mã địa điểm thi' allowClear />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={'Tên địa điểm thi'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Name' rules={[{ required: true }]}>
                        <Input placeholder='Nhập tên địa điểm thi' allowClear />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={'Tỉnh/TP'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='ProvinceId' rules={[{ required: true }]}>
                        <Select
                            disabled
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                            }
                            placeholder='-Chọn-' options={provinces} onChange={() => onChangeProvince()} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label={'Quận/huyện'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='DistrictId' rules={[{ required: true }]}>
                        <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
                            }
                            placeholder='-Chọn-' options={state.districts} />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item label={'Địa chỉ'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Address'>
                        <Input placeholder='Nhập địa chỉ' allowClear />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item label={'Ghi chú'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Description'>
                        <Input.TextArea placeholder='Nhập ghi chú' allowClear
                            autoSize={{ minRows: 2, maxRows: 6 }}
                            showCount
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
})
export default EditExamLocationInfor