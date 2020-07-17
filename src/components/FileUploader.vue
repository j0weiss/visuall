<template>
  <form
    class="p-1 bg-white rounded border border-blue-grey-200"
    @dropenter.prevent.stop
    @dragover.prevent.stop="$event.dataTransfer.dropEffect = 'move'"
    @drop.prevent.stop="loadFile($event)">
    <div class="h-full p-4 rounded border-dashed border-2 border-blue-grey-400 grid justify-center content-center">
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
