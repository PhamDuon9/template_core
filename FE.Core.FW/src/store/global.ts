import { atom, selector } from 'recoil';

import settings from '@/config/settings';

import { Theme, NavMode } from '@/@types/settings.d';
import { TabNavItem } from '@/@types/router.d';

export interface StateType {
  collapsed: boolean;
  headFixed: boolean;
  theme: Theme;
  leftSiderFixed: boolean;
  tabNavEnable: boolean;
  headTabNavList: TabNavItem[];
  navMode: NavMode;
}

const initialState: StateType | any = localStorage.getItem("globalState") ? JSON.parse(localStorage.getItem("globalState") || "{}") : {
  collapsed: true,
  headFixed: settings.headFixed,
  theme: settings.theme,
  leftSiderFixed: settings.leftSiderFixed,
  tabNavEnable: settings.tabNavEnable,
  headTabNavList: [],
  navMode: settings.navMode,
};

export const globalState = atom({
  key: 'globalState',
  default: initialState,
});

export const useGlobalState = selector({
  key: 'useGlobalState',
  get: ({ get }) => {
    const list = get(globalState);
    return list;
  },
  set: ({ get, set }, newGlobalState) => {	// để set trạng thái mới
    const list = get(globalState);
    // set(
    //   listTodoState,
    //   list.map((item) =>
    //     item.id === id ? { ...item, status: 'completed' } : item
    //   )
    // );
    localStorage.setItem("globalState", JSON.stringify({ list, ...newGlobalState }))
    set(globalState, { list, ...newGlobalState })
  },
});
