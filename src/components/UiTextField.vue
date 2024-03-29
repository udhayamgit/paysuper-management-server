<template>
<div class="text-field">
  <input
    v-model="inputValue"
    v-bind="{ type, required, disabled }"
    :class="inputClasses"
    @blur="$emit('blur')"
    @focus="$emit('focus')"
    @input="$emit('input', inputValue)"
  >
  <label
    class="label"
    :title="label"
  >
    {{ label }}
  </label>
  <span
    v-if="isVisibleError"
    class="error"
    :title="errorText"
  >
    {{ errorText }}
  </span>
  <span
    v-if="additionalInfo"
    class="additional"
    :title="additionalInfo"
  >
    {{ additionalInfo }}
  </span>
</div>
</template>

<script>
export default {
  props: {
    additionalInfo: {
      default: '',
      type: String,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    errorText: {
      default: '',
      type: String,
    },
    hasError: {
      default: false,
      type: Boolean,
    },
    label: {
      default: '',
      type: String,
    },
    required: {
      default: false,
      type: Boolean,
    },
    type: {
      default: 'text',
      type: String,
    },
    value: {
      default: '',
      type: [String, Number],
    },
  },
  data() {
    return {
      inputValue: this.value,
    };
  },
  computed: {
    /**
     * Error is visible if it exists and error text isn't empty
     * @return {boolean}
     */
    isVisibleError() {
      return !!(this.hasError && this.errorText);
    },
    /**
     * Classes for input
     * @return {Array<string>}
     */
    inputClasses() {
      const isEmpty = !this.inputValue && this.inputValue !== 0;
      return [
        'input',
        isEmpty ? '_empty' : '',
        this.isVisibleError ? '_error' : '',
        this.disabled ? '_disabled' : '',
        this.required ? '_required' : '',
      ];
    },
  },
  watch: {
    value(val) {
      this.inputValue = val;
    },
  },
};
</script>

<style scoped lang="scss">
/** @TODO - move to gui for typographics */
$input-background-color: #fff;
$primary-input-color: #000000;
$secondary-input-color: #5e6366;
$focus-input-color: #3787ff;
$error-input-color: #ff6f6f;

$primary-input-size: 16px;
$secondary-input-size: 12px;
$left-indent: 12px;

.text-field {
  display: inline-block;
  padding: 24px 0;
  position: relative;
  width: 100%;
}
.input {
  background-color: $input-background-color;
  border-width: 0;
  border-bottom-width: 1px;
  border-color: #e5e5e5;
  box-sizing: border-box;
  color: $primary-input-color;
  display: block;
  font-size: $primary-input-size;
  height: 32px;
  line-height: 32px;
  outline: none;
  padding: 0 0 0 12px;
  transition: border-color 0.2s ease-out;
  width: 100%;

  &:focus {
    border-color: $focus-input-color;
  }

  &:focus ~ .label,
  &:not(:focus):not(._empty) ~ .label {
    width: 50%;
    transform: translateY(-24px) scale(0.75, 0.75);
  }
  &:focus ~ .label {
    pointer-events: auto;
    color: $focus-input-color;
  }
  &:not(:focus):not(._empty) ~ .label {
    color: $secondary-input-color;
  }

  &._error {
    &:focus ~ .label {
      color: $error-input-color;
    }

    border-color: $error-input-color;
  }

  &._disabled {
    color: $secondary-input-color;
    pointer-events: none;
  }

  &._required ~ .label {
    &:after {
      content: "*";
    }
  }
}
.additional,
.label {
  color: $secondary-input-color;
  line-height: 32px;
  margin: 0;
  overflow: hidden;
  position: absolute;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.label {
  font-size: $primary-input-size;
  left: 0;
  pointer-events: none;
  top: 24px;
  transform-origin: left;
  transition: transform 0.2s ease-out, color 0.2s linear, width 0.1s ease-out;
  width: 100%;
  margin-left: 12px;

  &:after {
    color: #ea3d2f;
  }
}
.additional {
  font-size: $secondary-input-size;
  max-width: 50%;
  right: 0;
  top: 0;
}
.error {
  bottom: 0;
  left: $left-indent;
  color: $error-input-color;
  display: block;
  font-size: $secondary-input-size;
  position: absolute;
}
</style>
