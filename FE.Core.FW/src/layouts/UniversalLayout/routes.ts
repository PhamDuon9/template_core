import { lazy } from 'react';
import { IRouter } from '@/@types/router.d';
import { NavigationModel } from '@/apis/models/NavigationModel';
import { ResponseData } from '@/apis';
import { getNavigation } from '@/apis/services/NavigationService';
import { convertRouter } from '@/utils/router';

export const getNav = async (): Promise<IRouter[]> => {
  const response: ResponseData<NavigationModel> = (await getNavigation()) as ResponseData<NavigationModel>;
  var lists: NavigationModel[] = response.data as NavigationModel[];
  lists = lists.filter((item: NavigationModel) => {
    return item.url != null;
  });
  lists = lists.sort((a: NavigationModel, b: NavigationModel) => (a.order || 0) - (b.order || 0));
  return convertRouter(lists);
};
// const routerFromApi = await getNav();

// export default routerFromApi;
