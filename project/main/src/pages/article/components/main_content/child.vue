<template>
    <div class="main_content">
		<h2><span>{{pageName}}</span></h2>
		<div>{{pageName}}</div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                pageName:''
            }
        },
        methods: {
			getPageName(){
				this.pageName = this.$route.params.name;
			}
		},
        mounted() {
			this.getPageName();
        },
		watch: {
			'$route' (to,from){
				this.getPageName();
			}
		}
    };
</script>
<style lang="scss" scoped>
</style>
