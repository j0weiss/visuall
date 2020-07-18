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
          <h1
            v-if="fitData === undefined"
            class="text-3xl leading-9 font-bold text-white">
            Dashboard
          </h1>
          <div
            v-else
            class="lg:flex lg:items-center lg:justify-between">
            <div class="flex-1 min-w-0">
              <h1 class="text-2xl font-bold leading-7 text-white sm:text-3xl sm:leading-9 sm:truncate">
                {{ fitData.sport.name }}
              </h1>
              <div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap">
                <div class="mt-2 flex items-center text-sm leading-5 text-blue-grey-300 sm:mr-6">
                  <font-awesome-icon
                    class="flex-shrink-0 mr-1.5 text-blue-grey-500"
                    size="lg"
                    :icon="['far', 'calendar-alt']" />
                  {{ fitData.activity['local_timestamp'].toLocaleDateString() }}
                </div>
                <div class="mt-2 flex items-center text-sm leading-5 text-blue-grey-300 sm:mr-6">
                  <font-awesome-icon
                    class="flex-shrink-0 mr-1.5 text-blue-grey-500"
                    size="lg"
                    :icon="['far', 'clock']" />
                  {{ fitData.activity['local_timestamp'].toLocaleTimeString() }}
                </div>
                <div class="mt-2 flex items-center text-sm leading-5 text-blue-grey-300 sm:mr-6">
                  <font-awesome-icon
                    class="flex-shrink-0 mr-1.5 text-blue-grey-500"
                    size="lg"
                    icon="arrows-alt-h" />
                  {{ Math.round(fitData.activity.sessions[0]['total_distance'] * 10) / 10 + ' km' }}
                </div>
                <div class="mt-2 flex items-center text-sm leading-5 text-blue-grey-300 sm:mr-6">
                  <font-awesome-icon
                    class="flex-shrink-0 mr-1.5 text-blue-grey-500"
                    size="lg"
                    icon="stopwatch" />
                  {{ new Date(fitData.activity.sessions[0]['total_elapsed_time'] * 1000).toISOString().substr(11, 8) + ' h' }}
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
        />
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
      city: ''
    };
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
</style>
