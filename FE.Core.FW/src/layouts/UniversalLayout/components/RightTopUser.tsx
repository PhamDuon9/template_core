import { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Divider, Dropdown, Menu, MenuProps, Popover, Tooltip, Typography } from 'antd';

import { useRecoilState } from 'recoil';
import { userState, initialState, useUserState } from '@/store/user';

import { getIdToken, getToken, removeToken } from '@/utils/localToken';

import IconSvg from '@/components/IconSvg';
import { PoweroffOutlined, UserOutlined } from '@ant-design/icons';
import ChangePassword from '@/pages/roles/user/change-password';
import { UserModel } from '@/apis';

export default memo(() => {
  const [user, setUser] = useRecoilState(useUserState);

  const [showForm, setShowForm] = useState<boolean>(false);
  const navigate = useNavigate();

  const logOut = () => {
    // setUser({
    //   ...user,
    //   ...initialState,
    // });
    // const token = getIdToken();
    removeToken();
    window.location.href = "/"

    // window.location.href =
    //   import.meta.env.VITE_HOST_WSO2 + import.meta.env.VITE_HOST_TENANT_IIG +
    //   '/oidc/logout?id_token_hint=' +
    //   token +
    //   '&post_logout_redirect_uri=' +
    //   import.meta.env.VITE_REDIRECT_LOGOUT_WSO2 +
    //   '&state=1';
  };
  const { Title } = Typography;
  const items: MenuProps['items'] = [
    {
      key: 'userinfo',
      label: <div>
        <div>
          <Title level={5}>{user.fullname}</Title>
        </div>
        <div>{user.roles[0]}</div>
        <Divider style={{ margin: '8px 0' }} />
        <Button
          type="text"
          icon={<UserOutlined />}
          loading={false}
          onClick={() => setShowForm(true)}
        >
          Đổi mật khẩu
        </Button>
        <Divider style={{ margin: '8px 0' }} />
        <Button
          type="text"
          icon={<PoweroffOutlined />}
          loading={false}
          onClick={logOut}
        >
          Đăng xuất
        </Button>
      </div>,
    },
  ];
  return (
    <>
      <Dropdown menu={{ items }} trigger={['click']} placement="topRight">
        <a className='universallayout-top-usermenu ant-dropdown-link' onClick={(e) => e.preventDefault()}>
          {/* {user.name} */}
          <Tooltip title={user.fullname}>
            <UserOutlined height="24px" width="24px" />
          </Tooltip>
          {/* <IconSvg name='arrow-down' /> */}
        </a>
      </Dropdown>
      {showForm && <ChangePassword
        open={showForm}
        setOpen={setShowForm}
        userEdit={user as UserModel}
        logOut={logOut}
      />}
    </>
  );
});
