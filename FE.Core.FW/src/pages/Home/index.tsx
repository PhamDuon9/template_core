import { Suspense, lazy, useCallback, useState } from 'react';
import { Col, Row } from 'antd';
// import Webcam from "react-webcam";
import PageLoading from '@/components/PageLoading';
import Camera from '@/components/Camera/Index';
import WebcamCapture from '@/components/Camera/Index';

const ArticleChartCard = lazy(() => import('@/components/ArticleChartCard'));
const WorksChartCard = lazy(() => import('@/components/WorksChartCard'));
const LinksChartCard = lazy(() => import('@/components/LinksChartCard'));

const HotSearchCard = lazy(() => import('@/components/HotSearchCard'));

const ChartColProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
};

const TableColProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 12,
  xl: 12,
};

function App() {
  return (
    <div className='layout-main-conent'>
      <Row gutter={24}>
        <Col {...ChartColProps}>
          <Suspense fallback={<PageLoading />}>
            <ArticleChartCard />
          </Suspense>
        </Col>
        <Col {...ChartColProps}>
          <Suspense fallback={<PageLoading />}>
            <WorksChartCard />
          </Suspense>
        </Col>
        <Col {...ChartColProps}>
          <Suspense fallback={<PageLoading />}>
            <LinksChartCard />
          </Suspense>
        </Col>
      </Row>
      {/* <WebcamCapture /> */}

    </div>
  );
}

export default App;
