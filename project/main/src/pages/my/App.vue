<template>
  <div id="app">
	<breadCrumbs></breadCrumbs>
	<el-container style="padding:20px 30px 30px;">
	  <el-aside width="200px">
		<leftSideMenu></leftSideMenu>
	  </el-aside>
	  <el-main>
		<router-view/>
	  </el-main>
	</el-container>  
	
    
  </div>
</template>

<script>
import leftSideMenu from './components/public/left_side_menu'
import breadCrumbs from './components/public/bread_crumbs'
export default {
  name: 'App',
  components:{
	leftSideMenu,
	breadCrumbs
  }
}
</script>

<style lang="scss" scoped>

</style>
