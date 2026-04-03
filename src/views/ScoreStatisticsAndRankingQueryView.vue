<template>
  <ContentBase>
    <div class="mt-3 mb-3 d-flex justify-content-between align-items-center">
      <h5>成绩统计与排名查询</h5>
      <button v-if="userRole === 'admin'" class="btn btn-sm btn-primary" @click="openAddModal">新增报名</button>
    </div>

    <div class="row g-4">
      <!-- 左侧：运动员排名 -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span>🏆 赛事排名（运动员）</span>
          </div>

          <div class="card-body p-2">
            <ul class="list-group">
              <li
                  class="list-group-item d-flex justify-content-between align-items-center"
                  v-for="(item, index) in eventRankList"
                  :key="index"
              >
                <div class="d-flex align-items-center gap-3">
                  <div class="rank-badge" :class="index < 3 ? 'top3' : ''">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <div class="TeamName">{{ item.athleteName }}</div>
                    <div class="Score">总分：{{ item.score || 0 }}</div>
                  </div>
                </div>
                <div class="d-flex gap-2">
                  <button v-if="userRole === 'admin'" class="btn btn-outline-success" @click="openUpdateModal(item)">修改分数</button>
                  <button v-if="userRole === 'admin'" class="btn btn-outline-success" @click="deleteRacing(item)">删除</button>
                </div>
              </li>
              <li class="list-group-item text-center text-muted" v-if="eventRankList.length === 0">
                暂无该赛事数据
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 右侧：队伍排名 -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span> 队伍排名（总分）</span>
            <button class="btn btn-sm btn-success" @click="getTeamRank">刷新</button>
          </div>
          <div class="card-body p-2">
            <ul class="list-group">
              <li
                  class="list-group-item d-flex align-items-center gap-3"
                  v-for="(item, index) in teamRankList"
                  :key="item.teamId"
              >
                <div class="rank-badge" :class="index < 3 ? 'top3' : ''">{{ index + 1 }}</div>
                <div class="flex-grow-1">
                  <div class="TeamName">{{ item.teamName }}</div>
                  <div class="Score">总得分：{{ item.teamScore || 0 }}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增弹窗 -->
    <div class="modal fade" id="addModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header"><h5>新增报名</h5></div>
          <div class="modal-body p-3">
            <select class="form-select mb-2" v-model="addForm.athleteID">
              <option v-for="item in athleteList" :key="item.athleteId" :value="item.athleteId">{{ item.athleteName }}</option>
            </select>
            <select class="form-select" v-model="addForm.eventID">
              <option v-for="item in eventList" :key="item.eventID" :value="item.eventID">{{ item.eventName }}</option>
            </select>
          </div>
          <div class="modal-footer">
            <button class="btn btn-sm btn-secondary" data-bs-dismiss="modal">取消</button>
            <button class="btn btn-sm btn-primary" @click="addRacing">确认新增</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改弹窗 -->
    <div class="modal fade" id="updateModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header"><h5>修改分数</h5></div>
          <div class="modal-body p-3">
            <input type="number" class="form-control" v-model="updateForm.score">
          </div>
          <div class="modal-footer">
            <button class="btn btn-sm btn-secondary" data-bs-dismiss="modal">取消</button>
            <button class="btn btn-sm btn-warning" @click="updateRacingScore">保存</button>
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
  name: "ScoreStatisticsAndRankingQueryView",
  components: { ContentBase },
  data() {
    return {
      userRole: '',
      eventList: [],
      athleteList: [],
      eventRankList: [],
      teamRankList: [],
      addForm: { athleteID: "", eventID: "" },
      updateForm: { id: "", score: "" }
    };
  },
  mounted() {
    this.loadAllData();
    this.getUserRole();
  },
  methods: {
    getUserRole(){
      const userInfo = JSON.parse(localStorage.getItem('userInfo') ||'{}')
      this.userRole  = userInfo.role || '';
    },

    async loadAllData() {
      await Promise.all([this.getEventList(), this.getAthleteList(), this.getTeamRank()]);
      this.getEventRank();
    },
    async getEventList() {
      const { data } = await axios.get("http://localhost:8081/Events/SearchAll");
      this.eventList = data;
    },
    async getAthleteList() {
      const { data } = await axios.get("http://localhost:8081/Athlete/SearchAll");
      this.athleteList = data;
    },

    async getEventRank() {
      try {
        const { data } = await axios.get("http://localhost:8081/Racings/selectRankByEventName");
        const map = {};
        data.forEach(item => {
          const name = item.athleteName;
          if (map[name]) {
            map[name].score += item.score;
          } else {
            map[name] = { ...item, originId: item.id };
          }
        });
        this.eventRankList = Object.values(map).sort((a, b) => b.score - a.score);
      } catch (e) {
        console.error(e);
        this.eventRankList = [];
      }
    },

    async getTeamRank() {
      const {data} = await axios.get("http://localhost:8081/Teams/SearchAllTeam");
      this.teamRankList = data.sort((a, b) => (b.teamScore || 0) - (a.teamScore || 0));
    },
    openAddModal() {
      new bootstrap.Modal(document.getElementById("addModal")).show();
    },
    async addRacing() {
      await axios.post("http://localhost:8081/Racings/AddRacing", this.addForm);
      alert("新增成功");
      this.getEventRank();
      bootstrap.Modal.getInstance(document.getElementById("addModal")).hide();
    },
    openUpdateModal(item) {
      this.updateForm.id = item.originId || item.id;
      this.updateForm.score = item.score || 0;
      new bootstrap.Modal(document.getElementById("updateModal")).show();
    },

    // ✅ 修复完成：修改分数
    async updateRacingScore() {
      try {
        if (!this.updateForm.id) {
          alert("错误：记录ID不能为空");
          return;
        }
        if (this.updateForm.score === "" || isNaN(this.updateForm.score)) {
          alert("错误：请输入有效数字");
          return;
        }

        await axios.post("http://localhost:8081/Racings/UpdateRacingScore", null, {
          params: {
            id: Number(this.updateForm.id),
            score: Number(this.updateForm.score)
          }
        });

        alert("修改成功");
        this.getEventRank();
        this.getTeamRank();
        bootstrap.Modal.getInstance(document.getElementById("updateModal")).hide();
      } catch (err) {
        console.error(err);
        alert("修改失败：参数错误或服务器异常");
      }
    },

    // ✅ 修复完成：删除
    async deleteRacing(item) {
      if (!confirm("确定删除？")) return;
      try {
        const deleteId = item.originId || item.id;
        if (!deleteId) {
          alert("错误：无法获取记录ID");
          return;
        }

        await axios.post("http://localhost:8081/Racings/DeleteRacing", null, {
          params: {id: deleteId}
        });

        alert("删除成功");
        this.getEventRank();
        this.getTeamRank();
      } catch (err) {
        console.error(err);
        alert("删除失败");
      }
    }
  }
};
</script>

<style scoped>
.TeamName {
  font-weight: bold;
}

.Score {
  font-size: 10px;
  color: lightgray;
}

.rank-badge {
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 50%;
  background: #ccc;
  color: #fff;
  font-size: 12px;
  flex-shrink: 0;
}

.rank-badge.top3 {
  background: #ffc107;
  color: #000;
  font-weight: bold;
}

.list-group-item {
  padding: 8px 12px !important;
}
</style>