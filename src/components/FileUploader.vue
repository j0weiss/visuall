<template>
  <form
    class="bg-white rounded-lg shadow px-5 py-6 sm:px-6"
    @dropenter.prevent.stop
    @dragover.prevent.stop="$event.dataTransfer.dropEffect = 'move'"
    @drop.prevent.stop="loadFile($event)">
    <div
      class="h-full border-4 border-dashed border-blue-grey-200 rounded-lg
             grid justify-center content-center">
      <p>
        Get started by uploading your workout file
      </p>
      <input
        type="file"
        accept=".fit"
        @change="loadFile($event)">
    </div>
  </form>
</template>

<script>

export default {
  name: 'FileUploader',
  data() {
    return {
      errorMessage: ''
    };
  },
  methods: {
    loadFile(event) {
      const files = event.type === 'drop'
        ? event.dataTransfer.files
        : event.target.files;

      if (files.length > 1) {
        this.errorMessage = 'Only one file';
      } else {
        this.$emit('file-uploaded', files[0]);
      }
    }
  }
};
</script>
