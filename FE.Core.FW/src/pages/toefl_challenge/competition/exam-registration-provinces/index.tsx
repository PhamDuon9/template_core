import { ResponseData } from '@/utils/request';
import {
    Card,
    Col,
    Form,
    Row,
    TreeSelect
} from 'antd';
import { useEffect, useMemo, useReducer, useState } from 'react';

import { ExamRegistrationProvinceModel } from '@/apis/models/toefl-challenge/ExamRegistrationProvinceModel';
import { getAministrativeDivisions } from '@/apis/services/toefl-challenge/AministrativeDivisionsService';
import { examRegistrationProvinceState } from '@/store/exam-atom';
import {
    ConvertOptionModel
} from '@/utils/convert';
import { useRecoilState } from 'recoil';
import { OptionModel } from '@/@types/data';

function ExamRegistrationProvinceTFC() {
    const [examRegistrationProvinces, setExamRegistrationProvinces] = useRecoilState(examRegistrationProvinceState);
    // Load
    const initState = {
        examRegistrationScheduleStates: [],
        provinces: []
    };
    const [loading, setLoading] = useState<boolean>(false);

    const [state, dispatch] = useReducer<(prevState: any, updatedProperty: any) => any>(
        (prevState: any, updatedProperty: any) => ({
            ...prevState,
            ...updatedProperty,
        }),
        initState,
    );

    const getList = async (current: number, pageSize: number = 20): Promise<void> => {
        setLoading(true);
        const responseProvinces: ResponseData = await getAministrativeDivisions();
        const provinceOptions = ConvertOptionModel(responseProvinces.data as OptionModel[]);
        const stateDispatcher = {
            provinces: [{
                key: 'Default',
                title: 'Tỉnh/TP',
                value: '0',
                children: provinceOptions
            }],
        };
        dispatch(stateDispatcher);

        setLoading(false);
    };

    const value = useMemo(() => {
        let result: string[] = [];
        result = examRegistrationProvinces.map((item: ExamRegistrationProvinceModel) => {
            return item.provinceId as string
        })
        return result;
    }, [examRegistrationProvinces])

    useEffect(() => {
        getList(1);
    }, []);



    // searchForm
    const [searchForm] = Form.useForm();

    const onChange = (newValue: string[]) => {
        let result: ExamRegistrationProvinceModel[] = [];
        let cloneArray = [...examRegistrationProvinces];
        newValue.forEach((item: string) => {
            const existItem = cloneArray.find((checkItem: ExamRegistrationProvinceModel) => {
                return checkItem.provinceId === item
            })
            console.log(existItem)
            let obj: ExamRegistrationProvinceModel = {}
            if (existItem) {
                obj = {
                    provinceId: item,
                    examId: existItem.examId,
                    id: existItem.id
                }
            }
            else {
                obj = {
                    provinceId: item
                }
            }

            result.push(obj);
        })
        setExamRegistrationProvinces(result)
    };

    const tProps = {
        showSearch: true,
        treeNodeFilterProp: 'title',
        treeData: state.provinces,
        value,
        onChange,
        treeCheckable: true,
        showCheckedStrategy: TreeSelect.SHOW_CHILD,
        placeholder: '-Chọn-',
        multiple: true,
        // placement: "bottomLeft",
        maxTagCount: 10,
        maxTagTextLength: 100,
        style: {
            width: '100%',
        },
    };


    return (
        <div className='layout-main-content'>
            <Card
                bordered={false}
                extra={<div></div>}
            >
                <Row gutter={16} justify='start'>
                    <Col span={12}>
                        <TreeSelect {...tProps} />
                    </Col>
                </Row>

            </Card>
        </div>
    );
}

export default ExamRegistrationProvinceTFC;
