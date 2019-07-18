<template>
    <div class="container">
        <el-carousel :interval="4000">
            <el-carousel-item v-for="(item,index) in indexBannersData" :key="index">
                <div class="banner_content">
                    <a class="img" :href="item.url"><img :alt="item.banner_name" :src="item.src"/></a>
                    <h6><a :href="item.url">{{item.banner_name}}</a></h6>
                </div>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<style lang="scss" scoped>
    .banner_content {
        position: relative;
    }

    h6 {
        position: absolute;
        bottom: 0;
        height: 50px;
        line-height: 50px;
        width: 100%;
        background: rgba(36, 103, 168, 0.8);
    }

    h6 a {
        color: #fff;
        padding: 10px;
    }
</style>

<script>
    export default {
        name: 'indexBanners',
        data() {
            return {
                indexBannersData: [
                    {banner_name: '国家电网', url: "http://www.baidu.com", src: "./static/index/images/banners/banner01.jpg"},
                    {banner_name: '鉴定会', url: "http://www.baidu.com", src: "./static/index/images/banners/banner02.jpg"},
                    {banner_name: 'bokeyigo',url: "http://www.baidu.com",src: "./static/index/images/banners/banner03.jpg"},
                    {banner_name: 'yigo案例',url: "http://www.baidu.com", src: "./static/index/images/banners/banner04.jpg"}
                ]
            };
        },
        methods: {},
        mounted() {

        }
    };
</script>