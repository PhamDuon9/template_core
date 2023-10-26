import React, { useState } from 'react';
import { FormInstance } from 'antd/lib/form';
import { Modal, Form, Input, Button, message, Checkbox, TreeSelect, Switch } from 'antd';
import { NavigationModel, NavigationModelCustom } from '@/apis/models/NavigationModel';
import { ITreeRouter } from '@/@types/router';
import { convertTreeRouter } from '@/utils/router';

interface UpdateFormPorps {
  visible: boolean;
  values: Partial<NavigationModelCustom>;
  onSubmitLoading: boolean;
  list: NavigationModelCustom[];
  onSubmit: (values: NavigationModelCustom, form: FormInstance) => void;
  onCancel: () => void;
}

const UpdateForm: React.FC<UpdateFormPorps> = (props) => {
  const { visible, values, list, onSubmit, onSubmitLoading, onCancel } = props;
  var treeData: ITreeRouter[] = [];
  const [value, setValue] = useState<string | undefined>(undefined);

  const onChange = (newValue: string) => {
    setValue(newValue);
  };

  if (list != undefined) {
    treeData = convertTreeRouter(list);
  }
  const formVals: NavigationModel = {
    id: values.key,
    name: values?.name || '',
    url: values?.url || '',
    code: values?.code || '',
    parentId: values.parentId || null,
    order: values?.order || 0,
    iconClass: values?.iconClass,
    componentPath: values.componentPath,
    resource: values.resource,
    isShow: values?.isShow
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

  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      title='Sửa'
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
        name='updateform'
        labelCol={{ span: 6 }}
        initialValues={{
          id: formVals.id,
          name: formVals.name,
          url: formVals.url,
          order: formVals.order,
          code: formVals.code,
          parentId: formVals.parentId,
          iconClass: formVals.iconClass,
          componentPath: formVals.componentPath,
          resource: formVals.resource,
          isShow: formVals.isShow
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
            placeholder='Please select'
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
          <Input type='number' placeholder='Thứ tự hiển thị' />
        </Form.Item>
        <Form.Item label='Component path' name='componentPath' labelAlign='left'>
          <Input disabled placeholder='Đường dẫn component mặc định không sửa' />
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

export default UpdateForm;
