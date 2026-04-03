<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">SportsMeeting</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" aria-expanded="false" data-bs-target="#navbarText">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link active" :to="{name:'home'}">首页</router-link>
          </li>
          <li class="nav-item">
            <router-link id="Athlete" class="nav-link" :to="{name:'Athletes'}">运动员</router-link>
          </li>
          <li class="nav-item">
            <router-link id="Event" class="nav-link" :to="{name:'EventInformation'}">赛事项目</router-link>
          </li>
          <li class="nav-item">
            <router-link id="Ranking" class="nav-link" :to="{name:'ScoreStatisticsAndRankingQuery'}">分数统计与排名查询</router-link>
          </li>
        </ul>

        <ul class="navbar-nav">
          <!-- 未登录：登录/注册 -->
          <template v-if="!isLoggedIn">
            <li class="nav-item">
              <router-link id="Login" class="nav-link" :to="{name:'Login'}">登录</router-link>
            </li>
            <li class="nav-item">
              <router-link id="Register" class="nav-link" :to="{name:'Register'}">注册</router-link>
            </li>
          </template>

          <!-- 已登录：全部统一 router-link -->
          <template v-else>
            <li class="nav-item">
              <!-- 格式统一成 router-link，功能完全不变！ -->
              <router-link
                  class="nav-link"
                  to=""
                  @click.prevent="goMyDetail"
              >
                欢迎，{{ username }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                  class="nav-link"
                  to=""
                  @click.prevent="logout"
              >
                退出
              </router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted  , watch } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: "NavBar",
  setup() {
    const router = useRouter()
    const username = ref('')
    const isLoggedIn = ref(false)
    const userRole = ref('')

    // 检查登录状态
    const checkLoginStatus = () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
      if (userInfo.username) {
        username.value = userInfo.username
        isLoggedIn.value = true
        userRole.value = userInfo.role
      } else {
        username.value = ''
        isLoggedIn.value = false
        userRole.value = ''
      }
    }

    watch(
        () => router.currentRoute.value.fullPath,
        () =>{
          checkLoginStatus()
        }
    )

    // 点击用户名 → 跳转到自己的详情
    const goMyDetail = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
      const myName = userInfo.username // 直接拿用户名（就是运动员名）

      if (!myName) return

      // ✅ 直接用 name 跳转！！！ 根本不需要查接口、不需要拿 id！
      router.push(`/AthletesDetailed/${myName}`)
    }

    // 退出登录
    const logout = () => {
      localStorage.removeItem('userInfo')
      checkLoginStatus()
      router.push('/')
    }

    onMounted(() => {
      checkLoginStatus()
    })

    return {
      userRole,
      username,
      isLoggedIn,
      goMyDetail,
      logout
    }
  }
}
</script>

<style scoped>
.nav-link {
  cursor: pointer;
}
</style>