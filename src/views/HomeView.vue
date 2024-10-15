<script setup lang="ts">
import GraphD3 from '@/components/GraphD3.vue'

// TODO: This can be imported or fetched
//       The mapper can be removed then. This application should have no
//       knowledge of GoodWe. It should just be able to receive data in a certain format.
import goodweYearResponse from '@/assets/example-responses/goodwe-get-statistics-charts-year.json';
import goodweMonthResponse from '@/assets/example-responses/goodwe-get-statistics-charts-month.json';
import { mapGoodWeChartResponseToD3Chart } from '@/mappers/goodwe-response-to-d3-chart';
import { TimeFormat } from '@/models/D3/time-format.enum'

const mappedYearResponse = mapGoodWeChartResponseToD3Chart(goodweYearResponse);
// TODO: map the month response to the weeks in that month
const mappedMonthResponse = mapGoodWeChartResponseToD3Chart(goodweMonthResponse);
</script>

<template>
  <main>
    <GraphD3
      v-if="mappedYearResponse && mappedYearResponse.length > 0"
      :data="mappedYearResponse"
      deviceName="GoodWe omvormer"
      title="2024"
      :scalingStep="200"
      :timeFormatSpecifier="TimeFormat.YEAR"
    />
    <GraphD3
      v-if="mappedMonthResponse && mappedMonthResponse.length > 0"
      :data="mappedMonthResponse"
      deviceName="GoodWe omvormer"
      title="October"
      :scalingStep="10"
      :timeFormatSpecifier="TimeFormat.MONTH"
    />
  </main>
</template>

<style scoped>
</style>
