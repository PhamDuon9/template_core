import React, { lazy, memo, Suspense } from 'react';
import { RouteObject, useLocation, useRoutes } from 'react-router-dom';
import { createUseRoutes, pathKeyCreateUseRoutes } from '@/utils/router';
import { setToken } from '@/utils/localToken';
import PageLoading from '@/components/PageLoading';

// BlankLayout
import BlankLayout from '@/layouts/BlankLayout';

// SecurityLayout
import SecurityLayout from '@/layouts/SecurityLayout';

// UniversalLayout
// import UniversalLayoutRoutes from '@/layouts/UniversalLayout/routes';
import UniversalLayout from '@/layouts/UniversalLayout';

// UserLayout
import UserLayoutRoutes from '@/layouts/UserLayout/routes';
import UserLayout from '@/layouts/UserLayout';
import { useRecoilState } from 'recoil';
import { navigationState } from '@/store/navigate';


let routes: RouteObject[] = [];



export const SuspenseLazy = memo(({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoading />}>{children}</Suspense>
));

export default memo(() => {
  const [layoutState, setLayoutState] = useRecoilState(navigationState);
  console.log(layoutState)
  routes = createUseRoutes([
    {
      path: '/',
      redirect: '/home',
      children: layoutState,
    },
    {
      path: '/user',
      redirect: '/user/login',
      children: UserLayoutRoutes,
    },
    {
      path: '*',
      component: lazy(() => import('@/pages/404')),
    },
  ]);
  let layoutToRoutes = {
    UniversalLayout: pathKeyCreateUseRoutes([routes[0]]),
    UserLayout: pathKeyCreateUseRoutes([routes[1]]),
  };
  const routesElement = useRoutes(routes);
  const location = useLocation();

  if (layoutToRoutes.UserLayout[location.pathname]) {
    return (
      <UserLayout>
        <SuspenseLazy>{routesElement}</SuspenseLazy>
      </UserLayout>
    );
  }
  // if (layoutToRoutes.UniversalLayout[location.pathname]) {
  if (true) {
    return (
      <SecurityLayout>
        <UniversalLayout>
          <SuspenseLazy>{routesElement}</SuspenseLazy>
        </UniversalLayout>
      </SecurityLayout>
    );
  }

  // return (
  //   <BlankLayout>
  //     <SuspenseLazy>{routesElement}</SuspenseLazy>
  //   </BlankLayout>
  // );
});
