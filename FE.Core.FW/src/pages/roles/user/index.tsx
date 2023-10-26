import { SelectOptionModel } from '@/@types/data';
import { Code, UserModel } from '@/apis';
import { getDepartment2 } from '@/apis/services/DepartmentService';
import { getRoleValueTypes } from '@/apis/services/RoleService';
import { deleteUser, getUser, getUserById, toggleStatus } from '@/apis/services/UserService';
import Permission from '@/components/Permission';
import { useUserState } from '@/store/user';
import { PermissionAction, layoutCode } from '@/utils/constants';
import { PaginationConfig, ResponseData } from '@/utils/request';
import { DeleteOutlined, EditOutlined, PlusOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Button, Card, Col, Collapse, Form, Modal, Row, Space, Switch, Table, Tooltip, message } from 'antd';
import Search from 'antd/lib/input/Search';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import CreateUser from './create';
import EditUser from './edit';
import UserRole from './user-role';

function User() {

  const navigate = useNavigate();
  // Load
  const { Panel } = Collapse;

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
  useEffect(() => {
    getList(1);
  }, []);



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

  // Data
  const [showModelDividingExamRoomVisible, setShowModelDividingExamRoomVisible] = useState<boolean>(false);
  const [showLoadingCreate, setShowLoadingCreate] = useState<boolean>(false);
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


  const onHandleShowModelCreate = async () => {
    setShowLoadingCreate(true)
    const responseIIGDepartment: ResponseData = await getDepartment2();

    if (responseIIGDepartment.code === Code._200) {
      const stateDispatcher = {
        iigdepartments: responseIIGDepartment.data ?? []
      };
      dispatch(stateDispatcher);
      setShowModelDividingExamRoomVisible(true);
      setShowLoadingCreate(false)

    }
    else {
      message.error(responseIIGDepartment.message)
    }
  };
  const onHandleToggleModelEdit = async (status: boolean, userId: string) => {
    await getUserCurrentEdit(userId)
  };

  const onHandleShowFormUserRole = async (status: boolean, userEdit: UserModel) => {
    setUserEdit(userEdit)
    await getRoles()
  };

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

  const onHandleSwitchStatusUser = async (checked: boolean, event: React.MouseEvent<HTMLButtonElement>, userId: string) => {
    // console.log(`${userId}:${checked}`)
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
      // afterClose: async () => {
      //   getList(pagination.current, pagination.pageSize);
      // },
    });
  }

  // searchForm
  const [searchForm] = Form.useForm();
  const searchFormSubmit = async (current: number = 1, pageSize: number = 10): Promise<void> => {
    try {
      const fieldsValue = await searchForm.validateFields();
      // console.log(fieldsValue);
      const response: ResponseData = await getUser(
        fieldsValue.Name,
        current,
        pageSize,
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

  const columns: ColumnsType<UserModel> = [
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
      dataIndex: 'isDisabled',
      render: (status, record) => <Switch size="small" checked={!status} onChange={(checked, event) => onHandleSwitchStatusUser(checked, event, record.id ?? "")} />,
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
            <Button type="primary" size={"small"} loading={initLoadingModal} onClick={() => onHandleToggleModelEdit(true, record.id ?? "")}>
              <Tooltip title="Chỉnh sửa">
                <EditOutlined />
              </Tooltip>
            </Button>
          </Permission>

          <Button type="default" disabled={record.id === user.id} size={"small"} loading={state.initFormUserRole} onClick={() => onHandleShowFormUserRole(true, record)}>
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
        title={'Danh sách người dùng'}
      >

        <Row gutter={16} justify='end'>
          <Col span={12} className='gutter-row' style={{ marginBottom: '8px' }}>
            <Form form={searchForm} name='search'
              initialValues={{
                ["Name"]: '',
              }}
            >
              <Row gutter={16} justify='start'>
                <Col span={24}>
                  <Form.Item label={''} labelCol={{ span: 0 }} wrapperCol={{ span: 17 }} name='Name'>
                    <Search placeholder="Tìm kiếm" allowClear onSearch={() => searchFormSubmit()} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col span={12} className='gutter-row' style={{ marginBottom: '8px', textAlign: 'end' }}>
            <Permission navigation={layoutCode.user} bitPermission={PermissionAction.Add} noNode={<></>}>
              <Button type='primary' loading={showLoadingCreate} icon={<PlusOutlined />} size={"middle"} onClick={() => onHandleShowModelCreate()}>
                Thêm mới
              </Button>
            </Permission>
          </Col>
        </Row>
        <br></br>
        <Table
          rowKey='id'
          columns={columns}
          dataSource={list}
          loading={loading}
          scroll={{ x: '100vw', y: '460px' }}
          pagination={{
            ...pagination,
            onChange: (page: number, pageSize: number) => {
              getList(page, pageSize);
            },
          }}
        />
      </Card>

      {showModelDividingExamRoomVisible && (
        <CreateUser
          open={showModelDividingExamRoomVisible}
          setOpen={setShowModelDividingExamRoomVisible}
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
