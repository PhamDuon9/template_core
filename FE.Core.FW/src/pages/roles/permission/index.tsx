import { Card, Alert, Descriptions, Button, Divider, Space, Table, Collapse, Modal, Form, message, Row, Col, Input, Tooltip } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useReducer, useState } from 'react';
import { ResponseData, PaginationConfig } from '@/utils/request';
import dayjs from 'dayjs';
import { getRole, getRoleById } from '@/apis/services/RoleService';
import { Code, RoleModel } from '@/apis';
import { useRecoilState } from 'recoil';
import { navigationState } from '@/store/navigate';
import PermissionModule from './permissionModule';
import { getPolicyByRole } from '@/apis/services/PolicyService';
function Role() {

  const navigate = useNavigate();
  const params = useParams()
  // Load
  const { Panel } = Collapse;
  const [layoutState, setLayoutState] = useRecoilState(navigationState);
  const initState = {
    roleCurrent: {},
    permissions: []
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<RoleModel[]>([]);
  const [pagination, setPagination] = useState<PaginationConfig>({
    total: 0,
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
  });
  const [state, dispatch] = useReducer<(prevState: any, updatedProperty: any) => any>(
    (prevState: any, updatedProperty: any) => ({
      ...prevState,
      ...updatedProperty,
    }),
    initState,
  );

  const getList = async (current: number, pageSize: number = 10): Promise<void> => {
    setLoading(true);
    searchFormSubmit(current, pageSize);
    setLoading(false);
  };
  const getRoleCurrent = async (id: string): Promise<void> => {
    const responseRoleCurrent: ResponseData = await getRoleById(id);

    const stateDispatcher = {
      roleCurrent: responseRoleCurrent.data,
    }
    dispatch(stateDispatcher)
  };


  /**
   * Lấy danh sách quyền theo vai trò
   * @param roleId : Id của vai trò
   */
  const getPermissionByRoleCurrent = async (roleId: string): Promise<void> => {
    const responseRoleCurrent: ResponseData = await getPolicyByRole(roleId);

    if (responseRoleCurrent && responseRoleCurrent.code === Code._200) {
      const stateDispatcher = {
        permissions: responseRoleCurrent.data,
      }
      dispatch(stateDispatcher)
    }
  };

  useEffect(() => {
    getList(1);
    getRoleCurrent(params.roleId as string)
    getPermissionByRoleCurrent(params.roleId as string)
  }, []);


  const deleteRecord = (id: string) => {
    Modal.confirm({
      title: 'Cảnh báo',
      content: `Xác nhận xóa bản ghi này?`,
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      onOk: async () => {
        // await onHandleDeleteDividingRoom(id);
      },
    });
  };



  // searchForm
  const [searchForm] = Form.useForm();
  const searchFormSubmit = async (current: number = 1, pageSize: number = 10): Promise<void> => {
    try {
      const fieldsValue = await searchForm.validateFields();

      // console.log(fieldsValue);
      const response: ResponseData = await getRole(
        fieldsValue.Name,
        current,
        pageSize,
      );
      setList((response.data || []) as RoleModel[]);
      setPagination({
        ...pagination,
        current,
        total: response.totalCount || 0,
        pageSize: pageSize,
      });

      setLoading(false);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className='layout-main-conent'>
      <Card
        title={
          <div className="d-flex" style={{ background: "#fff" }}>
            <div className="left">
              <Tooltip title="Quay lại">
                <a className="btn-link back icon--back_24" href='javascript://' onClick={() => navigate(-1)}></a>
              </Tooltip>
            </div>
            <div className="right">
              <div className="avatar">
                <div className="img-default d-flex" style={{ fontSize: "16px", fontWeight: "600" }}>
                  <span>Vai trò:</span>&nbsp;
                  <div style={{ fontWeight: "400", marginRight: '4px' }}>{state?.roleCurrent?.name ?? ""}</div>

                </div>
              </div>
            </div>
          </div>}
      >

        <Row gutter={16} justify='end'>
          <Col span={24} className='gutter-row' style={{ marginBottom: '8px' }}>
            <Col span={24} className="gutter-row">
              <div className="d-flex" style={{ background: "#fff" }}>
                <div className="right">
                  <div className="avatar">
                    <div className="img-default d-flex" style={{ fontSize: "16px", fontWeight: "600" }}>
                      <span>Phân quyền các phân hệ</span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Col>
        </Row>
        <br></br>
        <PermissionModule module={layoutState}
          role={state?.roleCurrent}
          permissions={state?.permissions}
          getPermissionByRoleCurrent={getPermissionByRoleCurrent} />
      </Card>
    </div>
  );
}

export default Role;
