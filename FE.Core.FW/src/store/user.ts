import { UserModel } from './../apis/models/UserModel';
import { Code, PolicyModel } from '@/apis';
import { getCurrentUser } from '@/apis/services/UserService';
import { atom, selector } from 'recoil';
import { useNavigate } from 'react-router-dom';

export interface CurrentUser {
  id?: string;
  syncId?: string | null,
  username?: string | null;
  fullname?: string | null;
  avatar: string;
  roles: string[];
  permissions: PolicyModel[];
  accessDataHeaderQuater: string[];
}

export const initialState: CurrentUser = {
  id: '',
  syncId: '',
  username: '',
  fullname: '',
  avatar: '',
  roles: [],
  permissions: [],
  accessDataHeaderQuater: []
};

export const userState = atom({
  key: 'userState',
  default: initialState,
});

export const useUserState = selector({
  key: 'useUserState',
  get: async ({ get }) => {
    let list = get(userState);
    const userFromLocalStorage: CurrentUser = localStorage.getItem("permissionSetting") ? JSON.parse(localStorage.getItem("permissionSetting") as string) : ''
    if (userFromLocalStorage) {
      list = userFromLocalStorage
      return list
    }
    const userCurrent = await getCurrentUser()
    if (userCurrent.code === Code._200) {
      const userResponse: UserModel = userCurrent.data as UserModel;
      list = {
        id: userResponse.id,
        syncId: userResponse.syncId,
        fullname: userResponse.fullname ?? "",
        username: userResponse.username ?? "",
        avatar: '',
        roles: [`${userResponse.roleName}`],
        permissions: userResponse.permissions ?? [],
        accessDataHeaderQuater: userResponse.accessDataHeaderQuater as string[]
      }
      localStorage.setItem("permissionSetting", JSON.stringify({ ...list }))

    }

    return list;
  },
  set: ({ get, set }, newGlobalState) => {	// để set trạng thái mới
    const list: CurrentUser = get(userState);
    localStorage.setItem("permissionSetting", JSON.stringify({ list, ...newGlobalState }))
    set(userState, { ...list })
  },
});

export const userMessageState = selector({
  key: 'userMessageState',
  get: async () => {
    return 10;
  },
});
