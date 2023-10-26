import React, { useState } from 'react';
import { FormInstance } from 'antd/lib/form';
import { Modal, Form, Input, Button, message, Checkbox, TreeSelect, DatePicker, Switch } from 'antd';
import { ITreeRouter } from '@/@types/router';
import { convertTreeRouter } from '@/utils/router';
import { UserModel } from '@/apis/models/UserModel';
import TableForm from '@/components/TableForm/TableForm';
import { UserMetadataModel } from '@/apis';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import moment from "moment";

dayjs.extend(customParseFormat);
interface UpdateFormPorps {
  visible: boolean;
  values: Partial<UserModel>;
  onSubmitLoading: boolean;
  onSubmit: (values: UserModel, form: FormInstance) => void;
  onCancel: () => void;
}

const UpdateForm: React.FC<UpdateFormPorps> = (props) => {
  const { visible, values, onSubmit, onSubmitLoading, onCancel } = props;
  var treeData: ITreeRouter[] = [];
  const [value, setValue] = useState<string | undefined>(undefined);
  const dateFormat = 'YYYY-MM-DD';
  const onChange = (newValue: string) => {
    setValue(newValue);
  };

  const formVals: UserModel = {
    id: values.id,
    fullname: values?.fullname as string,
    username: values?.username as string,
    dob: values?.dob,
    email: values?.email as string,
    phone: values?.phone as string,
    metadata: values?.metadata as UserMetadataModel[],
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
      width={'50%'}
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
        name='editform'
        labelCol={{ span: 6 }}
        initialValues={{
          id: formVals.id,
          fullname: formVals.fullname,
          username: formVals.username,
          dob: moment(formVals.dob),
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
          <Input disabled placeholder='Nhập tên tài khoản' />
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
          <Input disabled placeholder='Email' />
        </Form.Item>
        <Form.Item label='Ngày sinh' name='dob' labelAlign='left'>
          <DatePicker />
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

export default UpdateForm;
