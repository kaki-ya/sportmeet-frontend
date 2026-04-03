<template>
  <!-- 使用导入的导航栏组件 -->
  <NavBar/>
  <!-- 使用router-view动态显示页面信息 -->
  <router-view/>
</template>

<script>
//引入导航栏组件
import NavBar from "@/components/NavBar.vue";
//导入bootstrap样式和动态
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';

export default {
  name: "App",//名字
  components:{//使用的组件

    //导航栏
    NavBar,
  }

}

</script>

<style>

</style>
