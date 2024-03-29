<script>
import { OpenFileDialog } from '@/helpers/uploader';
import getMessageFromError from '@/helpers/getMessageFromError';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    uploadImage: {
      required: true,
      type: Function,
    },
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isDragOver: false,
      errorMessage: '',
    };
  },
  methods: {
    async uploadFile(file) {
      try {
        const { url } = await this.uploadImage(file);
        this.$emit('change', url);
      } catch (error) {
        let message = getMessageFromError(error);
        if (!message) {
          message = 'Unknown error';
          console.error(error);
        }
        this.errorMessage = message;
      }
    },
    dropFile(event) {
      event.stopPropagation();
      event.preventDefault();
      this.isDragOver = false;
      this.uploadFile(event.dataTransfer.files[0]);
    },
    removeImage() {
      this.$emit('change', '');
    },
    selectFile() {
      OpenFileDialog('image/*', this.uploadFile);
    },
    handleAreaClick() {
      if (this.errorMessage) {
        this.errorMessage = '';
      } else {
        this.selectFile();
      }
    },
  },
};
</script>

<template>
<div
  class="image-upload"
  @click="handleAreaClick"
  @dragover.prevent="isDragOver = true"
  @dragleave="isDragOver = false"
  @drop.prevent="dropFile"
>
  <div
    class="image"
    :class="{'_no-image': !value}"
    :style="{backgroundImage: `url(${value})`}"
  >
    <IconNoImage v-if="!value" width="22" height="22" fill="#C6CACC" />
  </div>
  <div
    class="info"
    :class="{ '_dragover': isDragOver, '_error': errorMessage }"
  >
    <template v-if="errorMessage">
      <div class="description">
        <IconWarning class="info-icon" />
        {{errorMessage}}
      </div>
    </template>
    <template v-else>
      <div class="controls">
        <span
          class="upload-button"
        >
          <IconUpload />
          Update cover
        </span>
        <span
          v-if="value"
          class="delete-button"
          @click.stop="removeImage"
        >
          <IconDelete />
          Delete
        </span>
      </div>
      <div class="description">
        .png, .jpg, .jpeg, max size 30Mb, min 200x300px; max 1000x1500px
      </div>
    </template>

  </div>
</div>
</template>

<style scoped lang="scss">
$hover-text-color: #3d7bf5;
$error-text-color: #ea3d2f;
.image-upload {
  display: flex;
  cursor: pointer;
}
.image {
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;

  &._no-image {
    background-color: #f1f3f4;
  }
}

.title {
  font-size: 12px;
  line-height: 16px;
  color: #5e6366;
  padding-left: 12px;
  margin-bottom: 8px;
}

.info {
  width: 328px;
  margin-left: 17px;
  cursor: pointer;
  color: #919699;

  &._error {
    border-color: rgba($error-text-color, 0.48);
    color: $error-text-color;
  }
}

.info-icon {
  vertical-align: middle;
  margin-right: 4px;
}

.description {
  font-size: 12px;
  line-height: 16px;
  padding-top: 6px;
}

.upload-button,
.delete-button {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;

  & > svg {
    margin: 0 8px 0 0;
  }
}

.upload-button {
  color: #3d7bf5;

  & > svg {
    fill: #3d7bf5;
  }
}

.delete-button {
  color: #ea3d2f;

  &::before {
    content: "";
    width: 1px;
    height: 16px;
    background: #e3e5e6;
    margin: 0 16px;
  }
}
</style>
