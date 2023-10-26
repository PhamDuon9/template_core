import { SelectOptionModel } from "@/@types/data";
import { PICModel } from "@/apis/models/toefl-challenge/PICModel";
import { Input, InputNumber, Form, TimePicker, Select } from "antd";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text' | 'time' | 'select';
    record: PICModel;
    optionDatas?: SelectOptionModel[];
    index: number;
    children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    optionDatas,
    children,
    ...restProps
}) => {
    const format = 'HH:mm';
    const inputNode = inputType === 'time' ? <TimePicker format={format} /> : inputType === 'number' ? <InputNumber style={{ width: '100%' }} /> : inputType === 'select' ?
        <Select
            labelInValue
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
            filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())
            }
            placeholder='-Chọn-' options={optionDatas} />
        : <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `${title} bắt buộc!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
export default EditableCell