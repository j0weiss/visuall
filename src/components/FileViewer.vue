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
import { select } from 'd3-selection';
import { axisLeft, axisBottom } from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { max, extent } from 'd3-array';
import { line } from 'd3-shape';
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
      chartOptions: {},
      svg: null,
      width: 400,
      height: 100,
      margin: { top: 20, right: 30, bottom: 30, left: 40 }
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
    this.initGraph();
    this.showGraph();
  },
  methods: {
    handleDimensionSelection(event) {
      this.showGraph();
    },
    initGraph() {
      this.svg = select('#chart').append('svg')
        .attr('viewBox', [0, 0, this.width, this.height]);
      this.svg.append('g')
        .attr('class', 'x-axis');
      this.svg.append('g')
        .attr('class', 'y-axis');
      this.svg.append('g')
        .attr('class', 'lines');
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

      const data = this.dimensions
        .map(dimension => {
          return {
            name: dimension,
            values: records.map(record => record[dimension])
          };
        });

      const x = scaleLinear()
        .domain(extent(records.map(record => record.elapsed_time)))
        .range([this.margin.left, this.width - this.margin.right]);

      const y = scaleLinear()
        .domain([0, max(data, d => max(d.values))]).nice()
        .range([this.height - this.margin.bottom, this.margin.top]);

      const xAxis = g => g
        .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
        .call(axisBottom(x));

      const yAxis = g => g
        .attr('transform', `translate(${this.margin.left},0)`)
        .call(axisLeft(y));

      const lineGraph = line()
        .defined(d => !isNaN(d.value))
        .x(d => x(d.timepoint))
        .y(d => y(d.value));

      this.svg.select('g.x-axis')
        .call(xAxis);

      this.svg.select('g.y-axis')
        .call(yAxis);

      this.svg.selectAll('g.lines path.line')
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 0.5)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .data(data)
        .join('path')
        .style('mix-blend-mode', 'multiply')
        .attr('d', d => lineGraph(d.values));
    }
  }
};
</script>
