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
import Plotly from 'plotly.js-dist';

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
      dimensions: [],
      traces: [],
      layout: {}
    };
  },
  methods: {
    handleDimensionSelection(event) {
      this.layout = {};
      this.$nextTick(() => this.showGraph(this.dimensions));
    },
    showGraph(dimensions) {
      const records = this.fitData.activity.sessions[0].laps[0].records;
      const x = records.map(record => record.elapsed_time);

      dimensions.forEach((dimension, index) => {
        const config = {
          x,
          y: records.map(record => record[dimension]),
          type: 'scatter'
        };

        if (index > 0) {
          config.yaxis = `y${index + 1}`;
        }

        this.traces.push(config);
      });

      this.traces.forEach((trace, index) => {
        if (index === 0) {
          this.layout.yaxis = {
            title: dimensions[index],
            side: index % 2 === 0 ? 'left' : 'right'
          };
        } else {
          this.layout[`yaxis${index + 1}`] = {
            title: dimensions[index],
            overlaying: 'y',
            side: index % 2 === 0 ? 'left' : 'right'
          };
        }
      });

      Plotly.newPlot('chart', this.traces, this.layout);
    }
  }
};
</script>

<style scoped>

</style>
