import { memo, useEffect, useMemo } from 'react';
import { /* Outlet, */ useLocation } from 'react-router-dom';
import classnames from 'classnames';

import { useRecoilState, useRecoilValue } from 'recoil';
import { globalState } from '@/store/global';
import { userState, useUserState } from '@/store/user';

import { formatRoutes } from '@/utils/router';

import Permission from '@/components/Permission';
import LeftSider from './components/LeftSider';
import RightTop from './components/RightTop';
import RightFooter from './components/RightFooter';
// import layoutRotes from './routes';
import useTitle from '@/hooks/useTitle';

import './css/index.less';
import { navigationState } from '@/store/navigate';
import { PermissionAction } from '@/utils/constants';

export interface UniversalLayoutProps {
  children: React.ReactNode;
}

export default memo(({ children }: UniversalLayoutProps) => {
  const location = useLocation();
  // const global = useRecoilValue(globalState);
  const [layoutState, setLayoutState] = useRecoilState(navigationState);
  const [global, setGobal] = useRecoilState(globalState);
  const user = useRecoilValue(useUserState);
  // const [user, setUserState] = useRecoilState(useUserState);
  // const user = useRecoilValue(userState);

  const routerPathKeyRouter = useMemo(() => formatRoutes(layoutState), []);
  const routeItem = useMemo(() => routerPathKeyRouter.pathKeyRouter[location.pathname], [location]);

  useTitle('IIG');

  return (
    <div id='universallayout' className={classnames({ light: global.theme === 'light' })}>
      {global.navMode === 'inline' && (
        <LeftSider
          collapsed={global.collapsed}
          userRoles={user.roles}
          menuData={routerPathKeyRouter.router}
          routeItem={routeItem}
          theme={global.theme}
          leftSiderFixed={global.leftSiderFixed}
        />
      )}
      <div id='universallayout-right'>
        <RightTop
          userRoles={user.roles}
          menuData={routerPathKeyRouter.router}
          jsonMenuData={routerPathKeyRouter.pathKeyRouter}
          routeItem={routeItem}
        />
        <div id='universallayout-right-main'>
          <Permission navigation={routeItem?.code as string} bitPermission={PermissionAction.View}>
            {/* <Outlet /> */}
            {children}
          </Permission>
          <RightFooter />
        </div>
      </div>
    </div>
  );
});
