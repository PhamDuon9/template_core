import { PolicyModel } from './../apis/models/PolicyModel';
import { createElement, lazy } from 'react';
import { Navigate, RouteObject, Location } from 'react-router-dom';
import { merge } from 'lodash/fp';
import qs from 'query-string';
import { isExternal } from '@/utils/validate';
import { equalObject } from '@/utils/object';
import {
  IRouter,
  IPathKeyRouter,
  IRouterPathKeyRouter,
  BreadcrumbType,
  TabNavType,
  IPathKeyRouteObject,
  ITreeRouter,
  RouteComponent,
} from '@/@types/router';
import { NavigationModel, NavigationModelCustom } from '@/apis/models/NavigationModel';
import { routeArrays } from './constants';

const routeArray = routeArrays

export const createUseRoutes = (configRoutes: IRouter[], parentPath = '/'): RouteObject[] => {
  const routes: RouteObject[] = [];
  for (let index = 0; index < configRoutes.length; index++) {
    const item = configRoutes[index];
    if (isExternal(item.path)) {
      continue;
    }
    const routesItem: RouteObject = {};

    // path
    routesItem.path = item.path.startsWith('/')
      ? item.path
      : `${parentPath.endsWith('/') ? parentPath : `${parentPath}/`}${item.path}`;
    // element
    if (item.component) {
      routesItem.element = createElement(item.component);
    }
    // children
    const children: RouteObject[] = [];
    if (item.redirect) {
      children.push({
        path: routesItem.path,
        element: createElement(Navigate, { to: item.redirect }),
      });
    }
    if (item.children) {
      children.push(...createUseRoutes(item.children, routesItem.path));
    }
    if (children.length > 0) {
      routesItem.children = children;
    }

    // newItem push
    routes.push(routesItem);
  }

  return routes;
};

export const pathKeyCreateUseRoutes = (routes: RouteObject[]): IPathKeyRouteObject => {
  let jsonItems: IPathKeyRouteObject = {};
  for (let index = 0; index < routes.length; index++) {
    const item = routes[index];
    jsonItems[item.path || ''] = {
      ...item,
    };

    if (item.children) {
      jsonItems = merge(jsonItems, pathKeyCreateUseRoutes(item.children));
    }
  }
  return jsonItems;
};

export const convertRouter = (navs: NavigationModel[]): IRouter[] => {
  const items: IRouter[] = [];
  navs.forEach((item: NavigationModel) => {
    if (item?.children?.length as number > 0) {
      const children: NavigationModel[] = item?.children as NavigationModel[]

      if (item.componentPath?.trim() != '' && item.componentPath?.trim() != null) {
        let component: RouteComponent | any = routeArray.find(g => g.Code === item.code)?.ComponentPath;
        items.push({
          path: item.url != null ? (item.url as string) : '/',
          children: (item?.children?.length as number > 0 ? convertRouter(item.children as NavigationModel[]) : []) as [],
          component: component,
          meta: {
            icon: item.iconClass as string,
            title: item.name as string
          },
          redirect: (item?.children?.length as number > 0 ? (children[0] as NavigationModel).url : item.url) as string,
          isShow: item.isShow,
          code: item.code
        })
      } else {
        items.push({
          path: item.url != null ? (item.url as string) : '/',
          children: (item?.children?.length as number > 0 ? convertRouter(item.children as NavigationModel[]) : []) as [],
          meta: {
            icon: item.iconClass as string,
            title: item.name as string
          },
          redirect: (item?.children?.length as number > 0 ? (children[0] as NavigationModel).url : item.url) as string,
          isShow: item.isShow,
          code: item.code
        })
      }
    } else {
      if (item.componentPath?.trim() != '' && item.componentPath?.trim() != null) {
        let component: RouteComponent | any = routeArray.find(g => g.Code === item.code)?.ComponentPath;
        items.push({
          path: item.url != null ? (item.url as string) : '/',
          component: component,
          meta: {
            icon: item.iconClass as string,
            title: item.name as string
          },
          isShow: item.isShow,
          code: item.code
        })
      } else {
        items.push({
          path: item.url != null ? (item.url as string) : '/',
          meta: {
            icon: item.iconClass as string,
            title: item.name as string
          },
          isShow: item.isShow,
          code: item.code
        })
      }
    }


  });
  return items;
};

export const mapRouter = (navs: NavigationModel[]) => {
  const items: NavigationModelCustom[] = [];
  navs = navs.sort((a: NavigationModelCustom, b: NavigationModelCustom) => {
    return (a.order || 0) - (b.order || 0);
  });
  navs.forEach((item: NavigationModel) => {
    if (item?.children?.length as number > 0) {
      items.push({
        key: item.id,
        parentId: item.parentId,
        code: item.code,
        name: item.name,
        url: item.url,
        iconClass: item.iconClass,
        order: item.order,
        isShow: item.isShow,
        resource: item.resource,
        componentPath: item.componentPath,
        children: mapRouter(item.children as NavigationModel[]) as NavigationModelCustom[],
      })
    } else {
      items.push({
        key: item.id,
        parentId: item.parentId,
        code: item.code,
        name: item.name,
        url: item.url,
        isShow: item.isShow,
        iconClass: item.iconClass,
        order: item.order,
        resource: item.resource,
        componentPath: item.componentPath,
      })
    }

  });
  return items;
};

export const convertToList = (navs: NavigationModelCustom[]): NavigationModelCustom[] => {
  var itemR: NavigationModelCustom[] = [];
  navs.forEach((item: NavigationModelCustom) => {
    itemR.push(item)
    if (item?.children?.length as number > 0) {
      itemR = itemR.concat(convertToList(item.children as NavigationModelCustom[]));
    }
  });
  return itemR
};

export const findItem = (navs: NavigationModelCustom[], key: string): NavigationModelCustom => {
  const list = convertToList(navs);
  return list.find(p => p.key == key) as NavigationModelCustom;
};

export const convertTreeRouter = (navs: NavigationModelCustom[]): ITreeRouter[] => {
  const items: ITreeRouter[] = [];
  navs.forEach((item: NavigationModelCustom) => {
    if (item?.children?.length as number > 0) {
      items.push({
        value: item.key as string,
        children: (item?.children?.length as number > 0 ? convertTreeRouter(item.children as NavigationModelCustom[]) : []) as [],
        title: item.name as string,
      })
    } else {
      items.push({
        value: item.key as string,
        title: item.name as string,
      })
    }

  });
  return items;
};

export const formatRoutes = (routes: IRouter[], parentPath = '/', parentPaths: string[] = []): IRouterPathKeyRouter => {
  const items: IRouter[] = [];
  let jsonItems: IPathKeyRouter = {};

  for (let index = 0; index < routes.length; index++) {
    const item = routes[index];
    const newItem: IRouter = {
      ...item,
    };
    if (!item.isShow) {
      continue;
    }
    let path = item.path || '';
    if (!isExternal(item.path)) {
      path = item.path.startsWith('/')
        ? item.path
        : `${parentPath.endsWith('/') ? parentPath : `${parentPath}/`}${item.path}`;
    }
    newItem.path = path;

    // meta
    const meta = item.meta ? { ...item.meta } : {};
    // meta.parentPath
    const pPaths = meta.parentPath && meta.parentPath.length > 0 ? meta.parentPath : parentPaths;
    meta.parentPath = pPaths;
    newItem.meta = meta;

    // children
    let children: IRouter[] | undefined;
    let pkChildren: IPathKeyRouter | undefined;
    const checkChildrenIsShow = item?.children?.some((item: IRouter) => item.isShow)
    if (item.children && checkChildrenIsShow) {
      const fRoutes = formatRoutes(item.children, path, [...pPaths, path]);

      children = fRoutes.router;
      newItem.children = children;

      pkChildren = fRoutes.pathKeyRouter;
    }
    else {
      const fRoutes = formatRoutes(item.children ?? [], path, [...pPaths, path]);

      newItem.children = undefined

      pkChildren = fRoutes.pathKeyRouter;

    }

    // item
    items.push(newItem);
    jsonItems[path] = newItem;
    if (pkChildren) {
      jsonItems = merge(jsonItems, pkChildren);
    }
  }
  // console.log(items)
  return {
    router: items,
    pathKeyRouter: jsonItems,
  };
};

export const hasPermissionRoles = (userRoles: PolicyModel[], navigation?: string, bitPermission: number = 1): boolean => {
  if (userRoles.length < 1) {
    return false;
  }

  if (typeof navigation === 'undefined') {
    return true;
  }

  if (typeof navigation === 'string' || typeof navigation === 'object') {
    const permissionModule = userRoles.find((item: PolicyModel, index) => item.layoutCode === navigation);
    const hasPermissionRoles = !permissionModule ? false : (permissionModule.permission ?? 0) & bitPermission ? true : false
    return hasPermissionRoles;
  }


  return false;
};

export const getPathsTheRoutes = (pathname: string[], jsonRoutesData: IPathKeyRouter): IRouter[] => {
  const routeItem: IRouter[] = [];

  for (let index = 0, len = pathname.length; index < len; index += 1) {
    const element = pathname[index];
    const item = jsonRoutesData[element] || {};
    if (item.path !== '') {
      routeItem.push(item);
    }
  }

  return routeItem;
};

export const getBreadcrumbRoutes = (pathname: string, jsonRoutesData: IPathKeyRouter): BreadcrumbType[] => {
  const route: IRouter = jsonRoutesData[pathname] || {};
  if (!route.path) {
    return [];
  }

  if (!route.meta?.breadcrumb) {
    const parentPath = route.meta?.parentPath || [];
    const routes = getPathsTheRoutes(parentPath, jsonRoutesData);
    const bread: BreadcrumbType[] = [];

    for (let index = 0; index < routes.length; index++) {
      const element = routes[index];
      bread.push({
        title: element.meta?.title || '',
        path: element.path,
      });
    }

    if (route.meta?.breadcrumb === false) {
      return bread;
    }

    bread.push({
      title: route.meta?.title || '',
      path: route.path,
    });

    return bread;
  }

  return route.meta.breadcrumb;
};

export const equalTabNavRoute = (location1: Location, location2: Location, type: TabNavType = 'path'): boolean => {
  let is = false;
  switch (type) {
    case 'querypath': // path + query
      is =
        equalObject(qs.parse(location1.search), qs.parse(location2.search)) &&
        location1.pathname === location2.pathname;
      break;
    default: // path
      is = location1.pathname === location2.pathname;
      break;
  }

  return is;
};
