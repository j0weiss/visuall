<template>
  <div
    id="app"
    class="h-screen bg-blue-grey-050">
    <div class="bg-blue-grey-800 pb-32">
      <nav class="bg-blue-grey-800">
        <div class="mx-auto sm:px-6 lg:px-8">
          <div
            class="border-b border-blue-grey-700
                   flex items-center justify-between h-16 px-4 sm:px-0">
            <div class="flex items-center">
              <div class="flex flex-shrink-0 items-center">
                <img
                  class="h-8 w-8"
                  src="https://tailwindui.com/img/logos/workflow-mark-on-dark.svg"
                  alt="Workflow logo">
                <span class="ml-5 text-2xl text-blue-grey-100">
                  visuall
                </span>
              </div>
            </div>
            <ul class="ml-10 flex items-baseline">
              <li v-if="fitData !== undefined">
                <button
                  class="ml-4 px-3 py-2 rounded-md
                         border border-blue-grey-300
                         text-sm font-medium text-blue-grey-300
                         hover:text-white"
                  @click="fitData = undefined">
                  View new file
                </button>
              </li>
              <li>
                <a
                  href="#"
                  class="ml-4 px-3 py-2 rounded-md
                         text-sm font-medium text-blue-grey-300
                         hover:text-white">
                  How to use
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="ml-4 px-3 py-2 rounded-md
                         text-sm font-medium text-blue-grey-300
                         hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/j0weiss/visuall"
                  class="ml-4 px-3 py-2 rounded-md
                         text-base font-medium text-blue-grey-300
                         hover:text-white">
                  <font-awesome-icon :icon="['fab', 'github']" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <header class="py-10">
        <div class="mx-auto px-4 sm:px-6 lg:px-8">
          <div
            v-if="fitData !== undefined"
            class="lg:flex lg:items-center lg:justify-between">
            <div class="flex-1 min-w-0">
              <h1 class="text-2xl font-bold leading-7 text-white sm:text-3xl sm:leading-9 sm:truncate">
                {{ getSport() }}
              </h1>
              <div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap">
                <div class="mt-2 flex items-center text-sm leading-5 text-blue-grey-300 sm:mr-6">
                  <font-awesome-icon
                    class="flex-shrink-0 mr-1.5 text-blue-grey-500"
                    size="lg"
                    :icon="['far', 'calendar-alt']" />
                  {{ fitData['activity']['timestamp'].toLocaleDateString() }}
                </div>
                <div class="mt-2 flex items-center text-sm leading-5 text-blue-grey-300 sm:mr-6">
                  <font-awesome-icon
                    class="flex-shrink-0 mr-1.5 text-blue-grey-500"
                    size="lg"
                    :icon="['far', 'clock']" />
                  {{ fitData['activity']['sessions'][0]['start_time'].toLocaleTimeString() }}
                </div>
                <div class="mt-2 flex items-center text-sm leading-5 text-blue-grey-300 sm:mr-6">
                  <font-awesome-icon
                    class="flex-shrink-0 mr-1.5 text-blue-grey-500"
                    size="lg"
                    icon="arrows-alt-h" />
                  {{ Math.round(fitData['activity']['sessions'][0]['total_distance'] * 10) / 10 + ' km' }}
                </div>
                <div class="mt-2 flex items-center text-sm leading-5 text-blue-grey-300 sm:mr-6">
                  <font-awesome-icon
                    class="flex-shrink-0 mr-1.5 text-blue-grey-500"
                    size="lg"
                    icon="stopwatch" />
                  {{ new Date(fitData['activity']['sessions'][0]['total_elapsed_time'] * 1000).toISOString().substr(11, 8) + ' h' }}
                </div>
                <div class="mt-2 flex items-center text-sm leading-5 text-blue-grey-300 sm:mr-6">
                  <font-awesome-icon
                    v-if="city === 'loading'"
                    class="flex-shrink-0 ml-8 text-blue-grey-500"
                    size="xs"
                    spin
                    icon="circle-notch" />
                  <template v-else-if="city !== ''">
                    <font-awesome-icon
                      class="flex-shrink-0 mr-1.5 text-blue-grey-500"
                      size="lg"
                      icon="map-marker-alt" />
                    {{ city }}
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>

    <main class="-mt-32">
      <div class="mx-auto pb-12 px-4 sm:px-6 lg:px-8">
        <!-- Replace with your content -->
        <FileUploader
          v-if="fitData === undefined"
          class="w-2/3 h-64"
          @file-uploaded="(file) => parseFile(file)" />
        <FileViewer
          v-else
          :fit-data="fitData"
          :selected-session="selectedSession"
        />
      </div>
      <div
        v-if="fitData !== undefined"
        class="session-lap-nav pb-4 px-4 sm:px-6 lg:px-8">
        <button
          v-if="numOfSessions > 1"
          type="button"
          class="border border-blue-grey-300 rounded-md
                 inline-flex justify-center items-center px-3 py-2
                 bg-white text-sm leading-4 font-medium text-blue-grey-700
                 hover:text-blue-grey-500
                 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue
                 active:text-blue-grey-800 active:bg-blue-grey-50
                 transition ease-in-out duration-150"
          @click="selectedSession = -1">
          All Sessions
        </button>
        <nav
          v-if="numOfSessions > 1"
          class="relative z-0 inline-flex">
          <a
            href="#"
            class="relative items-center inline-flex px-2 py-2
                   rounded-l-md border border-blue-grey-300
                   bg-white text-sm leading-5 font-medium text-blue-grey-500
                   hover:text-blue-grey-400
                   focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue
                   active:bg-blue-grey-100 active:text-blue-grey-500
                   transition ease-in-out duration-150"
            aria-label="Previous">
            <font-awesome-icon icon="angle-left" />
          </a>
          <a
            v-for="(session, index) of sessions"
            :key="`${session}-${index}`"
            href="#"
            class="-ml-px relative inline-flex items-center px-4 py-2
                   border border-blue-grey-300
                   bg-white text-sm leading-5 font-medium text-blue-grey-700
                   hover:text-blue-grey-500
                   focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue
                   active:bg-blue-grey-100 active:text-blue-grey-700
                   transition ease-in-out duration-150"
            @click="selectedSession = index">
            <font-awesome-icon
              v-if="session === 'transition'"
              class="text-blue-grey-400"
              icon="exchange-alt" />
            <template v-else>
              {{ session }}
            </template>
          </a>
          <a
            href="#"
            class="-ml-px relative items-center inline-flex px-2 py-2
                   rounded-r-md border border-blue-grey-300
                   bg-white text-sm leading-5 font-medium text-blue-grey-500
                   hover:text-blue-grey-400
                   focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue
                   active:bg-blue-grey-100 active:text-blue-grey-500
                   transition ease-in-out duration-150"
            aria-label="Next">
            <font-awesome-icon icon="angle-right" />
          </a>
        </nav>
        <button
          v-if="lapsPerSession[selectedSession] > 1"
          type="button"
          class="border border-blue-grey-300 rounded-md
                 inline-flex justify-center items-center px-3 py-2
                 bg-white text-sm leading-4 font-medium text-blue-grey-700
                 hover:text-blue-grey-500
                 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue
                 active:text-blue-grey-800 active:bg-blue-grey-50
                 transition ease-in-out duration-150">
          All Laps
        </button>
        <nav
          v-if="lapsPerSession[selectedSession] > 1"
          class="relative z-0 inline-flex">
          <a
            href="#"
            class="relative items-center inline-flex px-2 py-2
                   rounded-l-md border border-blue-grey-300
                   bg-white text-sm leading-5 font-medium text-blue-grey-500
                   hover:text-blue-grey-400
                   focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue
                   active:bg-blue-grey-100 active:text-blue-grey-500
                   transition ease-in-out duration-150"
            aria-label="Previous">
            <font-awesome-icon icon="angle-left" />
          </a>
          <a
            v-for="sessionIndex of lapsOfSelectedSession"
            :key="`lap-${sessionIndex}`"
            href="#"
            class="-ml-px relative inline-flex items-center px-4 py-2
                   border border-blue-grey-300
                   bg-white text-sm leading-5 font-medium text-blue-grey-700
                   hover:text-blue-grey-500
                   focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue
                   active:bg-blue-grey-100 active:text-blue-grey-700
                   transition ease-in-out duration-150">
            {{ sessionIndex }}
          </a>
          <a
            href="#"
            class="-ml-px relative items-center inline-flex px-2 py-2
                   rounded-r-md border border-blue-grey-300
                   bg-white text-sm leading-5 font-medium text-blue-grey-500
                   hover:text-blue-grey-400
                   focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue
                   active:bg-blue-grey-100 active:text-blue-grey-500
                   transition ease-in-out duration-150"
            aria-label="Next">
            <font-awesome-icon icon="angle-right" />
          </a>
        </nav>
      </div>
      <!-- /End replace -->
    </main>
  </div>
</template>

<script>
import FileUploader from '@/components/FileUploader.vue';
const FileViewer = () => import('@/components/FileViewer.vue');

export default {
  name: 'App',
  components: {
    FileUploader,
    FileViewer
  },
  data() {
    return {
      fitData: undefined,
      city: '',
      selectedSession: -1
    };
  },
  computed: {
    numOfSessions() {
      return this.fitData?.activity['num_sessions'];
    },
    sessions() {
      return this.fitData?.activity?.sessions?.map(session => session?.sport);
    },
    lapsPerSession() {
      return [...Array(this.numOfSessions).keys()]
        .map((_, index) => this.fitData?.activity?.sessions[index]['num_laps']);
    },
    lapsOfSelectedSession() {
      if (this.selectedSession !== -1) {
        const laps = [...Array(this.lapsPerSession[this.selectedSession] + 1).keys()];
        laps.shift();
        return laps;
      } else {
        return 0;
      }
    }
  },
  watch: {
    fitData() {
      this.getCity();
    }
  },
  methods: {
    async parseFile(file) {
      this.fitData = await this.$parseFitFile(file);
    },
    getSport() {
      return this.fitData?.sport?.name || 'Unknown Sport';
    },
    getCity() {
      const lat = this.fitData?.activity?.sessions[0]['start_position_lat'];
      const long = this.fitData?.activity?.sessions[0]['start_position_long'];
      this.city = 'loading';
      fetch(`https://geocode.xyz/${lat},${long}?geoit=json`)
        .then(response => response.json())
        .then(geoInfo => {
          this.city = geoInfo.city;
        })
        .catch(error => {
          console.error(error);
          this.city = '';
        });
    }
  }
};
</script>

<style>
  body {
    min-height: 100vh;
  }

  .session-lap-nav {
    display: grid;
    grid-template: auto auto / max-content auto;
    gap: 0.5rem;
  }
</style>
