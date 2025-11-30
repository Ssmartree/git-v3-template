<script lang="ts" setup>
const lineChartData = {
  xData: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  yData: [
    [60, 55, 45, 50, 40, 35, 60, 65, 70, 75, 70, 65],
    [80, 75, 65, 70, 60, 55, 80, 85, 90, 95, 90, 85],
    [70, 65, 55, 60, 50, 45, 70, 75, 80, 85, 80, 75],

  ],
  name: '游戏优良比',
  lineColors: ['#2F80ED', '#FD995D', '#6BD096'],
}

// const lineColors = ['#2F80ED', '#FD995D', '#6BD096']
</script>

<template>
  <div class="mt-20 flex items-center justify-start">
    <line-chart class="h-200 w-400"></line-chart>
    <line-chart class="h-200 w-400" :data="lineChartData"></line-chart>
    <line-and-bar class="h-200 w-400" :line-chart-data="{ xData: ['1', '2', '3', '4'], yData: [10, 20, 30, 40], name: '折线图' }" :line-colors="['#5cd471', '#f5a623', '#ff6b81', '#9012fe']" title="折线图示例"></line-and-bar>
  </div>
</template>
