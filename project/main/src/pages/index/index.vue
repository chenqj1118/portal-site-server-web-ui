<template>
    <div id="app">
        <!-- banner -->
        <indexBanner class="mb20"></indexBanner>
        <div class="container">
            <el-container>
                <el-aside width="300px"><indexAside></indexAside></el-aside>
                <el-main><indexMain></indexMain></el-main>
            </el-container>
        </div>
    </div>
</template>

<script>
   import indexBanner from './components/index_banner';
   import indexAside from './components/index_aside';
   import indexMain from './components/index_main';
   export default {
       data(){
           return {

           }
       },
      components:{
          indexBanner,
          indexAside,
          indexMain
      }
  };
</script>

<style  lang="scss" scoped>
	
</style>