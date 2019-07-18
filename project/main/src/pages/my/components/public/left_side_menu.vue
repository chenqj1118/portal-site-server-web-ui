<template>
    <div class="leftSideMenu">
		<h2><span>个人账户</span></h2>
		<div class="menuItem">
			<h3><span>采购业务</span></h3>
			<el-menu
			  :default-active="$route.path"
			  class="el-menu-vertical-demo"		  
			  router
			  >
				  <el-menu-item index="/index">定价项目</el-menu-item>
				  <el-menu-item index="/child/送货单管理">送货单管理</el-menu-item>
				  <el-menu-item index="/child/采购订单跟踪">采购订单跟踪</el-menu-item>
				  <el-menu-item index="/child/期货报表">期货报表</el-menu-item>
				  <el-menu-item index="/child/合同管理">合同管理</el-menu-item>
				  <el-menu-item index="/child/订单计划管理">订单计划管理</el-menu-item>
			</el-menu>
		</div>
		<div class="menuItem">
			<h3><span>企业信息</span></h3>
			<el-menu
			  :default-active="$route.path"
			  class="el-menu-vertical-demo"
			  router
			  >
				  <el-menu-item index="/index">定价项目</el-menu-item>
				  <el-menu-item index="/child/送货单管理">送货单管理</el-menu-item>
				  <el-menu-item index="/child/采购订单跟踪">采购订单跟踪</el-menu-item>
				  <el-menu-item index="/child/期货报表">期货报表</el-menu-item>
				  <el-menu-item index="/child/合同管理">合同管理</el-menu-item>
				  <el-menu-item index="/child/订单计划管理">订单计划管理</el-menu-item>
			</el-menu>
		</div>		
    </div>
</template>
<script>
export default {
    name:'leftSideMenu',
	methods: {
    }
}
</script>
<style lang="scss" scoped>
</style>
