<template>
  <ContentBase>
    <nav class="navbar bg-body-tertiary">
      <div class="container-fluid d-flex align-items-center justify-content-between">
        <a class="navbar-brand">队伍信息管理</a>
        <button
            id="AddTeam"
            v-if="userRole === 'admin'"
            class="btn btn-primary"
            type="button"
            @click="openAddModal"
        >
          新增队伍
        </button>
      </div>
    </nav>

    <!-- 队伍卡片：点击跳转到详情页 -->
    <div
        id="TeamIndividual"
        v-for="item in teams"
        :key="item.teamId"
        class="card"
        @click="goTeamDetail(item.teamId)"
    style="cursor: pointer"
    >
    <div class="card-body">
      <div class="row align-items-center">
        <div class="col-10">
          <div class="TeamName">{{ item.teamName }}</div>
          <div class="TeamId">队伍ID：{{ item.teamId }}</div>
        </div>

        <div class="col-2 d-flex gap-2 justify-content-end">
          <button
              v-if="userRole === 'admin'"
              class="btn btn-outline-success"
              @click.stop="openEditModal(item)"
          >
            编辑
          </button>
          <button
              v-if="userRole === 'admin'"
              class="btn btn-outline-danger"
              @click.stop="handleDelete(item.teamId)"
          >
            删除
          </button>
        </div>
      </div>
    </div>
    </div>

    <div v-if="teams.length === 0" class="text-center mt-5 text-muted">
      暂无队伍数据
    </div>

    <!-- 新增/编辑弹窗 -->
    <div class="modal fade" id="teamModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? '编辑队伍' : '新增队伍' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label">队伍名称 <span class="text-danger">*</span></label>
              <input class="form-control" v-model="form.teamName" placeholder="请输入队伍名称" required>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="submitForm">提交</button>
          </div>
        </div>
      </div>
    </div>

  </ContentBase>
</template>

<script>
import ContentBase from "@/components/ContentBase.vue";
import axios from "axios";
import * as bootstrap from 'bootstrap'
import { useRouter } from 'vue-router'

export default{
  name:"TeamInformation",
  components:{ ContentBase },
  setup(){
    const router = useRouter()
    return { router }
  },

  data() {
    return {
      userRole: '',
      teams: [],
      isEdit: false,
      form: { teamId: '', teamName: '' }
    }
  },

  mounted() {
    this.getUserRole()
    this.getAllTeams()
  },

  methods:{
    // 获取用户角色
    getUserRole(){
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
      this.userRole = userInfo.role || '';
    },

    // 获取所有队伍
    async getAllTeams(){
      try{
        const res = await axios.get("http://localhost:8081/Teams/SearchAllTeam")
        this.teams = res.data
      }catch (err){
        console.log('获取队伍失败', err);
      }
    },

    goTeamDetail(teamId){
      this.router.push(`/TeamDetail/${teamId}`)
    },

    // 打开新增弹窗
    openAddModal(){
      this.isEdit = false
      this.form = { teamId: '', teamName: '' }
      new bootstrap.Modal(document.getElementById('teamModal')).show()
    },

    // 打开编辑弹窗
    openEditModal(item){
      this.isEdit = true
      this.form = { ...item }
      new bootstrap.Modal(document.getElementById('teamModal')).show()
    },

    // 提交新增/编辑
    async submitForm(){
      if(!this.form.teamName.trim()){
        alert('队伍名称不能为空')
        return
      }
      try{
        if(this.isEdit){
          await axios.post("http://localhost:8081/Teams/UpdateTeam", this.form)
        }else{
          await axios.post("http://localhost:8081/Teams/AddTeam", this.form)
        }
        bootstrap.Modal.getInstance(document.getElementById('teamModal')).hide()
        this.getAllTeams()
      }catch(err){
        alert('提交失败')
      }
    },

    // 删除队伍
    async handleDelete(teamId){
      if(!confirm('确定删除？')) return
      try{
        await axios.post("http://localhost:8081/Teams/DeleteTeam", { teamId })
        this.getAllTeams()
      }catch(err){
        alert('删除失败')
      }
    }
  }
}
</script>

<style scoped>
.card { margin: 20px 0; }
.card:hover { box-shadow: 0 2px 10px #ccc; transition: 0.3s; }
.TeamName { font-size: 18px; font-weight: 500; }
.TeamId { font-size: 14px; color: #666; }
.navbar { padding: 8px 0; margin-bottom: 10px; }
</style>