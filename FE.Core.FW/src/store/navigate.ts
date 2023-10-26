import { IRouter } from '@/@types/router.d';
import { getNav } from '@/layouts/UniversalLayout/routes';
import { atom, selector } from 'recoil';


export const navigationState = selector({
  key: 'navigationState',
  get: async ({ get }) => {
    const navigation: IRouter[] = await getNav();
    // localStorage.setItem('navigationState', JSON.stringify(navigation));
    return navigation;
  },
  set: ({ set }, newValue) => { },
});