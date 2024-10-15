<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as d3 from 'd3'
import type { BackDeliveryChartData } from '@/models/D3/back-delivery-chart-data'
import IconUpwardArrow from '@/components/icons/IconUpwardArrow.vue'
import IconSun from '@/components/icons/IconSun.vue'

const props = defineProps<{
  title: string
  data: BackDeliveryChartData
}>()

const svgRef = ref<HTMLDivElement | null>(null);
const productionTotal = ref<number | null>(0);

productionTotal.value = Math.ceil(props.data.reduce((acc, d) => acc + d.value, 0));

const width = 640
const height = 250
const marginTop = 20
const marginRight = 50
const marginBottom = 30
const marginLeft = 0

const allMonths = d3.range(0, 12).map(m => new Date(2023, m, 1))
const yMax = Math.ceil(d3.max(props.data, d => d.value)! / 200) * 200

const x = d3
  .scaleBand()
  .domain(allMonths.map(d => d3.timeFormat('%b')(d)))
  .range([marginLeft, width - marginRight])
  .padding(0.7);

const y = d3
  .scaleLinear()
  .domain([0, yMax] as [number, number])
  .nice()
  .range([height - marginBottom, marginTop])

const svg = d3.create('svg').attr('width', width).attr('height', height)

/**
 * Axis
 */

const xTicks = d3
  .axisBottom(x)
  .tickFormat((d: string) => d[0])
  .tickSize(0)
  .tickPadding(16)
  .tickSizeOuter(0)

svg
  .append('g')
  .attr('class', 'axis')
  .attr('transform', `translate(0,${height - marginBottom})`)
  .call(xTicks);

const yTicks =
  d3
    .axisRight(y)
    .ticks(yMax / 200 + 1)
    .tickFormat(d => d.toString())

const yGridLines =
  d3
    .axisRight(y)
    .ticks(yMax / 200 + 1)
    .tickSize(-width + marginLeft + marginRight)
    .tickPadding(10);

const yRemoveVerticalLine =
  g => g.select(".domain").remove()

const moveTickTextUp =
  g => { g.selectAll(".tick text").attr("dy", "0") }

svg
  .append('g')
  .attr('class', 'axis')
  .attr('transform', `translate(${width - marginRight}, 0)`)
  .call(yTicks)
  .call(yGridLines)
  .call(yRemoveVerticalLine)
  .call(moveTickTextUp);

/**
 * Bars
 */

const gradient = svg
  .append('defs')
  .append('linearGradient')
  .attr('id', 'barGradient')
  .attr('x1', '0%')
  .attr('y1', '0%')
  .attr('x2', '0%')
  .attr('y2', '100%')

gradient
  .append('stop')
  .attr('offset', '0%')
  .attr('stop-color', 'var(--color-back-delivery-light)')

gradient
  .append('stop')
  .attr('offset', '100%')
  .attr('stop-color', 'var(--color-back-delivery-dark)')

svg
  .selectAll('rect')
  .data(props.data)
  .join('rect')
  .attr('x', d => x(d3.timeFormat('%b')(d.date)) || 0)
  .attr('y', d => y(d.value))
  .attr('width', x.bandwidth())
  .attr('height', d => height - marginBottom - y(d.value))
  .attr('fill', 'url(#barGradient)')
  .attr('stroke', 'var(--color-back-delivery-light)')
  .attr('stroke-width', 1);

onMounted(() => {
  if (!svgRef.value) return;
  svgRef.value.appendChild(svg.node()!)
})
</script>

<template>
  <div class="container">
    <div class="card">
      <div class="header-graph">
        <div>
          <p class="total">
            <span class="total-icon"><IconUpwardArrow /></span>
            <span>{{ productionTotal }} kWh</span>
          </p>
          <p class="converter-name">{{ title }}</p>
        </div>
        <div class="sun-icon">
          <IconSun />
        </div>
      </div>
      <div ref="svgRef" id="svg-ref" />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;

}
.card {
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid var(--ig-c-divider-dark-1);
}
.header-graph {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.total {
  font-size: 1.8rem;
  color: var(--color-back-delivery-light);
}
.total-icon {
  margin-right: .125rem;
  stroke: var(--color-back-delivery-light);
}
.converter-name {
  color: var(--ig-c-white);
  font-weight: bold;
}
.sun-icon {
  height: 32px;
  width: 32px;
  display: flex;
  stroke: var(--ig-c-white);

  svg {
    width: 100%;
    height: 100%;
  }
}
</style>
