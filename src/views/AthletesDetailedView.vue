<template>
  <ContentBase>
    <div class="card position-relative overflow-hidden" style="height: 768px; border: none;">
      <img src="../img/背景.webp" class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover" style="z-index: 0;">

      <div class="card-body position-relative" style="z-index: 1;">
        <div class="col-md-12 d-flex justify-content-center align-items-center">
          <div class="card w-100 shadow-lg" v-if="athlete && athlete.athleteId">
            <div class="row g-0 align-items-center">
              <!-- 头像 -->
              <div class="col-3 d-flex justify-content-center align-items-center">
                <img :src="athlete.athletePhoto" class="img-fluid" style="width: 110px; height: 110px; border-radius: 50%; object-fit: cover; border: 3px solid #f0f0f0;">
              </div>
              <!-- 信息 -->
              <div class="col-6">
                <div class="card-body p-4" style="line-height: 1.8;">
                  <h5 class="fw-bold mb-2">{{ athlete.athleteName }}</h5>
                  <p class="text-muted mb-1">ID：{{ athlete.athleteId }}</p>
                  <p class="text-muted mb-1">性别：{{ athlete.athleteGender }}</p>
                  <p class="text-muted mb-0">队伍ID：{{ athlete.teamID }}</p>
                </div>
              </div>
              <!-- 按钮组（修改 + 删除 + 报名赛事） -->
              <div  class="col-3 d-flex flex-column gap-2 pe-4">
                <button @click="openUpdateModal" id="changeAthlete" class="btn btn-outline-success">
                  修改运动员
                </button>
                <button v-if="userRole === 'admin'" @click="handleDelete" class="btn btn-outline-success">
                  删除运动员
                </button>
                <!-- ✅ 新增：报名赛事按钮 -->
                <button @click="openJoinEventModal" id="addEvent" class="btn btn-outline-success">
                  报名赛事
                </button>
              </div>
            </div>
          </div>

          <div v-else class="text-center" style="font-size: 18px;">
            <button class="btn btn-sm btn-primary" @click="openAddModal">
              暂无绑定运动员，点击绑定运动员
            </button>
          </div>
        </div>

        <!-- 留言板原样不动 -->
        <div class="col-md-12 d-flex justify-content-center align-items-center mt-4">
          <div class="card w-100 shadow-lg" style="border-radius: 20px; background: #fff; min-height: 500px;">
            <div class="card-header">
              <h6 class="mb-1">运动员留言板</h6>
            </div>
            <div class="card-body overflow-y-auto" style="max-height: 380px;">
              <div v-for="(msg, index) in messages" :key="index" class="p-3 border-bottom">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <span class="fw-bold">匿名用户</span>
                    <small class="text-muted ms-2">{{ msg.time }}</small>
                  </div>
                  <button id="messageFromUnknownUser" class="btn btn-sm btn-danger" @click="delMsg(index)">删除</button>
                </div>
                <p class="mb-0 mt-2">{{ msg.content }}</p>
              </div>
              <div v-if="messages.length === 0" class="text-center text-muted py-5">
                暂无留言，快来发表第一条吧！
              </div>
            </div>
            <div class="card-footer">
              <div class="input-group">
                <input id="TypeArea" type="text" class="form-control" placeholder="写下你的留言..." v-model="newMessage" @keyup.enter="sendMsg">
                <button id="sendMessage" class="btn btn-success" @click="sendMsg">发表留言</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增运动员弹窗 -->
    <div class="modal fade" id="addModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header"><h5>新增运动员</h5></div>
          <div class="modal-body p-3">
            <input class="form-control mb-2" v-model="addForm.athleteName" placeholder="运动员姓名">
            <select class="form-select mb-2" v-model="addForm.athleteGender">
              <option value="">请选择性别</option>
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
            <input class="form-control mb-2" v-model="addForm.athletePhoto" placeholder="头像URL">
            <input class="form-control mb-2" v-model="addForm.teamID" placeholder="队伍ID" type="number">
          </div>
          <div class="modal-footer">
            <button class="btn btn-sm btn-secondary" data-bs-dismiss="modal">取消</button>
            <button class="btn btn-sm btn-primary" @click="addAthlete">确认新增</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改运动员弹窗 -->
    <div class="modal fade" id="updateModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header"><h5>修改运动员</h5></div>
          <div class="modal-body p-3">
            <input id="changeName" class="form-control mb-2" v-model="updateForm.athleteName" placeholder="运动员姓名">
            <select class="form-select mb-2" v-model="updateForm.athleteGender">
              <option value="">请选择性别</option>
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
            <input class="form-control mb-2" v-model="updateForm.athletePhoto" placeholder="头像URL">
            <input class="form-control mb-2" v-model="updateForm.teamID" placeholder="队伍ID" type="number">
          </div>
          <div class="modal-footer">
            <button class="btn btn-sm btn-secondary" data-bs-dismiss="modal">取消</button>
            <button id="saveChange" class="btn btn-sm btn-warning" @click="updateAthlete">保存修改</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ======================
         ✅ 新增：报名赛事弹窗
     ====================== -->
    <div class="modal fade" id="joinEventModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header"><h5>报名赛事</h5></div>
          <div class="modal-body p-3">
            <div class="mb-2">当前运动员：{{ athlete.athleteName }}</div>
            <select id="SelectEvent" class="form-select" v-model="joinForm.eventID">
              <option value="">请选择赛事</option>
              <option id="EventOption" v-for="e in eventList" :key="e.eventId" :value="e.eventId">
                {{ e.eventName }}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <button class="btn btn-sm btn-secondary" data-bs-dismiss="modal">取消</button>
            <button id="confirm" class="btn btn-sm btn-primary" @click="joinEvent">确认报名</button>
          </div>
        </div>
      </div>
    </div>

  </ContentBase>
</template>

<script>
import ContentBase from '../components/ContentBase';
import axios from 'axios';
import * as bootstrap from 'bootstrap';

export default {
  name: "AthletesDetailedView",
  components: { ContentBase },
  data() {
    return {
      userRole: '',
      athlete: {},
      newMessage: '',
      messages: [],
      eventList: [], // 赛事列表
      addForm: { athleteName: '', athleteGender: '', athletePhoto: '', teamID: '' },
      updateForm: { athleteId: '', athleteName: '', athleteGender: '', athletePhoto: '', teamID: '' },
      // 报名表单
      joinForm: { athleteID: '', eventID: '' }
    };
  },
  mounted() {
    const name = this.$route.params.id;
    this.getAthleteDetail(name);
    this.getUserRole();
    this.getEventList(); // 加载赛事
  },
  methods: {
    getUserRole(){
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
      this.userRole = userInfo.role || '';
    },

    async getAthleteDetail(name) {
      try {
        const res = await axios.get("http://localhost:8081/Athlete/SearchAthleteIndistinct", { params: { name } });
        if (res.data?.length) this.athlete = res.data[0];
      } catch (err) { console.log("获取失败", err); }
    },

    // 获取所有赛事
    async getEventList() {
      const res = await axios.get("http://localhost:8081/Events/SearchAll");
      this.eventList = res.data;
    },

    // 打开报名弹窗
    openJoinEventModal() {
      this.joinForm.athleteID = this.athlete.athleteId;
      this.joinForm.eventID = '';
      new bootstrap.Modal(document.getElementById("joinEventModal")).show();
    },

    // 报名赛事（调用你的 /Racings/AddRacing）
    async joinEvent() {
      try {
        await axios.post("http://localhost:8081/Racings/AddRacing", this.joinForm);
        bootstrap.Modal.getInstance(document.getElementById("joinEventModal")).hide();
      } catch (e) {
        console.error(e);
      }
    },

    // 以下是你原有方法，完全不动
    openAddModal() { new bootstrap.Modal(document.getElementById("addModal")).show(); },
    openUpdateModal() { this.updateForm = { ...this.athlete }; new bootstrap.Modal(document.getElementById("updateModal")).show(); },
    async addAthlete() {
      if (!this.addForm.athleteName || !this.addForm.athleteGender) return alert("请填写必填项");
      await axios.post("http://localhost:8081/Athlete/AddAthlete", this.addForm);
      alert("添加成功！"); bootstrap.Modal.getInstance(document.getElementById("addModal")).hide();
      this.getAthleteDetail(this.addForm.athleteName);
    },
    async updateAthlete() {
      await axios.post("http://localhost:8081/Athlete/UpdateAthlete", this.updateForm);
      // alert("修改成功！");
      bootstrap.Modal.getInstance(document.getElementById("updateModal")).hide();
      this.getAthleteDetail(this.updateForm.athleteName);
    },
    async handleDelete() {
      if (!confirm("确定删除？")) return;
      await axios.post("http://localhost:8081/Athlete/DeleteAthlete", { athleteId: this.athlete.athleteId });
      alert("删除成功！"); this.$router.push('/Athletes');
    },
    sendMsg() {
      if (!this.newMessage.trim()) return;
      this.messages.push({ content: this.newMessage, time: new Date().toLocaleString() });
      this.newMessage = '';
    },
    delMsg(index) { this.messages.splice(index, 1); }
  }
};
</script>

<style scoped>
:deep(.card) { border: none; }
</style>