import { Card, Alert, Descriptions, Button, Divider, Space, Table, Collapse, Modal, Form, message, Row, Col, Input, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useReducer, useState } from 'react';
import { ResponseData, PaginationConfig } from '@/utils/request';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { ClusterOutlined, DeleteOutlined, HddOutlined, PlusOutlined } from '@ant-design/icons';
import Search from 'antd/lib/input/Search';
import CreateRole from '../CreateRole/Create';
import { deleteRole, getRole, getRoleById, treeView } from '@/apis/services/RoleService';
import { Code, RoleModel } from '@/apis';
import Permission from '@/components/Permission';
import { layoutCode, PermissionAction } from '@/utils/constants';
import AccessDataRole from './access-data';
import type { DefaultOptionType } from 'antd/es/select';

function Role() {

  const navigate = useNavigate();
  // Load
  const { Panel } = Collapse;

  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<RoleModel[]>([]);
  const [roleEdit, setRoleEdit] = useState<RoleModel>({});
  const [accessData, setAccessData] = useState<Omit<DefaultOptionType, 'label'>[]>([]);
  const [pagination, setPagination] = useState<PaginationConfig>({
    total: 0,
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
  });

  const getList = async (current: number, pageSize: number = 10): Promise<void> => {
    searchFormSubmit(current, pageSize);
  };

  /**
   * 
   * @param isShow cho phép hiển thị không
   * @param isTopik là địa điểm của bài topik
   */
  const getTreeViewAccessData = async (isShow?: boolean, isTopik?: boolean): Promise<void> => {
    const response: ResponseData = await treeView(
      isTopik,
      isShow
    );
    if (response && response.code === Code._200) {
      setAccessData(response.data as DefaultOptionType[])
    }
  }
  useEffect(() => {
    getList(1);
    getTreeViewAccessData(true)
  }, []);

  const deleteRecord = (id: string) => {
    Modal.confirm({
      title: 'Cảnh báo',
      content: `Xác nhận xóa bản ghi này?`,
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      onOk: async () => {
        const response = await deleteRole(id);
        if (response.code === Code._200) {
          message.success(response.message || "Xóa thành công")
          getList(1)
        }
        else {
          message.error(response.message || "Zóa thất bại")
        }
      },
    });
  };

  // Data
  const [showModelDividingExamRoomVisible, setShowModelDividingExamRoomVisible] = useState<boolean>(false);
  const [showAccessDataForm, setShowAccessDataForm] = useState<boolean>(false);

  const onHandleShowModelCreate = async () => {
    setShowModelDividingExamRoomVisible(true);
  };

  const onHandleShowModelAccessData = async (roleEdit: RoleModel) => {
    setLoading(true)
    try {
      const response: ResponseData = await getRoleById(
        roleEdit.id as string
      );
      if (response && response.code === Code._200) {
        setRoleEdit(roleEdit)
        setShowAccessDataForm(true);
      }
      else {
        message.success(response.message)
      }
      setLoading(false)

    }
    catch (error: any) {
      message.success(error || "Thành công")
      console.log(error);
    }
  };


  // searchForm
  const [searchForm] = Form.useForm();
  const [exportForm] = Form.useForm();
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

    } catch (error: any) {
      console.log(error);
    }
  };


  const columns: ColumnsType<RoleModel> = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      render: (_, record, index) => <>{(pagination.current - 1) * pagination.pageSize + index + 1}</>,
    },
    {
      title: 'Mã vai trò',
      dataIndex: 'code',
      render: (_, record) => <span>{record.code}</span>,
    },
    {
      title: 'Tên vai trò',
      dataIndex: 'name',
      render: (_, record) => <span>{record.name}</span>,
    },
    {
      title: 'Mô tả vai trò',
      dataIndex: 'examPlaceName',
      render: (_, record) => <span>{record.description}</span>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdOnDate',
      render: (_, record) => <span>{dayjs(record?.createdOnDate).format('DD/MM/YYYY HH:mm')}</span>,
    },
    {
      title: 'Ngày sửa',
      dataIndex: 'lastModifiedOnDate',
      render: (_, record) => <span>{dayjs(record?.lastModifiedOnDate).format('DD/MM/YYYY HH:mm')}</span>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      fixed: 'right',
      width: 300,
      render: (_, record) => (
        <Space>
          <Permission navigation={layoutCode.role} bitPermission={PermissionAction.Edit} noNode={<></>}>
            <Button size={"small"} type='primary'
              loading={false}
              onClick={() => navigate(`/core/roles/view-role/${record.id}`)}>
              <Tooltip title="Phân quyền các phân hệ">
                <HddOutlined />
              </Tooltip>
            </Button>
          </Permission>
          <Permission navigation={layoutCode.role} bitPermission={PermissionAction.Edit} noNode={<></>}>
            <Button size={"small"} type='dashed'
              loading={loading}
              onClick={() => onHandleShowModelAccessData(record)}>
              <Tooltip title="Quyền truy cập dữ liệu">
                <ClusterOutlined />
              </Tooltip>
            </Button>
          </Permission>
          <Permission navigation={layoutCode.role} bitPermission={PermissionAction.Delete} noNode={<></>}>
            <Button type='dashed' size={"small"} disabled={record.isDefault} loading={false} onClick={() => deleteRecord(record.id || '')}>
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
        title={'Vai trò'}
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
            <Permission navigation={layoutCode.role} bitPermission={PermissionAction.Add} noNode={<></>}>
              <Button type='primary' icon={<PlusOutlined />} size={"middle"} onClick={() => onHandleShowModelCreate()}>
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
        <CreateRole
          open={showModelDividingExamRoomVisible}
          setOpen={setShowModelDividingExamRoomVisible}
          reload={searchFormSubmit}
        />
      )}

      {showAccessDataForm && (
        <AccessDataRole
          open={showAccessDataForm}
          setOpen={setShowAccessDataForm}
          reload={searchFormSubmit}
          roleEdit={roleEdit}
          accessData={accessData}
        />
      )}
    </div>
  );
}

export default Role;
