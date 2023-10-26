import { SelectOptionModel } from '@/@types/data';
import { Code } from '@/apis';
import { ResponseData } from '@/apis/models/ResponseData';
import { getSchoolPermission, putSchoolPermission } from '@/apis/services/toefl-challenge/SchoolPermissionService';
import { Cascader, Col, Form, Modal, Row, TreeSelect, message } from 'antd';
import type { DataNode } from 'antd/lib/tree';
import React, { useEffect, useReducer, useState } from 'react';

interface Option {
    value: string | number;
    label: string;
    children?: Option[];
    isLeaf?: boolean;
}
interface Props {
    open: boolean;
    provinces: SelectOptionModel[],
    optionInit: Option[],
    iigdepartments: DataNode[],
    setOpen: (value: boolean) => void;
    reload: (current: number, pageSize: number) => void;
}
const SchoolCoordinator: React.FC<Props> = ({ open, setOpen, reload, provinces, optionInit, iigdepartments }) => {
    const [searchForm] = Form.useForm();

    const { SHOW_CHILD } = Cascader;

    const [options, setOptions] = useState<Option[]>(optionInit);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalButtonOkText, setModalButtonOkText] = useState('Lưu');
    const initState = {
        districts: [],
    }

    const [state, dispatch] = useReducer<(prevState: any, updatedProperty: any) => any>((prevState: any, updatedProperty: any) => ({
        ...prevState,
        ...updatedProperty,
    }), initState);

    const getList = async (): Promise<void> => {

        const stateDispatcher = {
            districts: [{
                key: 'Default',
                label: '-Chọn-',
                value: '',
            }],
        }
        dispatch(stateDispatcher)


    };
    useEffect(() => {
        getList();
    }, []);

    const onChange = (value: any, selectedOptions: any) => {
        // console.log(JSON.stringify(value));
        // console.log(selectedOptions);
    };

    // const loadData = async (selectedOptions: Option[]) => {
    //     // console.log(selectedOptions)
    //     const targetOption = selectedOptions[selectedOptions.length - 1];

    //     if (targetOption.type === 'province') {
    //         const responseProvinces: ResponseData = await getAministrativeDivisions1(targetOption.value);
    //         let result = []
    //         // console.log(responseProvinces.data)
    //         responseProvinces.data.districts.forEach(item => {
    //             let obj = {
    //                 value: item.id,
    //                 label: item.name,
    //                 type: 'district',
    //                 isLeaf: false,
    //             }
    //             result.push(obj);
    //         })
    //         targetOption.children = result
    //         setOptions([...options])

    //     }
    //     if (targetOption.type === 'district') {
    //         const filter = {
    //             districtId: targetOption.value
    //         }
    //         const responseSchools: ResponseData = await getSchool2(JSON.stringify(filter));
    //         // console.log(responseSchools.data)

    //         targetOption.children = responseSchools.data
    //         setOptions([...options])
    //     }
    // };


    const handleOk = async () => {
        const fieldsValue = await searchForm.validateFields();
        setModalButtonOkText('Đang xử lý...');
        setConfirmLoading(true);
        searchForm.resetFields()

        // const objBody = {
        //     ...fieldsValue,
        // }
        // console.log(objBody)

        const response = await putSchoolPermission(fieldsValue.DepartmentId, fieldsValue.Permission);
        if (response.code === Code._200) {
            message.success(response.message || "Tạo thành công")
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

    const handleCancel = () => {
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

    const onChangeDepartment = async (newValue: string) => {
        const response: ResponseData = await getSchoolPermission(newValue);
        searchForm.setFieldsValue({ Permission: response.data })
    };


    return (
        <>
            <Modal title="Điều phối trường học" open={open} okText={modalButtonOkText} cancelText="Bỏ qua" width={800}
                           /* onOk={onSubmit}*/ style={{ top: 20 }} onCancel={handleCancel}
                confirmLoading={confirmLoading}
                okButtonProps={{ form: 'myFormCreate', htmlType: 'submit' }}
            >
                <Form
                    form={searchForm}
                    name='nest-messages' id="myFormCreate"
                    onFinish={handleOk}
                    validateMessages={validateMessages}
                    initialValues={{
                        ["Permission"]: '',
                        ["DepartmentId"]: '',
                    }}
                >
                    <Row gutter={16} justify='start'>
                        <Col span={24}>
                            <Form.Item label={'Phòng ban'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='DepartmentId' rules={[{ required: true }]}>
                                <TreeSelect
                                    showSearch
                                    style={{ width: '100%' }}
                                    // value={value}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    placeholder="-Chọn phòng ban-"
                                    allowClear
                                    treeDefaultExpandAll
                                    onChange={onChangeDepartment}
                                    showCheckedStrategy={TreeSelect.SHOW_CHILD}
                                    treeData={iigdepartments}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label={'Điều phối'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name='Permission' rules={[{ required: true }]}>
                                <Cascader options={options}
                                    showSearch
                                    // loadData={loadData}
                                    onChange={onChange}
                                    changeOnSelect
                                    placement="bottomLeft"
                                    multiple
                                    maxTagCount={10}
                                    maxTagTextLength={100}
                                    // maxTagPlaceholder={3}
                                    placeholder="-Chọn giá trị-"
                                />
                            </Form.Item>
                        </Col>

                    </Row>
                </Form>
            </Modal>
        </>
    );
}

export default SchoolCoordinator;