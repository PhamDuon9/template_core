import React, { useState } from 'react';
import { Button, Divider, Input, Popconfirm, Table, message, Select } from 'antd';

export interface TableFormDataType {
  key: string;
  name?: string;
  value?: string;
  edit?: boolean;
  isNew?: boolean;
}

interface TableFormProps {
  value?: TableFormDataType[];
  onChange?: (value: TableFormDataType[]) => void;
}
interface Key {
  id: string;
  key: string;
  value: string;
}
const listKey: Key[] = [
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
const listKeyAfter: Key[] = [
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
  {
    id: '11',
    value: '1111',
    key: 'luc111y1',
  },
  {
    id: '21',
    value: 'l111ucy',
    key: 'luc111y',
  },
  {
    id: '31',
    value: '1111233',
    key: 'yimin1231ghe1',
  },
  {
    id: '41',
    value: 'Yimi123123nghe',
    key: 'yimin123123ghe',
  },
];
const TableForm: React.FC<TableFormProps> = (props) => {
  const { value, onChange } = props;

  const [index, setIndex] = useState<number>(0);
  const [cacheOriginData, setCacheOriginData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<TableFormDataType[] | undefined>(value);

  const getRowByKey = (key: string, newData?: TableFormDataType[]) =>
    (newData || data)?.filter((item) => item.key === key)[0];

  const toggleEditable = (e: React.MouseEvent | React.KeyboardEvent, key: string) => {
    e.preventDefault();
    const newData = data?.map((item) => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (target) {
      // Save data
      if (!target.edit) {
        cacheOriginData[key] = { ...target };
        setCacheOriginData(cacheOriginData);
      }
      target.edit = !target.edit;
      setData(newData);
    }
  };

  const newTableData = () => {
    const newData = data?.map((item) => ({ ...item })) || [];

    newData.push({
      key: `NEW_TEMP_ID_${index}`,
      value: '',
      name: '',
      edit: true,
      isNew: true,
    });

    setIndex(index + 1);
    setData(newData);
  };
  const [listVaky, setListVaky] = useState<Key[]>([]);
  const [inputHidden, setInputHidden] = useState<boolean>(true);
  const selectKey = (value: string, fieldName: string, key: string) => {
    setListVaky(listKeyAfter);
    const newData = [...(data as TableFormDataType[])];
    const target = getRowByKey(key, newData) || ({} as any);
    if (target) {
      target[fieldName] = value;
      setData(newData);
    }
  };
  const remove = (key: string) => {
    const newData = data?.filter((item) => item.key !== key) as TableFormDataType[];
    setData(newData);
    if (onChange) {
      onChange(newData);
    }
  };

  const saveRow = (e: React.MouseEvent | React.KeyboardEvent, key: string) => {
    e.persist();
    setLoading(true);

    const target = getRowByKey(key) || ({} as any);
    if (!target.value || !target.name) {
      message.error('Vui lòng điền thông tin đầy đủ !');
      (e.target as HTMLInputElement).focus();
      setLoading(false);
      return;
    }
    delete target.isNew;
    toggleEditable(e, key);
    if (onChange) {
      onChange(data as TableFormDataType[]);
    }
    setLoading(false);
  };

  const cancel = (e: React.MouseEvent, key: string) => {
    setLoading(true);
    e.preventDefault();
    const newData = [...(data as TableFormDataType[])];
    // default data
    let cacheData = [];
    cacheData = newData.map((item) => {
      if (item.key === key) {
        if (cacheOriginData[key]) {
          const originItem = {
            ...item,
            ...cacheOriginData[key],
            edit: false,
          };
          delete cacheOriginData[key];
          setCacheOriginData(cacheOriginData);
          return originItem;
        }
      }
      return item;
    });
    setData(cacheData);
    setLoading(false);
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, key: string) => {
    const newData = [...(data as TableFormDataType[])];
    const target = getRowByKey(key, newData) || ({} as any);
    if (target) {
      target[fieldName] = e.target.value;
      setData(newData);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, key: string) => {
    if (e.key === 'Enter') {
      saveRow(e, key);
    }
  };

  const columns = [
    {
      title: 'Key',
      dataIndex: 'name',
      key: 'name',
      width: '35%',
      render: (text: string, record: TableFormDataType) => {
        if (record.edit) {
          return (
            <div>
              <Select value={text} options={listKey} onChange={(e) => selectKey(e, 'name', record.key)}></Select>
              <Input
                hidden={true}
                value={text}
              />
            </div>
          );
        }
        return text;
      },
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      width: '35%',
      render: (text: string, record: TableFormDataType) => {
        if (record.edit) {
          return (
            <div>
              <Select value={text} options={listVaky} onChange={(e) => selectKey(e, 'value', record.key)}></Select>
              <Input
                hidden={true}
                value={text}
              />
            </div>
          );
        }
        return text;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text: string, record: TableFormDataType) => {
        if (!!record.edit && loading) {
          return null;
        }
        if (record.edit) {
          if (record.isNew) {
            return (
              <span>
                <a onClick={(e) => saveRow(e, record.key)}>Thêm</a>
                <Divider type='vertical' />
                <Popconfirm title='Bạn có chắc chắn muốn xóa ?' onConfirm={() => remove(record.key)}>
                  <a>Xóa</a>
                </Popconfirm>
              </span>
            );
          }
          return (
            <span>
              <a onClick={(e) => saveRow(e, record.key)}>Thêm</a>
              <Divider type='vertical' />
              <a onClick={(e) => cancel(e, record.key)}>Hủy</a>
            </span>
          );
        }
        return (
          <span>
            <a onClick={(e) => toggleEditable(e, record.key)}>Sửa</a>
            <Divider type='vertical' />
            <Popconfirm title='Bạn có chắc chắn muốn xóa ?' onConfirm={() => remove(record.key)}>
              <a>Xóa</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  return (
    <>
      <Table<TableFormDataType> loading={loading} columns={columns} dataSource={data} pagination={false} />
      <Button style={{ width: '100%', marginTop: 16, marginBottom: 8 }} type='dashed' onClick={newTableData}>
        Thêm dòng mới
      </Button>
    </>
  );
};

export default TableForm;
