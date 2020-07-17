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
      <FileUploader
        v-if="fitData === undefined"
        class="w-1/2 h-64"
        @file-uploaded="(file) => parseFile(file)" />
      <FileViewer
        v-else
        :fit-data="fitData"
      />
    </main>
    <footer class="p-1 flex justify-center">
      Footer
    </footer>
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
