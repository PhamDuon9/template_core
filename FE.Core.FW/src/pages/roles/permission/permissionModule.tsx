import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { Button, Col, Form, Modal, Row, Select, message, Collapse, Space, Popover, Switch, Checkbox, Spin, CheckboxOptionType, Divider } from 'antd';
import { getArea, getHeadQuarter } from '@/apis/services/PageService';
import { ResponseData } from '@/apis/models/ResponseData';
import { IRouter } from '@/@types/router';
import { DownOutlined, LoadingOutlined } from '@ant-design/icons';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import type { RoleState, DefaultIndeterminate } from './roleState';
import { createOrUpdatePolicy } from '@/apis/services/PolicyService';
import { Code, PolicyModel, RoleModel } from '@/apis';
import { permissionOptions } from '@/utils/constants';
interface Props {
    module: IRouter[];
    role: RoleModel
    permissions: RoleState[]
    getPermissionByRoleCurrent: (roleId: string) => Promise<void>;
}
const CheckboxGroup = Checkbox.Group;
const { Panel } = Collapse;
const PermissionModule: React.FC<Props> = ({ module, role, permissions, getPermissionByRoleCurrent }) => {
    // console.log(permissions)//!đang bị render lại nhiều lần

    const [messageApi, contextHolder] = message.useMessage();
    const plainOptions: CheckboxOptionType[] = permissionOptions
    // const defaultCheckedList: RoleState[] = [
    //     {
    //         layoutCode: "role",
    //         permission: 15,
    //         permissions: [1, 2, 4, 8],
    //         displayName: "role"
    //     },
    //     {
    //         layoutCode: "workplace",
    //         permission: 3,
    //         permissions: [1, 2],
    //         displayName: "workplace"
    //     }
    // ];
    const [loading, setLoading] = useState<boolean>(false);
    const defaultIndeterminate: DefaultIndeterminate = {
        "role": false,
        "workplace": true,
    }

    const defaultCheckAll: DefaultIndeterminate = {}
    const [indeterminate, setIndeterminate] = useState<DefaultIndeterminate>(defaultIndeterminate);
    const [checkAll, setCheckAll] = useState<DefaultIndeterminate>(defaultCheckAll);

    const [checkedList, setCheckedList] = useState<RoleState[]>(permissions);
    React.useEffect(() => {
        console.log("render module")
        setCheckedList(permissions);

        let sumWithInitial = 0;
        for (let plainOption of plainOptions) {
            sumWithInitial += (+plainOption.value);
        }
        if (permissions && permissions.length > 0) {
            let checkAllMaps = { ...checkAll }
            permissions.forEach((item: RoleState, index) => {
                var isCheckAll = item.permission & sumWithInitial
                if (isCheckAll > 0) {
                    checkAllMaps[item.layoutCode] = true
                }
                else {
                    checkAllMaps[item.layoutCode] = false;
                }
            })
            setCheckAll(checkAllMaps)
        }
    }, [permissions]);

    /**
     * Hàm thực hiện call api update
     * @param modules : code của phân hệ
     */
    const updatePermissions = async (checkedListMapUpdate: RoleState[], modules: string) => {
        const checkExist = checkedListMapUpdate.find((item: RoleState) => item.layoutCode === modules)
        if (!checkExist) {
            messageApi.open({
                type: 'warning',
                content: 'This is a warning message',
            });
            return;
        }
        const policyModel: PolicyModel = {
            layoutCode: modules,
            permission: checkExist?.permission,
            roleId: role?.id,
            id: checkExist.id
        }
        // console.log(policyModel)

        setLoading(true)
        const res = await createOrUpdatePolicy("", policyModel)
        if (res && res.code === Code._200) {
            setLoading(false)
            getPermissionByRoleCurrent(role?.id as string)
            // messageApi.open({
            //     type: 'success',
            //     content: 'This is a warning message',
            // });
        }
    }

    const handleClickChange = (open: boolean, modules: string) => {
        if (!open) {
            //thực hiện call api update
            const checkedListMap = checkedList;
            updatePermissions(checkedListMap, modules);
        }
    };



    const content = (idModule: string) => {
        const defaultChecked = checkedList.find((item: RoleState, index) => item.layoutCode === idModule);
        const actionPermissions: CheckboxValueType[] | number[] = [];
        for (let plainOption of plainOptions) {
            var isEnable = (defaultChecked?.permission ?? 0) & (+plainOption.value)
            if (isEnable) {
                actionPermissions.push((+plainOption.value))
            }
        }
        return (
            <div id={idModule}>
                <CheckboxGroup options={plainOptions} value={actionPermissions} onChange={(list) => onChange(list, idModule)} />
            </div>
        )
    };


    /**
     * Hàm bắt sự kiện thay đổi của checkbox action trong mỗi phân hệ
     * @param list danh sách quyền theo dạng bit
     * @param code mã của phân hệ
     */
    const onChange = (list: CheckboxValueType[] | number[], code: string) => {
        let sumWithInitial = 0;
        for (let actionPermission of list) {
            sumWithInitial += (+actionPermission);
        }

        //nếu mà không có quyền xem thì sẽ tiến hành loại bỏ những quyền còn lại
        let checkPermissionView = sumWithInitial & +plainOptions[0].value;
        if (!checkPermissionView) {
            list.length = 0;
            sumWithInitial = 0
        }

        const checkExist = checkedList.find((item: RoleState) => item.layoutCode === code)
        let checkedListMap: RoleState[] = []
        if (checkExist != null) {
            checkedListMap = checkedList.map((item: RoleState, index) => {
                //nếu quyền đang tồn tại trong danh sách
                if (item.layoutCode === code) {
                    // item.permissions = list;
                    item.permission = sumWithInitial

                }
                return item;
            })
        }
        else {
            // checkedListMap = [...checkedList, { "layoutCode": code, "displayName": code, "permissions": list, "permission": sumWithInitial }]
            checkedListMap = [...checkedList, { "layoutCode": code, "displayName": code, "permission": sumWithInitial }]
        }

        setCheckedList(checkedListMap);

        const indeterminateMap = {
            ...indeterminate,
        }
        const isCheckIndeterminateModuleName = !!list.length && list.length < plainOptions.length;
        indeterminateMap[code] = isCheckIndeterminateModuleName;
        setIndeterminate(indeterminateMap);

        const checkAllMap = {
            ...checkAll,
        }
        // const isCheckAllModuleName = list.length === plainOptions.length;//dành cho checkbox
        const isCheckAllModuleName = list.length > 0;//dành cho checkbox
        checkAllMap[code] = isCheckAllModuleName;
        setCheckAll(checkAllMap);
    };

    // console.log(checkedList)

    /**
     * Sự kiện check all action trong phân hệ(nếu sử dụng cho checkbox)
     * @param e 
     * @param code mã của phân hệ
     */
    const onCheckAllChange = (e: CheckboxChangeEvent, code: string) => {
        const listPermissionDefault: number[] = [];
        let sumWithInitial = 0;


        if (e.target.checked) {
            for (let permissionBit of plainOptions) {
                listPermissionDefault.push(+permissionBit.value);
            }
            for (let actionPermission of plainOptions) {
                sumWithInitial += (+actionPermission.value);
            }
        }

        const checkExist = checkedList.find((item: RoleState) => item.layoutCode === code)
        let checkedListMap: RoleState[] = []
        if (checkExist != null) {
            checkedListMap = checkedList.map((item: RoleState, index) => {
                //nếu quyền đang tồn tại trong danh sách
                if (item.layoutCode === code) {
                    // item.permissions = listPermissionDefault;
                    item.permission = sumWithInitial
                }
                return item;
            })
        }
        else {
            // checkedListMap = [...checkedList, { "layoutCode": code, "displayName": code, "permissions": listPermissionDefault, "permission": sumWithInitial }]
            checkedListMap = [...checkedList, { "layoutCode": code, "displayName": code, "permission": sumWithInitial }]
        }
        setCheckedList(checkedListMap);

        const indeterminateMap = {
            ...indeterminate,
        }
        indeterminateMap[code] = false;
        setIndeterminate(indeterminateMap);

        const checkAllMap = {
            ...checkAll,
        }
        const isCheckAllModuleName = e.target.checked;
        checkAllMap[code] = isCheckAllModuleName;
        setCheckAll(checkAllMap);

        //thực hiện call api update
        updatePermissions(checkedListMap, code)
    };

    /**
     * Sự kiện check all action trong phân hệ(nếu sử dụng Switch)
     * @param e 
     * @param code mã của phân hệ
     */
    const onSwitchCheckAllChange = (checked: boolean, e: React.MouseEvent<HTMLButtonElement>, code: string) => {
        const listPermissionDefault: number[] = [];
        let sumWithInitial = 0;

        if (checked) {
            for (let permissionBit of plainOptions) {
                listPermissionDefault.push(+permissionBit.value);
            }
            for (let actionPermission of plainOptions) {
                sumWithInitial += (+actionPermission.value);
            }
        }

        const checkExist = checkedList.find((item: RoleState) => item.layoutCode === code)
        let checkedListMap: RoleState[] = []
        if (checkExist != null) {
            checkedListMap = checkedList.map((item: RoleState, index) => {
                //nếu quyền đang tồn tại trong danh sách
                if (item.layoutCode === code) {
                    // item.permissions = listPermissionDefault;
                    item.permission = sumWithInitial
                }
                return item;
            })
        }
        else {
            // checkedListMap = [...checkedList, { "layoutCode": code, "displayName": code, "permissions": listPermissionDefault, "permission": sumWithInitial }]
            checkedListMap = [...checkedList, { "layoutCode": code, "displayName": code, "permission": sumWithInitial }]
        }
        setCheckedList(checkedListMap);

        const indeterminateMap = {
            ...indeterminate,
        }
        indeterminateMap[code] = false;
        setIndeterminate(indeterminateMap);

        const checkAllMap = {
            ...checkAll,
        }
        const isCheckAllModuleName = checked;
        checkAllMap[code] = isCheckAllModuleName;
        setCheckAll(checkAllMap);

        //thực hiện call api update
        updatePermissions(checkedListMap, code)
    };

    const headerCollapse = (item: IRouter) => (
        <Space wrap>
            <span>{item.meta?.title}</span>
            <Switch size="small" checked={checkAll[item.code ?? ""]} onChange={(checked, event) => onSwitchCheckAllChange(checked, event, `${item.code}`)} />
        </Space>
    );
    const recursiveNode = (list: IRouter[]): JSX.Element | (JSX.Element | undefined)[] => {
        const listPermission = [...checkedList]
        const result = list ? list.map((item: IRouter, index) => {
            let displayNamePermission = ""
            let itemPermission = listPermission?.find((itemCheck: RoleState) => itemCheck.layoutCode === item.code)
            if (itemPermission) {
                for (const plainOption of plainOptions) {
                    var isEnable = (itemPermission?.permission ?? 0) & (+plainOption.value)
                    if (isEnable) {
                        if (displayNamePermission)
                            displayNamePermission += `, ${plainOption.label}`
                        else
                            displayNamePermission = `${plainOption.label}`
                    }
                }
            }
            if (item.isShow) {
                const checkChildrenIsShow = item?.children?.some((item: IRouter) => item.isShow)
                if (!item.children || item?.children?.length <= 0 || !checkChildrenIsShow) {
                    return (
                        <Row gutter={16} key={item.code}>
                            <Col span={6} className='gutter-row' style={{ marginBottom: '8px' }}>
                                <Space wrap>
                                    <div>{item.meta?.title}</div>
                                </Space>
                            </Col>
                            <Col span={18} className='gutter-row' style={{ marginBottom: '8px' }}>
                                <Space wrap>
                                    <Switch size="small" checked={checkAll[item.code ?? ""]} onChange={(checked, event) => onSwitchCheckAllChange(checked, event, `${item.code}`)} />
                                    {/* <Checkbox checked={checkAll[item.code ?? ""]}
                                        indeterminate={indeterminate[item.code ?? ""]}
                                        onChange={(event) => onCheckAllChange(event, `${item.code}`)} >
                                        Chọn tất cả
                                    </Checkbox> */}
                                    <Popover
                                        content={content(`${item.code}`)}
                                        trigger="click"
                                        onOpenChange={(event) => handleClickChange(event, `${item.code}`)}
                                    >
                                        <div className="d-flex">
                                            <Button type="text" className="d-flex" block>
                                                {displayNamePermission ?
                                                    <>
                                                        <span style={{ marginRight: "4px" }}>{displayNamePermission}</span>
                                                        <DownOutlined />
                                                    </> : <></>}

                                            </Button>
                                        </div>
                                    </Popover>
                                </Space>
                                <Divider style={{ margin: "0", color: "#d3d7de", minWidth: "400px" }} />
                            </Col>
                        </Row>
                    )
                }
                else {
                    return (
                        <Collapse style={{ margin: "6px 0" }} defaultActiveKey={[item.code ?? "1"]} key={item.code} activeKey={item.code ?? "1"}>
                            <Panel header={headerCollapse(item)} key={item.code ?? index}>
                                {recursiveNode(item.children ?? [])}
                            </Panel>
                        </Collapse>

                    )
                }

            }
        }) : <></>
        return result;
    }
    return (
        <Spin spinning={loading} delay={500}>
            {contextHolder}
            {recursiveNode(module)}
        </Spin>
    );
}

export default PermissionModule;