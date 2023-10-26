import React, { useState } from 'react';
import { FormInstance } from 'antd/lib/form';
import { Modal, Form, Input, Button, message, Select, TreeSelect, Switch } from 'antd';
import { NavigationModel, NavigationModelCustom } from '@/apis/models/NavigationModel';
import { convertTreeRouter } from '@/utils/router';
import { ITreeRouter } from '@/@types/router';

interface CreateFormProps {
  visible: boolean;
  values?: Partial<NavigationModelCustom>;
  onSubmitLoading: boolean;
  list: NavigationModelCustom[];
  onSubmit: (values: Omit<NavigationModelCustom, 'id'>, form: FormInstance) => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { visible, values, list, onSubmit, onSubmitLoading, onCancel } = props;
  var treeData: ITreeRouter[] = [];
  if (list != undefined) {
    treeData = convertTreeRouter(list);
  }
  const formVals: Omit<NavigationModel, 'id'> = {
    name: values?.name as string,
    url: values?.url as string,
    order: values?.order as number,
    resource: values?.resource as string,
    iconClass: values?.iconClass as string,
    isShow: values?.isShow as boolean || true,
  };

  const [form] = Form.useForm();

  const onFinish = async () => {
    try {
      const fieldsValue = await form.validateFields();
      onSubmit({ ...formVals, ...fieldsValue }, form);
    } catch (error) {
      message.warning('Hãy nhập đủ các trường');
    }
  };
  const [value, setValue] = useState<string | undefined>(undefined);

  const onChange = (newValue: string) => {
    setValue(newValue);
  };
  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      title='Thêm mới'
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key='back' onClick={() => onCancel()}>
          Hủy
        </Button>,
        <Button key='submit' type='primary' htmlType='submit' loading={onSubmitLoading} onClick={() => onFinish()}>
          Lưu
        </Button>,
      ]}
    >
      <Form
        form={form}
        name='createform'
        labelCol={{ span: 6 }}
        initialValues={{
          name: formVals.name,
          url: formVals.url,
          order: formVals.order,
          resource: formVals.resource,
          iconClass: formVals.iconClass,
          isShow: formVals.isShow,
        }}
      >
        <Form.Item
          label='Tên hiển thị'
          name='name'
          labelAlign='left'
          rules={[
            {
              required: true,
              validator: async (rule, value) => {
                if (value === '' || !value) {
                  throw new Error('Không được để trống');
                } else if (value.length > 255) {
                  throw new Error('Nhập không quá 255 ký tự');
                }
              },
            },
          ]}
        >
          <Input placeholder='Nhập tên hiển thị' />
        </Form.Item>
        <Form.Item
          label='Mã'
          name='code'
          labelAlign='left'
          rules={[
            {
              required: true,
              validator: async (rule, value) => {
                if (value === '' || !value) {
                  throw new Error('Không được để trống');
                } else if (value.length > 255) {
                  throw new Error('Nhập không quá 255 ký tự');
                }
              },
            },
          ]}
        >
          <Input placeholder='Mã điều hướng' />
        </Form.Item>
        <Form.Item label='Path cha' name='parentId' labelAlign='left' wrapperCol={{ span: 10 }}>
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            value={value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder='Chọn'
            allowClear
            treeDefaultExpandAll
            onChange={onChange}
            treeData={treeData}
          />
        </Form.Item>
        <Form.Item label='Đường dẫn' name='url' labelAlign='left'>
          <Input placeholder='Đường dẫn' />
        </Form.Item>
        <Form.Item label='Resource' name='resource' labelAlign='left'>
          <Input placeholder='Resource' />
        </Form.Item>
        <Form.Item label='Icon' name='iconClass' labelAlign='left'>
          <Input placeholder='Icon' />
        </Form.Item>
        <Form.Item label='Thứ tự hiển thị' name='order' labelAlign='left'>
          <Input placeholder='Thứ tự hiển thị' />
        </Form.Item>
        <Form.Item label='Component path' name='componentPath' labelAlign='left'>
          <Input placeholder='Đường dẫn component mặc định không sửa' />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 12 }}
          label='Hiển thị'
          name='isShow'
          valuePropName='checked'
          labelAlign='left'
        >
          <Switch defaultChecked />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForm;
