import { Alert } from 'antd';
import { setToken, setRole, setIdToken } from '@/utils/localToken';
import style from './index.module.less';
// import { getToken } from '@/apis/services/AuthService';
import { Code } from '@/apis';
// import { WSO2ResponseModel } from '@/apis/models/data';
import { memo, useEffect } from 'react';

let href = window.location.href.replace('/#', '')
const url = new URL(href);
const searchParams = url.searchParams;
const code = searchParams.get('code');

export default memo(() => {
  //hàm check đăng nhập thành công
//   useEffect(() => {
//     const fnToken = async () => {
//       const getTokenFromServer = await getToken(code as string);
//       if (getTokenFromServer.code == Code._200) {
//         const data = getTokenFromServer.data as WSO2ResponseModel;
//         setToken(data.access_token);
//         setIdToken(data.id_token);
//       } else {
//         window.location.href = window.location.origin + '/user/login';
//       }
//       type Timer = ReturnType<typeof setTimeout>;
//       const timer: Timer = setTimeout(() => {
//         window.location.href = window.location.origin;
//       }, 1000);
//     }
//     fnToken()
//   }, [])

  return (
    <div className={style.main}>
      <Alert message={'Đăng nhập thành công !'} type='success' showIcon />
    </div>
  );
});
