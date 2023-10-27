import { SelectOptionModel } from '@/@types/data';
import { Code, UserModel } from '@/apis';
import { getDepartment2 } from '@/apis/services/DepartmentService';
import { getRoleValueTypes } from '@/apis/services/RoleService';
import { deleteUser, deleteManyUser, getUser, getUserById, toggleStatus } from '@/apis/services/UserService';
import Permission from '@/components/Permission';
import { useUserState } from '@/store/user';
import { PermissionAction, layoutCode } from '@/utils/constants';
import { PaginationConfig, ResponseData } from '@/utils/request';
import { DeleteOutlined, EditOutlined, PlusOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Collapse,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Switch,
  Tooltip,
  message
} from 'antd';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import React, { useEffect, useReducer, useState } from 'react';
import { useRecoilValue } from 'recoil';
import CreateUser from './create';
import EditUser from './edit';
import UserRole from './user-role';

var checkedList: string[] = [];

function User() {
  // Default
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<UserModel[]>([]);
  const [pagination, setPagination] = useState<PaginationConfig>({
    total: 0,
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
  });
  const getList = async (current: number, pageSize: number = 10): Promise<void> => {
    setLoading(true);
    searchFormSubmit(current, pageSize);
    setLoading(false);
  };

  // searchForm
  const [searchForm] = Form.useForm();
  const searchFormSubmit = async (current: number = 1, pageSize: number = 20): Promise<void> => {
    try {
      const fieldsValue = await searchForm.validateFields();
      setLoading(true)
      const filter = {
        ...fieldsValue,
        pageNumber: current,
        pageSize: pageSize,
      }
      console.log(filter)
      const response: ResponseData = await getUser(
        JSON.stringify(filter)
      );
      setList((response.data || []) as UserModel[]);
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

  //Detail
  const { Panel } = Collapse;
  useEffect(() => {
    getList(1);
  }, []);
  const [selectedRowDeleteKeys, setSelectedRowDeleteKeys] = useState<string[]>([]);
  const [showLoadingCreate, setShowLoadingCreate] = useState<boolean>(false);
  const [showLoadingDelete, setShowLoadingDelete] = useState<boolean>(false);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [userEdit, setUserEdit] = useState<UserModel>({});
  const [initLoadingModal, setInitLoadingModal] = useState<boolean>(false);
  const user = useRecoilValue(useUserState);
  const initState = {
    roles: [],
    showFormUserRole: false,
    initFormUserRole: false,
    iigdepartments: []
  }

  const [state, dispatch] = useReducer<(prevState: any, updatedProperty: any) => any>((prevState: any, updatedProperty: any) => ({
    ...prevState,
    ...updatedProperty,
  }), initState);

  //Function
  const onHandleShowModalCreate = async () => {
    setShowLoadingCreate(true)
    const responseIIGDepartment: ResponseData = await getDepartment2();

    if (responseIIGDepartment.code === Code._200) {
      const stateDispatcher = {
        iigdepartments: responseIIGDepartment.data ?? []
      };
      dispatch(stateDispatcher);
      setShowLoadingCreate(false)

    }
    else {
      message.error(responseIIGDepartment.message)
    }
  };

  const onHandleShowModalEdit = async (status: boolean, userId: string) => {
    await getUserCurrentEdit(userId)
  };

  const onHandleShowModalUserRole = async (status: boolean, userEdit: UserModel) => {
    setUserEdit(userEdit)
    await getRoles()
  };

  const deleteRecord = (id: string) => {
    Modal.confirm({
      title: 'Cảnh báo',
      content: `Xác nhận xóa bản ghi này?`,
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      onOk: async () => {
        const response = await deleteUser(id);
        if (response.code === Code._200) {
          message.success(response.message || "Xóa thành công")
          getList(pagination.current, pagination.pageSize)
        }
        else {
          message.error(response.message || "Xóa thất bại")
        }
      },
    });
  };

  const multiDeleteRecord = () => {
    setShowLoadingDelete(true)
    Modal.confirm({
      title: 'Cảnh báo',
      content: `Xác nhận xóa những bản ghi đã chọn?`,
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      onOk: async () => {
        const response = await deleteManyUser(undefined,selectedRowDeleteKeys);
        setShowLoadingDelete(false)
        if (response.code === Code._200) {
          message.success(response.message)
          setSelectedRowDeleteKeys([])
          getList(1);
        }
        else {
          message.error(response.message)
        }
      },
    });
  };

  const switchStatusUser = async (checked: boolean, event: React.MouseEvent<HTMLButtonElement>, userId: string) => {
    Modal.confirm({
      title: 'Xác nhận',
      content: checked ? `Bạn có thực sự muốn kích hoạt người dùng này?` : 'Bạn có thực sự muốn ngừng kích hoạt người dùng này?',
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      onOk: async () => {
        const response = await toggleStatus(userId, checked);
        if (response.code === Code._200) {
          message.success(response.message || "Thành công")
          getList(pagination.current, pagination.pageSize)
        }
        else {
          message.error(response.message || "Thất bại")
        }
      },
    });
  }

  /**
   * Lấy danh sách vai trò
   * @param id 
   */
  const getRoles = async (): Promise<void> => {
    const stateDispatcher = {
      initFormUserRole: true,
    }
    dispatch(stateDispatcher)
    const response: ResponseData = await getRoleValueTypes();
    if (response && response.code === Code._200) {
      const getUserCurrent = response.data as SelectOptionModel[] ?? [];
      const stateDispatcher = {
        roles: getUserCurrent,
        initFormUserRole: false,
        showFormUserRole: true
      }
      dispatch(stateDispatcher)
    }
  };

  /**
   * Lấy thông tin người dùng cần update
   * @param id 
   */
  const getUserCurrentEdit = async (id: string): Promise<void> => {
    setInitLoadingModal(true)
    const response: ResponseData = await getUserById(id);
    const responseIIGDepartment: ResponseData = await getDepartment2();
    if (response && response.code === Code._200) {
      const getUserCurrent = response.data as UserModel ?? {};
      const stateDispatcher = {
        iigdepartments: responseIIGDepartment.data ?? []
      };
      dispatch(stateDispatcher);
      setUserEdit(getUserCurrent)
      setInitLoadingModal(false)
      setShowEditForm(true);
    }
  };

  const columns: ProColumns<UserModel>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      render: (_, record, index) => <>{(pagination.current - 1) * pagination.pageSize + index + 1}</>,
    },
    {
      title: 'Tên tài khoản',
      dataIndex: 'username',
      render: (_, record) => <span>{record.username}</span>,
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'fullname',
      render: (_, record) => <span>{record.fullname}</span>,
    },
    {
      title: 'Phòng ban',
      dataIndex: 'departmentName',
      render: (_, record) => <span>{record.departmentName}</span>,
    },
    {
      title: 'Vai trò',
      dataIndex: 'roleName',
      render: (_, record) => <span>{record.roleName}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isLocked',
      render: (status, record) => <Switch size="small" checked={!record.isLocked} onChange={(checked, event) => switchStatusUser(checked, event, record.id ?? "")} />,
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      align: 'center',
      width: 300,
      render: (_, record) => (
        <Space>
          <Permission navigation={layoutCode.user} bitPermission={PermissionAction.Edit} noNode={<></>}>
            <Button type="primary" size={"small"} loading={initLoadingModal} onClick={() => onHandleShowModalEdit(true, record.id ?? "")}>
              <Tooltip title="Chỉnh sửa">
                <EditOutlined />
              </Tooltip>
            </Button>
          </Permission>

          <Button type="default" disabled={record.id === user.id} size={"small"} loading={state.initFormUserRole} onClick={() => onHandleShowModalUserRole(true, record)}>
            <Tooltip title="Nhóm người dùng">
              <UsergroupAddOutlined />
            </Tooltip>
          </Button>

          <Permission navigation={layoutCode.user} bitPermission={PermissionAction.Delete} noNode={<></>}>
            <Button type='dashed' disabled={record.id === user.id} size={"small"} loading={false} onClick={() => deleteRecord(record.id || '')}>
              <Tooltip title="Xóa">
                <DeleteOutlined />
              </Tooltip>
            </Button>
          </Permission>

        </Space>
      ),
    },
  ];
  return (
    <div className='layout-main-conent'>
      <Card
        bordered={false}
        title={
          <>
            <Row gutter={16} justify='start'>

              <Col span={24} className='gutter-row'>
                <Collapse>
                  <Panel header='Tìm kiếm' key='1'>
                    <Form
                      form={searchForm}
                      name='search'
                      initialValues={{
                        ['TextSearch']: '',
                      }}
                    >
                      <Row gutter={16} justify='start'>
                        <Col span={6}>
                          <Form.Item
                            label={'Tên tài khoản'}
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 17 }}
                            name='TextSearch'
                          >
                            <Input
                              placeholder='Tên tài khoản'
                              allowClear />
                          </Form.Item>
                        </Col>

                        <Col span={24}>
                          <Button type='primary' htmlType='submit' onClick={() => searchFormSubmit()}>
                            Tìm kiếm
                          </Button>
                          <Button htmlType='button' style={{ marginLeft: 8 }} onClick={() => searchForm.resetFields()}>
                            Làm lại
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Panel>
                </Collapse>
              </Col>
            </Row>
          </>
        }
        extra={<div></div>}
      >
        <ProTable<UserModel>
          dataSource={list}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            onChange: (page: number, pageSize: number) => {
              getList(page, pageSize);
            },
          }}
          scroll={{ x: '100vw', y: '460px' }}
          columns={columns}
          search={false}
          dateFormatter="string"
          headerTitle="Tiêu đề"
          toolBarRender={() => [
            <Permission noNode navigation={layoutCode.user as string} bitPermission={PermissionAction.Add}>
              <Button htmlType='button' type='default' loading={showLoadingCreate} onClick={() => onHandleShowModalCreate()}>
                <PlusOutlined />
                Tạo mới
              </Button>
            </Permission>,
            <Permission noNode navigation={layoutCode.user as string} bitPermission={PermissionAction.Delete}>
              <Button htmlType='button' danger type='default' loading={showLoadingDelete} onClick={() => multiDeleteRecord()}>
                <DeleteOutlined />
                Xóa
              </Button>
            </Permission>
          ]}
        />
      </Card>

      {showCreateForm && (
        <CreateUser
          open={showCreateForm}
          setOpen={setShowCreateForm}
          reload={searchFormSubmit}
          iigdepartments={state.iigdepartments}
        />
      )}

      {showEditForm && (
        <EditUser
          open={showEditForm}
          setOpen={setShowEditForm}
          reload={searchFormSubmit}
          userEdit={userEdit}
          initLoadingModal={initLoadingModal}
          iigdepartments={state.iigdepartments}
        />
      )}
      {state.showFormUserRole && (
        <UserRole
          open={state.showFormUserRole}
          setOpen={() => dispatch({ showFormUserRole: false })}
          reload={searchFormSubmit}
          role={state.roles}
          userEdit={userEdit}
          initLoadingModal={state.initFormUserRole}
        />
      )}
    </div>
  );
}

export default User;
