import { lazy } from 'react';
import { IRouter } from '@/@types/router';

const pathPre = '/user';

const UserLayoutRoutes: IRouter[] = [
  {
    path: `${pathPre}/login`,
    meta: {
      title: 'Đăng nhập',
    },
    component: lazy(() => import('@/pages/user/login')),
  },
  {
    path: `${pathPre}/loginsuccess`,
    meta: {
      title: 'Đăng nhập thành công',
    },
    component: lazy(() => import('@/pages/user/loginsuccess')),
  },
  {
    path: `${pathPre}/logoutsuccess`,
    meta: {
      title: 'Đăng xuất thành công',
    },
    component: lazy(() => import('@/pages/user/logoutsuccess')),
  },
];

export default UserLayoutRoutes;
