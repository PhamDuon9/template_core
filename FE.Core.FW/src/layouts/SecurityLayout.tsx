import { memo, useCallback, useEffect, useMemo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useRecoilState } from 'recoil';
import { userState, CurrentUser, useUserState } from '@/store/user';

import PageLoading from '@/components/PageLoading';

import { ResponseData } from '@/utils/request';
import { getStatusAuth, queryCurrent } from '@/apis/services/PageService';
import { getToken } from '@/utils/localToken';
import { Code } from '@/apis';
import { getAuth } from '@/apis/services/AuthService';

export interface SecurityLayoutProps {
  children: React.ReactNode;
}

export default memo(({ children }: SecurityLayoutProps) => {
  const navigate = useNavigate();
  var isLogin = false;
  if (getToken() != null) {
    try {
      // call api get user info
      // const [user, setUser] = useRecoilState(useUserState);
      // const userCurrent: CurrentUser = {
      //   avatar: '',
      //   id: user.id,
      //   name: user.name,
      //   roles: user.roles,
      //   permissions: user.permissions
      // };
      // setUser({
      //   ...userCurrent,
      // });

      isLogin = true;

    } catch (error: any) {
      localStorage.clear();
      navigate('/user/login', { replace: true });
    }
  } else {
    <Navigate replace={true} to='/user/login' />
  }
  return <>{isLogin ? children : <Navigate replace={true} to='/user/login' />}</>;
});
