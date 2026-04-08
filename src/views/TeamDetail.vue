<template>
  <ContentBase>
    <!-- 导航栏：保留返回按钮，样式统一 -->
    <nav class="navbar bg-body-tertiary">
      <div class="container-fluid d-flex align-items-center justify-content-between">
        <a class="navbar-brand">队伍详情</a>
        <button class="btn btn-outline-secondary" @click="goBack">返回队伍列表</button>
      </div>
    </nav>

    <!-- 队伍核心信息：整合ID/名称/实时总分，卡片样式优化 -->
    <div class="card mt-3">
      <div class="card-body">
        <h4 class="card-title mb-3">{{ teamInfo.teamName }}</h4>
        <div class="row">
          <div class="col-6">
            <p class="mb-1"><strong>队伍ID：</strong>{{ teamId }}</p>
          </div>
          <div class="col-6">
            <p class="mb-1 text-primary"><strong>队伍实时总分：</strong>{{ teamScore }} 分</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 该队伍运动员列表：点击卡片跳转到运动员详情页 -->
    <div class="mt-4">
      <h5 class="mb-3">
       <b> 队伍成员</b>
      </h5>
      <div
          class="card mt-2"
          v-for="item in athleteList"
          :key="item.athleteId"
          @click="goAthleteDetail(item.athleteName)"
          style="cursor: pointer"
      >
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-8">
              <p class="mb-1"><strong>姓名：</strong>{{ item.athleteName }}</p>
              <p class="mb-0"><strong>运动员编号：</strong>{{ item.athleteId }}</p>
            </div>
            <div class="col-4 text-end text-muted">
              点击查看详情
            </div>
          </div>
        </div>
      </div>

      <!-- 无运动员提示 -->
      <div v-if="athleteList.length === 0" class="text-center mt-5 text-muted p-3">
        该队伍暂无注册运动员
      </div>
    </div>

  </ContentBase>
</template>

<script>
import ContentBase from "@/components/ContentBase.vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

export default {
  name: "TeamDetail",
  components: { ContentBase },
  // 路由实例：setup中获取，兼容Vue3
  setup() {
    const router = useRouter();
    const route = useRoute();
    return { router, route };
  },

  data() {
    return {
      teamId: "",        // 路由传参的队伍ID
      teamInfo: {},      // 队伍基础信息（名称/ID）
      athleteList: [],   // 多表联查的队伍运动员列表
      teamScore: 0       // 队伍实时总分
    };
  },

  // 页面加载：一次性获取队伍信息+运动员+总分
  mounted() {
    this.teamId = this.route.params.teamId;
    this.getTeamInfo();        // 获取队伍基础信息
    this.getAthletesByTeamId();// 多表联查获取运动员
    this.getTeamRealScore();   // 获取队伍实时总分
  },

  methods: {
    // 返回上一页（队伍列表）
    goBack() {
      this.router.go(-1);
    },

    // 新增：点击运动员跳转到运动员详情页，携带athleteId
    goAthleteDetail(athleteName) {
      this.router.push(`/AthletesDetailed/${athleteName}`);
    },

    // 获取队伍基础信息（从所有队伍中匹配）
    async getTeamInfo() {
      try {
        const res = await axios.get("http://localhost:8081/Teams/SearchAllTeam");
        this.teamInfo = res.data.find(t => t.teamId == this.teamId) || {};
      } catch (e) {
        console.log("获取队伍基础信息失败：", e);
      }
    },

    // 多表联查：获取该队伍下所有运动员（复用你新增的接口）
    async getAthletesByTeamId() {
      try {
        const res = await axios.get(`http://localhost:8081/Teams/getAthletesByTeamId/${this.teamId}`);
        this.athleteList = res.data;
      } catch (e) {
        console.log("多表联查获取运动员失败：", e);
      }
    },

    // 新增：获取队伍实时总分（复用你已有的getRealTimeTeamRank接口）
    async getTeamRealScore() {
      try {
        const res = await axios.get("http://localhost:8081/Teams/getRealTimeTeamRank");
        // 匹配当前队伍的总分，无数据则为0
        const currentTeam = res.data.find(t => t.teamId == this.teamId);
        this.teamScore = currentTeam ? currentTeam.teamScore : 0;
      } catch (e) {
        console.log("获取队伍实时总分失败：", e);
        this.teamScore = 0; // 异常时默认0分
      }
    }
  }
};
</script>

<style scoped>
/* 队伍信息卡片样式优化 */
.card {
  margin-bottom: 15px;
  border: 1px solid #eee;
}

/* 运动员卡片hover效果，和队伍卡片统一 */
.card:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

/* 导航栏样式统一 */
.navbar {
  padding: 8px 0;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.btn {
  height: 38px;
  line-height: 1;
  padding: 0 16px;
  font-size: 14px;
}
</style>