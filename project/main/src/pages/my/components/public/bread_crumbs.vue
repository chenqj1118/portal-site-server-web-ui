<template>
    <section class="breadCrumbs">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }"><i class="fa fa-home fa-x" aria-hidden="true"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/' }">采购业务</el-breadcrumb-item>
                <el-breadcrumb-item>定价项目</el-breadcrumb-item>
            </el-breadcrumb>
    </section>
</template>
<script>
    export default {
        name: 'breadCrumbs',
        data() {
            return {}
        }
    }
</script>
<style lang="scss" scoped>
</style>