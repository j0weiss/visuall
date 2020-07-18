<template>
  <div class="flex space-x-3">
    <section class="flex-auto bg-white rounded-lg shadow px-5 py-6 sm:px-6">
      <div id="chart" />
    </section>
    <section class="self-start bg-white rounded-lg shadow px-5 py-6 sm:px-6">
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
    </section>
  </div>
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
      dimensions: ['heart_rate']
    };
  },
  mounted () {
    this.showGraph();
  },
  methods: {
    handleDimensionSelection(event) {
      this.showGraph();
    },
    showGraph() {
      const records = this.fitData.activity.sessions[0].laps
        .map(lap => lap.records)
        .flat();

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

      const totalElapsedTime = this.fitData.activity.sessions[0].total_elapsed_time;

      Highcharts.chart('chart', {
        chart: {
          zoomType: 'x'
        },
        xAxis: {
          labels: {
            formatter: function() {
              if (totalElapsedTime < 3600) {
                return new Date(this.value * 1000).toISOString().substr(14, 5);
              } else {
                return new Date(this.value * 1000).toISOString().substr(11, 8);
              }
            }
          }
        },
        yAxis,
        series,
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
