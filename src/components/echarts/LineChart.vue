<script lang="ts" setup>
import type { LineSeriesOption } from 'echarts/charts'
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
  | LineSeriesOption
>
const props = withDefaults(
  defineProps<{
    data?: ChartData
  }>(),
  {
    data: (): ChartData => ({
      xData: ['1月', '2月', '3月', '4月'],
      yData: [
        [60, 55, 45, 50],
        [80, 75, 65, 70],
        [70, 65, 55, 60],
      ],
      lineColors: ['#2F80ED', '#FD995D', '#6BD096'],
    }),
  },
)
interface ChartData {
  xData: string[]
  yData: number[][]
  lineColors: string[]
}

const optionData = computed<EChartsOption>(() => {
  const { xData, yData, lineColors } = props.data

  return {
    tooltip: { trigger: 'axis' },
    legend: {
      top: 0,
      textStyle: { color: '#323232' },
      data: [
        { name: '游戏优良比', icon: 'circle' },
        { name: '视频优良比', icon: 'circle' },
        { name: 'TCP建立优良率', icon: 'circle' },
      ],
    },
    grid: { top: 44, left: 10, right: 0, bottom: 0, containLabel: true },
    xAxis: [
      {
        data: xData,
        nameTextStyle: { color: '#848A9C' },
        axisLine: { lineStyle: { type: 'dashed', color: '#E1E3E8' } },
        axisTick: { show: false },
        axisLabel: { color: '#848A9C' },
      },
    ],
    yAxis: [
      {
        name: '',
        nameTextStyle: { color: '#848A9C', padding: [0, 0, 0, -28] },
        splitLine: {
          show: true,
          lineStyle: { type: 'dashed', color: '#E1E3E8' },
        },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#848A9C',
          formatter: '{value}%',
        },
      },
    ],
    series: [
      {
        name: '游戏优良比',
        type: 'line',
        showSymbol: true,
        symbol: 'emptyCircle',
        symbolSize: 8,
        yAxisIndex: 0,
        itemStyle: { color: lineColors[0] ?? '#2F80ED' },
        smooth: true,
        data: yData[0],
      },
      {
        name: '视频优良比',
        type: 'line',
        showSymbol: true,
        symbol: 'emptyCircle',
        symbolSize: 8,
        yAxisIndex: 0,
        itemStyle: { color: lineColors[1] ?? '#FD995D' },
        smooth: true,
        data: yData[1],
      },
      {
        name: 'TCP建立优良率',
        type: 'line',
        showSymbol: true,
        symbol: 'emptyCircle',
        symbolSize: 8,
        yAxisIndex: 0,
        itemStyle: { color: lineColors[2] ?? '#6BD096' },
        smooth: true,
        data: yData[2],
      },
    ],
  }
})
</script>

<template>
  <v-chart :option="optionData" autoresize />
</template>

<style scoped>
</style>
