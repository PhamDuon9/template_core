import { memo, useEffect } from 'react';
import { ConfigProvider } from 'antd';
import Routes from '@/config/routes';
import { createIntl } from '@ant-design/pro-components';
import enUS from 'antd/es/calendar/locale/en_US';
import viIntl from 'antd/lib/locale/vi_VN';
const enUSIntl = createIntl('en_US', viIntl);
const enLocale = {
  tableForm: {
    search: 'Query',
    reset: 'Reset',
    submit: 'Submit',
    collapsed: 'Expand',
    expand: 'Collapse',
    inputPlaceholder: 'Please enter',
    selectPlaceholder: 'Please select',
  },
  alert: {
    clear: 'Clear',
  },
  tableToolBar: {
    leftPin: 'Pin to left',
    rightPin: 'Pin to right',
    noPin: 'Unpinned',
    leftFixedTitle: 'Fixed the left',
    rightFixedTitle: 'Fixed the right',
    noFixedTitle: 'Not Fixed',
    reset: 'Reset',
    columnDisplay: 'Column Display',
    columnSetting: 'Settings',
    fullScreen: 'Full Screen',
    exitFullScreen: 'Exit Full Screen',
    reload: 'Refresh',
    density: 'Density',
    densityDefault: 'Default',
    densityLarger: 'Larger',
    densityMiddle: 'Middle',
    densitySmall: 'Compact',
  },
};
export default memo(() => {

  return (
    <ConfigProvider
    locale={viIntl}
    >
      <Routes />
    </ConfigProvider>
  );
});
