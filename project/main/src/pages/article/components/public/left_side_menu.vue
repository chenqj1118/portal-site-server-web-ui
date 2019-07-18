<template>
    <div class="leftSideMenu">
		<h2><span>新闻公告</span></h2>
		<div class="menuItem">
			<h3><span>新闻</span></h3>
			<el-menu
			  :default-active="$route.path"
			  class="el-menu-vertical-demo"		  
			  router
			  >
				<el-menu-item index="/index" >
					<span slot="title">新闻动态</span>
				</el-menu-item>
				<el-menu-item index="/child/奖励信息">
					<span slot="title">奖励信息</span>
				</el-menu-item>
				<el-menu-item index="/child/降级信息">
					<span slot="title">降级信息</span>
				</el-menu-item>
				<el-menu-item index="/child/处罚信息">
					<span slot="title">处罚信息</span>
				</el-menu-item>
				<el-menu-item index="/child/廉政在线">
					<span slot="title">廉政在线</span>
				</el-menu-item>
				<el-menu-item index="/child/新政权利">
					<span slot="title">新政权利</span>
				</el-menu-item>
				<el-menu-item index="/child/办事指南">
					<span slot="title">办事指南</span>
				</el-menu-item>
				<el-menu-item index="/child/资料下载">
					<span slot="title">资料下载</span>
				</el-menu-item>
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
