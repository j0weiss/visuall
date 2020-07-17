<template>
  <section>
    <p>Sport: {{ fitData.sport.name }}</p>
    <p>Time: {{ fitData.activity['local_timestamp'] }}</p>
    <p>Duration: {{ fitData.activity['total_timer_time'] }}</p>
    <form class="flex flex-wrap space-x-2">
      <div>
        <input
          id="altitude"
          v-model="dimensions"
          type="checkbox"
          name="altitude"
          value="altitude"
          @change="handleDimensionSelection($event)">
        <label for="altitude">altitude</label>
        <input
          id="heart_rate"
          v-model="dimensions"
          type="checkbox"
          name="heart_rate"
          value="heart_rate"
          @change="handleDimensionSelection($event)">
        <label for="heart_rate">heart_rate</label>
        <input
          id="speed"
          v-model="dimensions"
          type="checkbox"
          name="speed"
          value="speed"
          @change="handleDimensionSelection($event)">
        <label for="speed">speed</label>
      </div>
    </form>
    <div id="chart" />
  </section>
</template>

<script>
import Highcharts from 'highcharts';

export default {
  name: 'FileViewer',
  props: {
    fitData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dimensions: []
    };
  },
  methods: {
    handleDimensionSelection(event) {
      this.showGraph();
    },
    showGraph() {
      const records = this.fitData.activity.sessions[0].laps[0].records;

      const series = this.dimensions.map((dimension, index) => {
        return {
          yAxis: index,
          name: dimension,
          data: records.map(record => [record.elapsed_time, record[dimension]])
        };
      });

      const yAxis = this.dimensions.map(dimension => {
        return {
          title: {
            text: dimension
          }
        };
      });

      Highcharts.chart('chart', {
        series,
        yAxis,
        credits: {
          enabled: false
        }
      });
    }
  }
};
</script>

<style scoped>

</style>
