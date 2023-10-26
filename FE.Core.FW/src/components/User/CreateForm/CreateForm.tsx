import React, { useState } from 'react';
import { FormInstance } from 'antd/lib/form';
import { Modal, Form, Input, Button, message, Select, TreeSelect, Checkbox, DatePicker, Switch } from 'antd';
import { UserModel } from '@/apis/models/UserModel';
import TableForm from '@/components/TableForm/TableForm';

interface CreateFormProps {
  visible: boolean;
  values?: Partial<UserModel>;
  listKey: { id: string; key: string; value: string }[];
  listValue: { id: string; key: string; value: string }[];
  onSubmitLoading: boolean;
  onSubmit: (values: Omit<UserModel, 'id'>, form: FormInstance) => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { visible, values, listKey, listValue, onSubmit, onSubmitLoading, onCancel } = props;

  const formVals: Omit<UserModel, 'id'> = {
    fullname: values?.fullname || '',
    dob: values?.dob,
    email: values?.email as string,
    phone: values?.phone as string,
    metadata: values?.metadata as [],
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
      width={'50%'}
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
          fullname: formVals.fullname,
          dob: formVals.dob,
          email: formVals.email,
          phone: formVals.phone,
          metadata: formVals.metadata,
        }}
      >
        <Form.Item
          label='Tên hiển thị'
          name='fullname'
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
          label='Username'
          name='username'
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
          <Input placeholder='Nhập tên tài khoản' />
        </Form.Item>
        <Form.Item
          label='Email'
          name='email'
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
          <Input placeholder='Email' />
        </Form.Item>
        <Form.Item label='Ngày sinh' name='dob' labelAlign='left'>
          <DatePicker format={'YYYY-MM-DD'} placeholder='Chọn ngày sinh' />
        </Form.Item>
        <Form.Item label='Số điện thoại' name='phone' labelAlign='left'>
          <Input placeholder='Số điện thoại' />
        </Form.Item>
        <Form.Item label='Active' name='isActive' labelAlign='left'>
          <Switch defaultChecked />
        </Form.Item>
        <Form.Item label='MetaData' name='metadata' labelAlign='left'>
          <TableForm />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForm;
