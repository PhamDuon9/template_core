import useEcharts, { EChartsOption } from '@/hooks/useEcharts';
import React, { useRef, useState } from 'react';
import moment from 'moment';

interface Response {
  year: string,
  quantity: number
}

const linksChartOption: EChartsOption = {
  tooltip: {},
  title: {
    text: 'Thống kê lượt đăng ký theo năm',
    left: 'center'
  },
  grid: {
    left: 20
  },
  xAxis: {
    data: []
  },
  legend: {
    bottom: '0'
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      type: 'bar',
      itemStyle: {
        color: '#ff5c31'
      }
    }
  ]
};

const DateChart: React.FC = () => {
  const linksChartRef = useRef<HTMLDivElement>(null);
  useEcharts(linksChartRef, linksChartOption, async (chart) => {
    try {
      let now = moment().format('yyyy-MM-DD');
      let from = moment().set({ date: 1, month: 0 }).format('yyyy-MM-DD');
      // const response = await Statistic(from, now, 3);
      let data = [] as Response[];
      const option: EChartsOption = {
        xAxis: {
          data: data.map(item => item.year),
        },
        series: [
          {
            name: 'Lượt',
            data: data.map(item => item.quantity),
          },
        ],
      };
      chart.setOption(option);
    } catch (error: any) {
      console.log(error);
    }
  });

  return (
    <div style={{ height: '450px', width: '65%' }} ref={linksChartRef} />
  );
};

export default DateChart;
