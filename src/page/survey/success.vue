<template>
  <div class="main">
    <logo></logo>
    <div class="pos">
      <i class="el-icon-circle-check " style=""></i>
      <p>問卷結束，謝謝</p>
    </div>
  </div>
</template>

<script>
  import logo from '../../components/header'
  export default {
    name: 'success',
    components: {logo},
    methods: {
      initRelation () {

      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .main{
    max-width: 1000px;
    margin: 0 auto;
  }
  .pos {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -50px;
    margin-left: -50px;
  }

  .pos .el-icon-circle-check {
    color: #80e480;
    font-size: 100px;
  }

</style>
