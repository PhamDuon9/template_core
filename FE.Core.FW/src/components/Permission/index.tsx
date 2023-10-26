import React from 'react';
import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';
import { useRecoilValue } from 'recoil';
import { userState, useUserState } from '@/store/user';
import { hasPermissionRoles } from '@/utils/router';
import { IRouter } from '@/@types/router';

const Forbidden = (
  <Result
    status={403}
    title='403'
    subTitle='Bạn không có quyền truy cập trang web'
    extra={
      <Button type='primary'>
        <Link to='home/workplace'>Trang chủ</Link>
      </Button>
    }
  />
);

export interface ALinkProps {
  children: React.ReactNode;
  navigation?: string;
  bitPermission?: number;
  noNode?: React.ReactNode;
}

const Permission: React.FC<ALinkProps> = ({ navigation, bitPermission, noNode = Forbidden, children }) => {
  const user = useRecoilValue(useUserState);
  const permissions = user.permissions
  return hasPermissionRoles(permissions, navigation, bitPermission) ? <>{children}</> : <>{noNode}</>;
};

export default Permission;
