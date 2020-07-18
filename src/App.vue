<template>
  <div
    id="app"
    class="h-screen bg-blue-grey-050">
    <div class="bg-blue-grey-800 pb-32">
      <nav class="bg-blue-grey-800">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div class="border-b border-blue-grey-700">
            <div class="flex items-center justify-between h-16 px-4 sm:px-0">
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
              <div>
                <div class="ml-10 flex items-baseline">
                  <a
                    href="#"
                    class="ml-4 px-3 py-2 rounded-md
                           text-sm font-medium text-blue-grey-300
                           hover:text-white">
                    About
                  </a>
                  <a
                    href="https://github.com/j0weiss/visuall"
                    class="ml-4 px-3 py-2 rounded-md
                           text-base font-medium text-blue-grey-300
                           hover:text-white">
                    <font-awesome-icon :icon="['fab', 'github']" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <header class="py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl leading-9 font-bold text-white">
            Dashboard
          </h1>
        </div>
      </header>
    </div>

    <main class="-mt-32">
      <div class="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
        <!-- Replace with your content -->
        <FileUploader
          v-if="fitData === undefined"
          class="w-2/3 h-64"
          @file-uploaded="(file) => parseFile(file)" />
        <!-- /End replace -->
      </div>
    </main>
  </div>

  <!--  <div-->
  <!--    id="app"-->
  <!--    class="min-h-screen bg-blue-grey-050">-->
  <!--    <header class="bg-blue-900 flex justify-center">-->
  <!--      <h1 class="p-2 text-white text-3xl">-->
  <!--        VISUALL-->
  <!--      </h1>-->
  <!--      <font-awesome-icon :icon="['fab', 'github']" />-->
  <!--    </header>-->
  <!--    <main class="p-4 flex justify-center items-center">-->
<!--      <FileViewer-->
<!--        v-else-->
<!--        :fit-data="fitData"-->
<!--      />-->
<!--    </main>-->
<!--  </div>-->
</template>

<script>
import FileUploader from '@/components/FileUploader.vue';
// const FileViewer = () => import('@/components/FileViewer.vue');

export default {
  name: 'App',
  components: {
    FileUploader
    // FileViewer
  },
  data() {
    return {
      fitData: undefined
    };
  },
  methods: {
    async parseFile(file) {
      this.fitData = await this.$parseFitFile(file);
    }
  }
};
</script>

<style>
  body {
    min-height: 100vh;
  }
</style>
