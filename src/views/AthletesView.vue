<template>
  <ContentBase>
    <!--  运动员检索框（后端将采用关键词搜索）  -->
    <nav class="navbar bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" >运动员信息搜索</a>
        <form class="d-flex" role="search">
          <input v-model="keyword" class="form-control me-2" type="search" placeholder="Search" aria-label="Search" >
          <!--     将绑定事件     -->
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </nav>

    <!--  运动员信息展示(展示信息将包括姓名、编号、性别、所属队伍等等)  -->
    <div id="AthleteIndividual" v-for="item in showAthletes" :key="item.id"  @click="goDetail(item.athleteName)">
      <div class="card" >
        <div class="card-body">
          <div class="row">
            <div class="col-1 img-field">
              <img class="img-fluid" :src="item.athletePhoto" />
            </div>
            <div class="col-11">
              <div class="username">{{ item.athleteName }}</div>
              <div class="id">{{ item.athleteId }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showAthletes.length === 0">
      暂无运动员数据
    </div>

  </ContentBase>
</template>

<script>
import ContentBase from '../components/ContentBase';
import axios from 'axios';

export default{
  name:"AthletesView",
  components: {
    ContentBase,
  },

  data() {
    return {
      keyword: '',
      athletes: [
        { id: 1, name: "csw", photo: "https://cdn.acwing.com/media/user/profile/photo/370645_lg_34aea1bf6f.jpg" },
      ]
    }
  },

  mounted() {
    // 页面加载完成后，调用后端接口获取所有运动员
    this.getAthleteList()
  },

  computed: {
      showAthletes() {
        if (!this.athletes) return [];
        return this.athletes.filter(item => {
          // 如果 item 或 item.athleteName 不存在，就返回 false
          if (!item || !item.athleteName) return false;
          return item.athleteName.includes(this.keyword);
        });
      }
  },

  methods: {
    goDetail(name) {
      this.$router.push('/AthletesDetailed/' + name)
    },
    async getAthleteList() {
      try {
        // 发GET请求到后端的/Athlete/SearchAll接口
        const res = await axios.get("http://localhost:8081/Athlete/SearchAll");
        // 把后端返回的运动员数据，赋值给athletes（覆盖空数组）
        this.athletes = res.data;
      } catch (err) {
        console.log('获取运动员数据失败：', err);
        alert('加载数据失败，请检查后端是否启动');
      }
    }
  }
}
</script>

<style scoped>
img {
  border-radius: 50%;
  width: 50px;
  height: 50px;
}

.username {
  font-weight: bold;
  height: 50%;
}

.card {
  margin-top: 20px;
}

.card {
  margin-bottom: 20px;
  cursor: pointer;
}

.card:hover {
  box-shadow: 2px 2px 10px lightgray;
  transition: 500ms;
}

.img-field {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.username {
  font-weight: bold;
  height: 50%;
}
.id {
  font-size: 12px;
  color: gray;
  height: 50%;
}

.navbar-brand {
  cursor: pointer;
}
</style>