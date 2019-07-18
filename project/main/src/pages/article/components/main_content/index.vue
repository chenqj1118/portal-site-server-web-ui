<template>
    <div class="main_content">
		<h2><span>新闻动态</span></h2>
		<el-table
				:data="tableData"
				:show-header="false"
				style="width: 100%">
			<el-table-column
					label="标题">
				<template slot-scope="scope">
					<a href="http://www.baidu.com">{{scope.row.title}}</a>
				</template>
			</el-table-column>
			<el-table-column
					prop="time"
					label="时间"
					width="250px"
					>
			</el-table-column>
		</el-table>
		<el-pagination
				small
				layout="prev, pager, next"
				prev-text="上一页"
				next-text="下一页"
				:total="50">
		</el-pagination>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [{
					title: '关于生产和使用消耗臭氧层物质建设项目管理有关工作的通知',
                    time: '2016-05-02 12:22:13'
                },{
					title: '关于生产和使用消耗臭氧层物质建设项目管理有关工作的通知',
					time: '2016-05-02 12:22:13'
				},{
					title: '关于生产和使用消耗臭氧层物质建设项目管理有关工作的通知',
					time: '2016-05-02 12:22:13'
				},{
					title: '关于生产和使用消耗臭氧层物质建设项目管理有关工作的通知',
					time: '2016-05-02 12:22:13'
				},{
					title: '关于生产和使用消耗臭氧层物质建设项目管理有关工作的通知',
					time: '2016-05-02 12:22:13'
				},{
					title: '关于生产和使用消耗臭氧层物质建设项目管理有关工作的通知',
					time: '2016-05-02 12:22:13'
				},{
					title: '关于生产和使用消耗臭氧层物质建设项目管理有关工作的通知',
					time: '2016-05-02 12:22:13'
				},{
					title: '关于生产和使用消耗臭氧层物质建设项目管理有关工作的通知',
					time: '2016-05-02 12:22:13'
				},{
					title: '关于生产和使用消耗臭氧层物质建设项目管理有关工作的通知',
					time: '2016-05-02 12:22:13'
				},{
					title: '关于生产和使用消耗臭氧层物质建设项目管理有关工作的通知',
					time: '2016-05-02 12:22:13'
				},{
					title: '关于生产和使用消耗臭氧层物质建设项目管理有关工作的通知',
					time: '2016-05-02 12:22:13'
				},{
					title: '关于生产和使用消耗臭氧层物质建设项目管理有关工作的通知',
					time: '2016-05-02 12:22:13'
				}]
            }
        },
        methods: {},
        mounted() {

        }
    };
</script>
<style lang="scss" scoped>
</style>
