import { useEffect, useState } from 'react';
import { Button, Card, Col, Divider, Form, FormInstance, Input, message, Modal, Radio, Row, Space, Table } from 'antd';
import { ResponseData, PaginationConfig } from '@/utils/request';
import { UserModel } from '@/apis/models/UserModel';
import CreateForm from '@/components/User/CreateForm/CreateForm';
import UpdateForm from '@/components/User/UpdateForm/UpdateForm';
import { ColumnsType } from 'antd/lib/table';

import { TableRowSelection } from 'antd/lib/table/interface';
import {  deleteUser, getUser, postUser, putUser } from '@/apis/services/UserService';
import { Code } from '@/apis';

const searchFormItemLayout = {
  labelCol: { span: 3, offset: 0 },
};
const listKey: { id: string; key: string; value: string }[] = [
  {
    id: '1',
    value: 'jack',
    key: 'lucy1',
  },
  {
    id: '2',
    value: 'lucy',
    key: 'lucy',
  },
  {
    id: '3',
    value: 'disabled',
    key: 'yiminghe1',
  },
  {
    id: '4',
    value: 'Yiminghe',
    key: 'yiminghe',
  },
];
const listValue: { id: string; key: string; value: string }[] = [
  {
    id: '1',
    key: 'jack',
    value: 'Jack',
  },
  {
    id: '2',
    key: 'lucy',
    value: 'Lucy',
  },
  {
    id: '3',
    key: 'disabled',
    value: 'Disabled',
  },
  {
    id: '4',
    key: 'Yiminghe',
    value: 'yiminghe',
  },
];

var users: UserModel[] = [];
var checkedList: string[] = [];

function App() {
  // Load
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

    const response: ResponseData = await getUser();
    users = (response.data || []) as UserModel[];
    setList((response.data || []) as UserModel[]);
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
    const list = users.filter((item: UserModel) => {
      return (
        item.fullname?.includes(e.target.value) ||
        item.username?.includes(e.target.value) ||
        item.email?.includes(e.target.value)
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
        const res = await deleteUser(id);
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
        // setDeleteLoading(checkedList);
        // const res = await deleteManyUser(checkedList);
        // if (res.code == Code._200) {
        //   message.success('Thành công !');
        //   getList(pagination.current);
        //   setDeleteLoading([]);
        // } else {
        //   message.error(res.message);
        // }
      },
    });
  };

  // Data
  const [updateSubmitLoading, setUpdateSubmitLoading] = useState<boolean>(false);
  const [updateFormVisible, setUpdateFormVisible] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<Partial<UserModel>>({});
  const [detailUpdateLoading, setDetailUpdateLoading] = useState<string[]>([]);
  const detailUpdateData = async (id: string) => {
    setDetailUpdateLoading([id]);
    const data = users.find((item: UserModel) => item.id == id);
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

  const updateSubmit = async (values: UserModel) => {
    // setUpdateSubmitLoading(true);
    // const { id } = values;
    // const res = await putUser(id || '', values);
    // if (res.code == Code._200) {
    //   updataFormCancel();
    //   message.success('Thành công !');
    //   getList(pagination.current);
    // } else {
    //   message.error(res.message);
    // }

    setUpdateSubmitLoading(false);
  };

  // Save
  const [createSubmitLoading, setCreateSubmitLoading] = useState<boolean>(false);
  const [createFormVisible, setCreateFormVisible] = useState<boolean>(false);
  const createSubmit = async (values: Omit<UserModel, 'id'>, form: FormInstance) => {
    // setCreateSubmitLoading(true);
    // const res = await postUser(values);
    // if (res.code == Code._200) {
    //   form.resetFields();
    //   setCreateFormVisible(false);
    //   message.success('Thành công !');
    //   getList(1);
    // } else {
    //   message.error(res.message);
    // }

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

  const rowSelection: TableRowSelection<UserModel> = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: UserModel[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      checkedList = selectedRowKeys as string[];
    },
  };
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');

  const columns: ColumnsType<UserModel> = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      render: (_, record, index) => <>{(pagination.current - 1) * pagination.pageSize + index + 1}</>,
    },
    {
      title: 'Tên user',
      dataIndex: 'fullname',
      render: (_, record) => <span>{record.fullname}</span>,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      render: (_, record) => <span>{record.username}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (_, record) => <span>{record.email}</span>,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dob',
      render: (_, record) => <span></span>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <>
          <Button
            type='link'
            loading={detailUpdateLoading.includes(record.id || '')}
            onClick={() => detailUpdateData(record.id || '')}
          >
            Sửa
          </Button>
          <Divider type='vertical' />
          <Button
            type='link'
            loading={deleteLoading.includes(record.id || '')}
            onClick={() => deleteTableData(record.id || '')}
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
          rowKey='id'
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
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
        onSubmitLoading={createSubmitLoading}
        listKey={listKey}
        listValue={listValue}
      />

      {updateFormVisible && Object.keys(updateData).length > 0 ? (
        <UpdateForm
          values={updateData}
          onCancel={() => updataFormCancel()}
          visible={updateFormVisible}
          onSubmit={updateSubmit}
          onSubmitLoading={updateSubmitLoading}
        />
      ) : null}
    </div>
  );
}

export default App;
