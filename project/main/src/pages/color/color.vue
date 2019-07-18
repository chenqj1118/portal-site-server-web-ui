<template>
    <div id="app">
        <header class="primaryColor" style="padding:50px;">header: 请选择你想要的主题风格</header>
        <div style="padding:30px;">
            <theme></theme>
            <el-row>
                <el-button>默认按钮</el-button>
                <el-button type="primary">主要按钮</el-button>
                <el-button type="success">成功按钮</el-button>
                <el-button type="info">信息按钮</el-button>
                <el-button type="warning">警告按钮</el-button>
                <el-button type="danger">危险按钮</el-button>
            </el-row>
            <el-row>
                <el-button plain>朴素按钮</el-button>
                <el-button type="primary" plain>主要按钮</el-button>
                <el-button type="success" plain>成功按钮</el-button>
                <el-button type="info" plain>信息按钮</el-button>
                <el-button type="warning" plain>警告按钮</el-button>
                <el-button type="danger" plain>危险按钮</el-button>
            </el-row>
        </div>
        <footer class="primaryColor" style="padding:50px;">footer</footer>

      </div>
</template>

<script>
  import theme from './components/theme/Theme.vue';
  export default {
      data(){
          return {

          }
      },
      components:{
          theme
      },
  };
</script>

<style scoped>
	
</style>