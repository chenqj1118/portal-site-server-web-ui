<template>
    <div class="indexAside">

        <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
                <span>最新动态</span>
                <el-button style="float: right; padding: 3px 0" type="text">MORE</el-button>
            </div>
            <div class="item">
                <el-table
                        :data="tableData"
                        :show-header="false"
                        style="width: 100%">
                    <el-table-column
                            prop="address"
                            label="地址">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="姓名"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="date"
                            label="日期"
                            width="180">
                    </el-table-column>
                </el-table>
            </div>
        </el-card>

        <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
                <span>询价公告</span>
                <el-button style="float: right; padding: 3px 0" type="text">MORE</el-button>
            </div>
            <div class="item">
                <el-table
                        :data="tableData"
                        :show-header="false"
                        style="width: 100%">
                    <el-table-column
                            prop="address"
                            label="地址">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="姓名"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="date"
                            label="日期"
                            width="180">
                    </el-table-column>
                </el-table>
            </div>
        </el-card>

        <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
                <span>中选公告</span>
                <el-button style="float: right; padding: 3px 0" type="text">MORE</el-button>
            </div>
            <div class="item">
                <el-table
                        :data="tableData"
                        :show-header="false"
                        style="width: 100%">
                    <el-table-column
                            prop="address"
                            label="地址">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="姓名"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="date"
                            label="日期"
                            width="180">
                    </el-table-column>
                </el-table>
            </div>
        </el-card>

        <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
                <span>变更公告</span>
                <el-button style="float: right; padding: 3px 0" type="text">MORE</el-button>
            </div>
            <div class="item">
                <el-table
                        :data="tableData"
                        :show-header="false"
                        style="width: 100%">
                    <el-table-column
                            prop="address"
                            label="地址">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="姓名"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="date"
                            label="日期"
                            width="180">
                    </el-table-column>
                </el-table>
            </div>
        </el-card>


    </div>
</template>

<style lang="scss" scoped>

</style>

<script>
    export default {
        data() {
            return {
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }]
            }
        },
        methods: {},
        mounted() {

        }
    };
</script>