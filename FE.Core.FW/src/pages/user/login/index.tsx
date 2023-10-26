import { memo } from 'react';
import { Button, Form, Input, message } from 'antd';
import style from './index.module.less';
import { removeToken, setToken } from '@/utils/localToken';
import { postAuth } from '@/apis/services/AuthService';
import { UserModel } from '@/apis/models/UserModel';
import { Code } from '@/apis';

export default memo(() => {
  removeToken();
  const onFinish = async (values: any) => {
    const fieldsValue = await searchForm.validateFields();
    var model: UserModel = {
      ...values
    }

    const validateLogin = await postAuth("", model)
    console.log(validateLogin);

    if (validateLogin.token) {
      //redirect đến trang chỉnh sửa
      setToken(validateLogin.token);
      window.location.href = "/"
    }
    else {
      message.error("Thất bại")
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const validateMessages = {
    required: '${label} không được để trống',
    whitespace: '${label} không được để trống',
    types: {
      email: '${label} không đúng định dạng email',
      number: '${label} không đúng định dạng số',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };
  const [searchForm] = Form.useForm();

  return (
    <div className={style.main}>
      <h1 className={style.title}>{'Đăng nhập'}</h1>
      <Form
        form={searchForm}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        validateMessages={validateMessages}
      >
        <Form.Item
          label="Tài khoản"
          name="username"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});
