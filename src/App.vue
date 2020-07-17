<template>
  <div
    id="app"
    class="min-h-screen bg-blue-grey-050">
    <header class="bg-blue-700 flex justify-center">
      <h1 class="p-2 text-white text-3xl">
        VISUALL
      </h1>
    </header>
    <main class="p-4 flex justify-center items-center">
      <form
        v-if="fitData === undefined"
        id="dropzone"
        class="p-1 bg-white rounded border border-blue-grey-200"
        @dropenter.prevent.stop
        @dragover.prevent.stop="$event.dataTransfer.dropEffect = 'move'"
        @drop.prevent.stop="loadFile($event)">
        <div class="rounded border-dashed border-2 border-blue-grey-400">
          <p>
            Get started by uploading your workout file
          </p>
          <input
            type="file"
            accept=".fit"
            @change="loadFile($event)">
        </div>
      </form>
      <section v-else>
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
    </main>
    <footer class="p-1 flex justify-center">
      Footer
    </footer>
  </div>
</template>

<script>
import * as fitFileParser from 'fit-file-parser';
import Plotly from 'plotly.js-dist';

export default {
  name: 'App',
  data() {
    return {
      fitData: undefined,
      dimensions: [],
      traces: [],
      layout: {}
    };
  },
  methods: {
    loadFile(event) {
      const files = event.type === 'drop'
        ? event.dataTransfer.files
        : event.target.files;

      if (files.length > 1) {
        // TODO: do error handling
        console.error('Only one file');
      } else {
        this.parseFile(files[0]);
      }
    },
    parseFile(file) {
      // TODO: handle this import correctly
      // eslint-disable-next-line new-cap
      const fitParser = new fitFileParser.default({
        force: true,
        speedUnit: 'km/h',
        lengthUnit: 'km',
        temperatureUnit: 'kelvin',
        elapsedRecordField: true,
        mode: 'cascade'
      });

      file.arrayBuffer()
        .then(content => {
          fitParser.parse(content, (error, data) => {
            if (error) {
              console.error(error);
            } else {
              this.fitData = data;
            }
          });
        });
    },
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

<style>
  body {
    min-height: 100vh;
  }

  #app {
    display: grid;
    grid-template:
      'header' auto
      'main' 1fr
      'footer' auto;
  }

  header {
    grid-area: header;
  }

  aside {
    grid-area: aside;
  }

  main {
    grid-area: main;
  }

  footer {
    grid-area: footer;
  }
</style>
