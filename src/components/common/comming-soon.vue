<template>
  <div class="develping">
    <img width="640" height="471" src="../../assets/image/developing.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>
<script>
  export default {
    props: {
      title: {
        type: String,
        default: '敬请期待...'
      }
    },
    mounted() {
      this.$mountUtil.pushState();
    },
  }
</script>
<style>
  .develping {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    font-size: 0;
  }

  .develping img {
    margin-top: 20px;
    width: 300px;
    height: 300px;
  }

  .develping .desc {
    margin-top: -16px;
    font-family: 'Microsoft YaHei';
    font-size: 20px;
    color: #4b4b4b;
    text-align: center;
  }
</style>
