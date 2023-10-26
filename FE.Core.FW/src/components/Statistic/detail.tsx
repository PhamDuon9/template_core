import { PaginationConfig } from '@/utils/request';
import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React, { useState, useEffect } from 'react';

interface Response {
  name: string,
  date: string,
  value: number,
}

const Detail: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Response[]>([]);
  const [pagination, setPagination] = useState<PaginationConfig>({
    total: 0,
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: false,
  });

  useEffect(() => {
    let dateFormat = 'yyyy-MM-DD';
    // StatisticDetail(moment().set({ date: 1, month: 0 }).format(dateFormat), moment().format(dateFormat)).then((response: any) => setData(response.data as Response[]));
  }, []);

  const columns: ColumnsType<Response> = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      ellipsis: true,
      render: (_, record, index) => <>{(pagination.current - 1) * pagination.pageSize + index + 1}</>
    },
    {
      title: 'Địa điểm',
      dataIndex: 'name',
    },
    {
      title: 'Ngày tiếp nhận hồ sơ',
      dataIndex: 'dateString',
    },
    {
      title: 'Số lượng',
      dataIndex: 'value',
    },
  ];

  return (
    <Table
      rowKey='id'
      columns={columns}
      dataSource={data.filter(item => item.value > 0)}
      loading={loading}
      pagination={{
        ...pagination,
        onChange: (page: number, pageSize: number) => {
          setPagination({ ...pagination, current: page, pageSize: pageSize });
        },
        showTotal: (total: number) => `Total ${total} items`
      }}
    />
  );
};

export default Detail;
