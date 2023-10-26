import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { message, UploadProps } from 'antd';
import { Button, Upload } from 'antd';
import { request as __request, useRequest, UseRequestOption } from '@/apis/core/request';
import { postUpload } from '@/apis/services/UploadService';
import { Code } from '@/apis';

interface InputFormProps {
  isOnlyExcel: boolean;
  onChange?: (value: string) => void;
}

const UploadFile: React.FC<InputFormProps> = (props) => {
  const { onChange, isOnlyExcel } = props;
  const props2: UploadProps = {
    maxCount: 1,
    action: '//jsonplaceholder.typicode.com/posts/',
    beforeUpload: async (file) => {
      const form = {
        FileDetails: file,
      };
      if (isOnlyExcel) {
        if (
          file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type == 'application/vnd.ms-excel'
        ) {
          const res = await postUpload(undefined, form);
          if (res.code != Code._200) {
            return res.message as string;
          }
          if (onChange) onChange(res.message as string);
          return res.message as string;
        } else {
          message.error(`${file.name} không phải định dạng file excel`);
          return Upload.LIST_IGNORE;
        }
      } else {
        const res = await postUpload(undefined, form);
        if (res.code != Code._200) {
          return res.message as string;
        }
        if (onChange) onChange(res.message as string);
        return res.message as string;
      }
    },
  };

  return (
    <>
      <Upload {...props2}>
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>
    </>
  );
};
export default UploadFile;
