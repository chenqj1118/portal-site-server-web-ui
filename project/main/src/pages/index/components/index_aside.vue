<template>
    <div class="indexAside">

        <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
                <span>使用帮助</span>
                <el-button style="float: right; padding: 3px 0" type="text">MORE</el-button>
            </div>
            <div v-for="(item,index) in helpsData" :key="index" class="text item">
                <a :href="item.url">{{item.title}}</a>
            </div>
        </el-card>

        <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
                <span>制度规范</span>
                <el-button style="float: right; padding: 3px 0" type="text">MORE</el-button>
            </div>
            <div v-for="(item,index) in rulesData" :key="index" class="text item">
                <a :href="item.url">{{item.title}}</a>
            </div>
        </el-card>

        <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
                <span>公司信息</span>
                <el-button style="float: right; padding: 3px 0" type="text">MORE</el-button>
            </div>
            <div v-for="(item,index) in comsInfoData" :key="index" class="text item">
                <a :href="item.url">{{item.title}}</a>
            </div>
        </el-card>

        <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
                <span>投诉建议</span>
                <el-button style="float: right; padding: 3px 0" type="text">MORE</el-button>
            </div>
            <div v-for="(item,index) in complainsData" :key="index" class="text item">
                <a :href="item.url">{{item.title}}</a>
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
                helpsData:[{title:'我要注册',url:'www.baidu.com'},
                    {title:'我是供应商',url:'www.baidu.com'},
                    {title:'我是游客',url:'www.baidu.com'},
                    {title:'帮助文档',url:'www.baidu.com'}],
                rulesData:[{title:'供应商承诺',url:'www.baidu.com'},
                    {title:'供应商管理办法',url:'www.baidu.com'},
                    {title:'网上交易规则',url:'www.baidu.com'},
                    {title:'法律法规',url:'www.baidu.com'},
                    {title:'供应商承诺',url:'www.baidu.com'},
                    {title:'供应商管理办法',url:'www.baidu.com'},
                    {title:'网上交易规则',url:'www.baidu.com'},
                    {title:'法律法规',url:'www.baidu.com'}],
                comsInfoData:[{title:'香港友联',url:'www.baidu.com'},
                    {title:'深圳重工',url:'www.baidu.com'},
                    {title:'重庆招铝',url:'www.baidu.com'},
                    {title:'金',url:'www.baidu.com'},
                    {title:'我要注册',url:'www.baidu.com'},
                    {title:'香港友联',url:'www.baidu.com'},
                    {title:'深圳重工',url:'www.baidu.com'},
                    {title:'重庆招铝',url:'www.baidu.com'},
                    {title:'金',url:'www.baidu.com'},
                    {title:'我要注册',url:'www.baidu.com'}],
                complainsData:[{title:'投诉',url:'www.baidu.com'},
                    {title:'建议',url:'www.baidu.com'},
                    {title:'我是游客',url:'www.baidu.com'},
                    {title:'投诉',url:'www.baidu.com'},
                    {title:'建议',url:'www.baidu.com'},
                    {title:'我是游客',url:'www.baidu.com'}]
            }
        },
        methods: {},
        mounted() {

        }
    };
</script>