<script setup lang="ts">
import type { BarSeriesOption, LineSeriesOption } from 'echarts/charts'
import type {
  GridComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
} from 'echarts/components'
import type { ComposeOption } from 'echarts/core'
import VChart from 'vue-echarts'

type EChartsOption = ComposeOption<
  | TooltipComponentOption
  | LegendComponentOption
  | GridComponentOption
  | BarSeriesOption
  | LineSeriesOption
>
const props = withDefaults(
  defineProps<{
    data?: ChartData
  }>(),
  {
    data: (): ChartData => ({
      xData: ['2023-01', '2023-02', '2023-03', '2023-04'],
      yData: [
        [120, 200, 150, 80],
        [60, 80, 70, 50],
        [50, 40, 46.7, 62.5],
      ],
      lineColors: ['#3D95F6', '#FD995D', '#FD995D'],
    }),
  },
)
interface ChartData {
  xData: string[]
  yData: number[][]
  lineColors: string[]
}

const option = computed<EChartsOption>(() => {
  const { xData, yData, lineColors } = props.data
  return {
    tooltip: { trigger: 'axis' },
    legend: {
      top: 0,
      textStyle: { color: '#323232' },
      data: [
        { name: '重点用户数', icon: 'circle' },
        { name: '质差用户数', icon: 'circle' },
        { name: '质差用户数占比' },
      ],
    },
    grid: { top: 50, left: 40, right: 0, bottom: 0, containLabel: true },
    xAxis: [{
      data: xData,
      nameTextStyle: { color: '#848A9C' },
      axisLine: { lineStyle: { type: 'dashed', color: '#E1E3E8' } },
      axisTick: { show: false },
      axisLabel: { color: '#848A9C' },
    }],
    yAxis: [
      {
        name: '单位/个',
        nameTextStyle: { color: '#848A9C', padding: [0, 0, 0, -28] },
        splitLine: { show: true, lineStyle: { type: 'dashed', color: '#E1E3E8' } },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#848A9C' },
      },
      {
        name: '',
        nameTextStyle: { color: '#848A9C' },
        splitLine: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#848A9C', formatter: '{value}%' },
      },
    ],
    series: [
      {
        name: '重点用户数',
        type: 'bar',
        data: yData[0],
        barWidth: 10,
        yAxisIndex: 0,
        itemStyle: { color: lineColors[0], borderRadius: [10, 10, 0, 0] },
      },
      {
        name: '质差用户数',
        type: 'bar',
        data: yData[1],
        barWidth: 10,
        yAxisIndex: 0,
        itemStyle: { color: lineColors[1], borderRadius: [10, 10, 0, 0] },
      },
      {
        name: '质差用户数占比',
        type: 'line',
        showSymbol: true,
        symbol: 'emptyCircle',
        symbolSize: 8,
        yAxisIndex: 1,
        itemStyle: { color: lineColors[2] },
        data: yData[2],
      },
    ],
  }
})
</script>

<template>
  <v-chart :option="option" autoresize />
</template>
