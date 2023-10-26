import { useEffect, useState } from 'react';
import { Button, Card, Col, Divider, Form, FormInstance, Input, message, Modal, Space, Table } from 'antd';
import { ResponseData, PaginationConfig } from '@/utils/request';
import { NavigationModel, NavigationModelCustom } from '@/apis/models/NavigationModel';
import CreateForm from '@/components/Navigations/CreateForm/CreateForm';
import UpdateForm from '@/components/Navigations/UpdateForm/UpdateForm';
import { ColumnsType } from 'antd/lib/table';
import {
  deleteManyNavigation,
  deleteNavigation,
  getNavigation,
  postNavigation,
  putNavigation,
} from '@/apis/services/NavigationService';
import { TableRowSelection } from 'antd/lib/table/interface';
import { findItem, mapRouter } from '@/utils/router';
import { Code } from '@/apis';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

var navs: NavigationModelCustom[] = [];
var checkedList: string[] = [];

function App() {
  // Load
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<NavigationModelCustom[]>([]);
  const [pagination, setPagination] = useState<PaginationConfig>({
    total: 0,
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
  });
  const getList = async (current: number, pageSize: number = 10): Promise<void> => {
    setLoading(true);

    const response: ResponseData = await getNavigation();
    navs = (mapRouter(response.data as NavigationModelCustom[]) || []) as NavigationModelCustom[];
    setList((navs || []) as NavigationModelCustom[]);
    setPagination({
      ...pagination,
      current,
      total: response.totalCount || 0,
      pageSize: pageSize,
    });

    setLoading(false);
  };
  useEffect(() => {
    getList(1);
  }, []);
  const [search, setSearch]: [string, (search: string) => void] = useState('');

  const handleChange = (e: { target: { value: string } }) => {
    setSearch(e.target.value);
    const list = navs.filter((item: NavigationModelCustom) => {
      return (
        item.name?.includes(e.target.value) ||
        item.url?.includes(e.target.value) ||
        item.componentPath?.includes(e.target.value) ||
        item.resource?.includes(e.target.value)
      );
    });
    setList(list);
  };
  const [deleteLoading, setDeleteLoading] = useState<string[]>([]);
  const deleteTableData = (id: string) => {
    Modal.confirm({
      title: 'Cảnh báo',
      content: 'Bạn có chắc chắn muốn xóa ?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: async () => {
        setDeleteLoading([id]);
        const res = await deleteNavigation(id);
        if (res.code == Code._200) {
          message.success('Thành công !');
          getList(pagination.current);
          setDeleteLoading([]);
        } else {
          message.error(res.message);
        }
      },
    });
  };

  const deleteSelectTableData = () => {
    Modal.confirm({
      title: 'Cảnh báo',
      content: 'Bạn có chắc chắn muốn xóa ?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: async () => {
        setDeleteLoading(checkedList);
        const res = await deleteManyNavigation(undefined, checkedList);
        if (res.code == Code._200) {
          message.success('Thành công !');
          getList(pagination.current);
          setDeleteLoading([]);
        }
      },
    });
  };

  // Data
  const [updateSubmitLoading, setUpdateSubmitLoading] = useState<boolean>(false);
  const [updateFormVisible, setUpdateFormVisible] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<Partial<NavigationModelCustom>>({});
  const [detailUpdateLoading, setDetailUpdateLoading] = useState<string[]>([]);
  const detailUpdateData = async (id: string) => {
    setDetailUpdateLoading([id]);
    const data = findItem(navs, id) as NavigationModelCustom;
    setUpdateData({
      ...data,
    });
    setUpdateFormVisible(true);
    setDetailUpdateLoading([]);
  };

  const updataFormCancel = async () => {
    setUpdateData({});
    setUpdateFormVisible(false);
  };

  const updateSubmit = async (values: NavigationModel) => {
    setUpdateSubmitLoading(true);
    const { id } = values;
    const res = await putNavigation(id || '', undefined, values);
    if (res.code == Code._200) {
      updataFormCancel();
      message.success('Thành công !');
      getList(pagination.current);
    } else {
      message.error(res.message);
    }
    setUpdateSubmitLoading(false);
  };

  // Save
  const [createSubmitLoading, setCreateSubmitLoading] = useState<boolean>(false);
  const [createFormVisible, setCreateFormVisible] = useState<boolean>(false);
  const createSubmit = async (values: Omit<NavigationModelCustom, 'id'>, form: FormInstance) => {
    setCreateSubmitLoading(true);
    const res = await postNavigation(undefined, values);
    if (res.code == Code._200) {
      form.resetFields();
      message.success('Thành công !');
      setCreateFormVisible(false);
      getList(1);
    } else {
      message.error(res.message);
    }
    setCreateSubmitLoading(false);
  };

  // searchForm
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchForm] = Form.useForm();
  const searchFormSubmit = async () => {
    try {
      // const fieldsValue = await searchForm.validateFields();
      // console.log('search', fieldsValue);
      message.warning('Tìm kiếm!');
    } catch (error: any) {
      console.log(error);
    }
  };

  // rowSelection objects indicates the need for row selection
  const rowSelection: TableRowSelection<NavigationModelCustom> = {
    onChange: (selectedRowKeys, selectedRows) => {
      checkedList = selectedRowKeys as string[];
    },
  };
  const [checkStrictly, setCheckStrictly] = useState(false);
  const columns: ColumnsType<NavigationModelCustom> = [
    {
      title: '',
      dataIndex: 'index',
      width: 80,
    },
    {
      title: 'Tên hiển thị',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => <span>{record.name}</span>,
    },
    {
      title: 'Đường dẫn',
      dataIndex: 'url',
      key: 'url',
      width: '12%',
      render: (_, record) => <span>{record.url}</span>,
    },
    {
      title: 'Hiển thị',
      dataIndex: 'isShow',
      key: 'isShow',
      render: (_, record) => <span>{record.isShow ? <CheckOutlined /> : <CloseOutlined />}</span>,
    },
    {
      title: 'Resource',
      dataIndex: 'resource',
      key: 'resource',
      width: '12%',
      render: (_, record) => <span>{record.resource}</span>,
    },
    {
      title: 'Component Path',
      dataIndex: 'componentPath',
      width: '30%',
      key: 'componentPath',
      render: (_, record) => <span>{record.componentPath}</span>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <>
          <Button
            type='link'
            loading={detailUpdateLoading.includes(record.key as string)}
            onClick={() => detailUpdateData(record.key as string)}
          >
            Sửa
          </Button>
          <Divider type='vertical' />
          <Button
            type='link'
            loading={deleteLoading.includes(record.key || '')}
            onClick={() => deleteTableData(record.key || '')}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className='layout-main-conent'>
      <Card
        bordered={false}
        title={
          <Space>
            <Button type='primary' onClick={() => setCreateFormVisible(true)}>
              Thêm mới
            </Button>
            <Button type='primary' danger onClick={() => deleteSelectTableData()}>
              Xóa
            </Button>
          </Space>
        }
        extra={
          <div>
            <Input.Search
              placeholder='Tìm kiếm'
              style={{ width: '270px', marginLeft: '16px' }}
              onChange={handleChange}
            />
          </div>
        }
      >
        <Table
          rowSelection={{ ...rowSelection, checkStrictly }}
          columns={columns}
          dataSource={list}
          loading={loading}
          pagination={{
            ...pagination,
            onChange: (page: number, pageSize: number) => {
              getList(page, pageSize);
            },
          }}
        />
      </Card>

      <CreateForm
        onCancel={() => setCreateFormVisible(false)}
        visible={createFormVisible}
        onSubmit={createSubmit}
        list={navs}
        onSubmitLoading={createSubmitLoading}
      />

      {updateFormVisible && Object.keys(updateData).length > 0 ? (
        <UpdateForm
          values={updateData}
          onCancel={() => updataFormCancel()}
          visible={updateFormVisible}
          onSubmit={updateSubmit}
          list={navs}
          onSubmitLoading={updateSubmitLoading}
        />
      ) : null}
    </div>
  );
}

export default App;
