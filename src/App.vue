<template>
  <div style="height: 100%">
    <router-view></router-view>
  </div>
</template>
<script>
</script>
<style>
  * {
    margin: 0px;
    padding: 0px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, SimSun, sans-serif;
  }

  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    min-width: 1280px;
  }

  input {
    outline-style: none;
  }

  h1, h2, h3, h4, h5, h6, b, strong {
    font-weight: normal;
  }

  i, em {
    font-style: normal;
  }

  li {
    list-style: none;
  }

  textarea {
    outline-style: none;
    border: 1px solid #e7e7e7;
    border-radius: 2px;
    padding: 10px;
    box-sizing: border-box;
  }

  .small-left-meau-style .v-modal {
    margin-left: 50px;
  }

  .small-left-meau-style .el-message-box__wrapper {
    left: 50px;
  }

  ::-webkit-input-placeholder { /* WebKit browsers */
    color: #ccc;
  }

  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #ccc;
  }

  ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #ccc;
  }

  :-ms-input-placeholder { /* Internet Explorer 10+ */
    color: #ccc;
  }

</style>
