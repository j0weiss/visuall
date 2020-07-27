<template>
  <div class="flex space-x-3">
    <section class="flex-auto bg-white rounded-lg shadow px-5 py-6 sm:px-6">
      <div id="chart" />
    </section>
    <section class="self-start bg-white rounded-lg shadow px-5 py-6 sm:px-6">
      <form class="flex flex-col space-y-2">
        <div
          v-for="record in records"
          :key="record">
          <label
            :for="record"
            class="flex items-center space-x-2 cursor-pointer">
            <input
              :id="record"
              v-model="dimensions"
              class="hidden"
              type="checkbox"
              :name="record"
              :value="record"
              @change="handleDimensionSelection($event)">
            <!-- On: "bg-indigo-600", Off: "bg-blue-grey-200" -->
            <span
              role="checkbox"
              tabindex="0"
              aria-checked="false"
              class="relative inline-flex flex-shrink-0 h-6 w-11
                     border-2 border-transparent rounded-full
                     transition-colors ease-in-out duration-200
                     focus:outline-none focus:shadow-outline"
              :class="[dimensions.indexOf(record) !== -1 ? 'bg-blue-600' : 'bg-blue-grey-200']">
              <!-- On: "translate-x-5", Off: "translate-x-0" -->
              <span
                aria-hidden="true"
                class="inline-block h-5 w-5
                       rounded-full bg-white shadow
                       transform transition ease-in-out duration-200"
                :class="[dimensions.indexOf(record) !== -1 ? 'translate-x-5' : 'translate-x-0']" />
            </span>
            <span>
              {{ $getRecordLabel(record) }}
            </span>
          </label>
        </div>
      </form>
    </section>
  </div>
</template>

<script>
import Highcharts from 'highcharts';
import sportRecords from '@/mappings/sportRecords.js';

export default {
  name: 'FileViewer',
  props: {
    fitData: {
      type: Object,
      required: true
    },
    selectedSession: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      dimensions: ['heart_rate'], // TODO: intelligent selection
      chartOptions: {}
    };
  },
  computed: {
    sessions() {
      return this.fitData?.activity['num_sessions'];
    },
    lapsPerSession() {
      return [...Array(this.sessions).keys()]
        .map((_, index) => this.fitData?.activity?.sessions[index]['num_laps']);
    },
    fitFileRecords() {
      return new Set(
        this.fitData?.activity?.sessions.map(session => {
          return session.laps.map(lap => Object.keys(lap.records[0])).flat();
        }).flat()
      );
    },
    records() {
      return sportRecords.running.filter(record => this.fitFileRecords.has(record));
    }
  },
  watch: {
    selectedSession() {
      this.showGraph();
    }
  },
  mounted() {
    this.showGraph();
  },
  methods: {
    handleDimensionSelection(event) {
      this.showGraph();
    },
    showGraph() {
      let records;
      if (this.selectedSession !== -1) {
        records = this.fitData?.activity?.sessions[this.selectedSession].laps
          .map(lap => lap.records)
          .flat();
      } else {
        records = this.fitData?.activity?.sessions
          .map(session => session.laps.map(lap => lap.records).flat())
          .flat();
      }

      const series = this.dimensions.map((dimension, index) => {
        return {
          yAxis: index,
          name: this.$getRecordLabel(dimension),
          data: records.map(record => [record.elapsed_time, record[dimension]])
        };
      });

      const totalElapsedTime = this.fitData?.activity['total_timer_time'];
      const xAxis = {
        labels: {
          formatter: function() {
            if (totalElapsedTime < 3600) {
              return new Date(this.value * 1000).toISOString().substr(14, 5);
            } else {
              return new Date(this.value * 1000).toISOString().substr(11, 8);
            }
          }
        },
        plotBands: this.getPlotBands()
      };

      const yAxis = this.dimensions.map(dimension => {
        return {
          title: {
            text: this.$getRecordLabel(dimension)
          }
        };
      });

      const chartOptions = {
        chart: {
          zoomType: 'x'
        },
        xAxis,
        yAxis,
        series,
        credits: {
          enabled: false
        }
      };
      this.chartOptions = chartOptions;

      Highcharts.chart('chart', chartOptions);
    },
    getPlotBands() {
      if (this.selectedSession === -1) {
        return null;
      } else if (this.lapsPerSession[this.selectedSession] > 1) {
        return this.fitData?.activity?.sessions[this.selectedSession].laps.map((lap, index) => {
          return {
            color: index % 2 === 0 ? '#BEF8FD' : '#FFFFFF',
            from: lap.records[0].elapsed_time,
            to: lap.records[lap.records.length - 1].elapsed_time
          };
        });
      } else {
        return null;
      }
    }
  }
};
</script>

<style>
  .highcharts-legend-item-hidden {
    visibility: hidden !important;
  }
</style>
