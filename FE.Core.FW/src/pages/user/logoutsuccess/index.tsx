import { memo } from 'react';
import { Alert } from 'antd';
import { setToken, setRole, removeToken } from '@/utils/localToken';
import style from './index.module.less';

removeToken();

type Timer = ReturnType<typeof setTimeout>;

const timer: Timer = setTimeout(() => {
  window.location.href = window.location.origin;
}, 1000);

export default memo(() => {
  return (
    <div className={style.main}>
      <Alert message={'Đăng xuất thành công !'} type='success' showIcon />
    </div>
  );
});
