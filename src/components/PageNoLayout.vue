<script>
export default {
  name: 'PageNoLayout',

  beforeMount() {
    document.body.classList.add('page-no-layout-body');
    document.body.parentNode.classList.add('page-no-layout-html');
  },

  destroyed() {
    document.body.classList.remove('page-no-layout-body');
    document.body.parentNode.classList.remove('page-no-layout-html');
  },
};
</script>

<template>
<div class="template-page-no-layout">
  <slot></slot>
</div>
</template>

<style lang="scss">
@import url("//static.protocol.one/common/fonts/Lato.css");
@import "@/assets/scss/_custom.scss";
.page-no-layout-body {
  margin: 0;
  font-family: Lato, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  line-height: 1.25;

  * {
    box-sizing: border-box;
  }
}
.page-no-layout-body,
.page-no-layout-html {
  display: flex;
  flex-direction: column;
}
.template-page-no-layout {
  a {
    text-decoration: none;
    color: #2f6ecd;

    &:hover {
      text-decoration: underline;
    }
  }

  p {
    margin: 0;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  label {
    margin: 0;
  }
}
</style>
