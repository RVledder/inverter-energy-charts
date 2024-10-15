<script setup lang="ts">
import GraphD3 from '@/components/GraphD3.vue';

// TODO: This can be imported or fetched
//       The mapper can be removed then. This application should have no
//       knowledge of GoodWe. It should just be able to receive data in a certain format.
import goodweResponse from '@/assets/example-responses/goodwe-get-statistics-charts-year.json';
import { mapGoodWeResponseToD3Chart } from '@/mappers/goodwe-response-to-d3-chart';

const mappedResponse = mapGoodWeResponseToD3Chart(goodweResponse);
</script>

<template>
  <main>
    <div class="container">
      <div class="max-width">
        <div class="header">
          <h1 class="page-title">2024</h1>
        </div>
      </div>
    </div>
    <GraphD3 v-if="mappedResponse && mappedResponse.length > 0" :data="mappedResponse" title="GoodWe omvormer" />
  </main>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}
.max-width {
  width: 640px;
  max-width: 1024px;
}
.header {
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 2rem;
}
.page-title {
  font-size: 1.8rem;
  font-weight: bold;
}
</style>
