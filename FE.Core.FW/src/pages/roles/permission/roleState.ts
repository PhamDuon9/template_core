import { CheckboxValueType } from "antd/lib/checkbox/Group";

export type RoleState = {
    layoutCode: string;
    permission: number;
    // permissions: CheckboxValueType[] | number[];
    displayName: string;
    id?: string;
    roleId?: string;
}


export interface DefaultIndeterminate {
    [key: string]: boolean;
}