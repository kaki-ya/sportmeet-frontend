<template>
  <ContentBase>
    <!--  内置导航栏 ：新增按钮在搜索框左侧，保留原样式 -->
    <nav class="navbar bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand">赛事项目</a>
        <form class="d-flex" role="search" @submit.prevent="handleSearch">
          <!-- 新增赛事按钮：放在搜索框左侧，保留原表单布局 -->
          <button v-if="userRole === 'admin'" class="btn btn-primary me-4" type="button" @click="openAddModal">add</button>
          <!-- 原搜索框，无任何样式修改 -->
          <input class="form-control me-3" type="search" placeholder="Search" aria-label="Search" v-model="keyword">
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </nav>

    <!--  赛事信息 ：完全保留原卡片样式、布局，仅新增编辑/删除按钮 -->
    <div class="card" v-for="item in showEvent" :key="item.eventID">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-10">
            <div class="EventName">{{ item.eventName }}</div>
            <div class="EventTime">{{ item.eventTime }}</div>
            <div class="EventPlace">{{ item.eventPlace }}</div>
          </div>
          <!-- 编辑/删除按钮：靠右显示，不影响原布局 -->
          <div class="col-2 d-flex gap-2 justify-content-end">
            <button v-if="userRole === 'admin'" class="btn btn-outline-success" @click="openEditModal(item)">编辑</button>
            <button v-if="userRole === 'admin'" class="btn btn-outline-success" @click="handleDelete(item.eventId)">删除</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增/编辑赛事弹窗：独立弹窗，不影响原样式 -->
    <div class="modal fade" id="eventModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? '编辑赛事' : '新增赛事' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label">赛事名称 <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="form.eventName" placeholder="请输入赛事名称" required>
            </div>
            <div class="mb-3">
              <label class="form-label">赛事时间 <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="form.eventTime" placeholder="请输入赛事时间" required>
            </div>
            <div class="mb-3">
              <label class="form-label">赛事地点 <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="form.eventPlace" placeholder="请输入赛事地点" required>
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
import ContentBase from '../components/ContentBase';
import axios from "axios";
// 引入Bootstrap模态框（确保弹窗正常工作）
import * as bootstrap from 'bootstrap'

export default{
  name:"EventInformation",
  components:{
    ContentBase,
  },

  data() {
    return {
      userRole: '',
      keyword: '',          // 搜索关键词
      eventList: [],        // 赛事列表（后端返回）
      isEdit: false,        // 区分新增/编辑模式
      form: {               // 新增/编辑表单数据
        eventId: '',
        eventName: '',
        eventTime: '',
        eventPlace: ''
      }
    }
  },

  mounted() {
    // 页面加载完成后获取所有赛事，替换原错误的getAthleteList
    this.getAllEvents()
    this.getUserRole()
  },

  computed:{
    showEvent(){
      if(!this.keyword) return this.eventList;
      return this.eventList.filter(item => {
        if (!item || !item.eventName) return false;
        return item.eventName.includes(this.keyword);
      })
    }
  },

  methods:{
    getUserRole(){
      const userInfo = JSON.parse(localStorage.getItem('userInfo') ||'{}')
      this.userRole  = userInfo.role || '';
    },
    // 1. 查询所有赛事（对接/SearchAll）
    async getAllEvents(){
      try{
        const res = await axios.get("http://localhost:8081/Events/SearchAll")
        this.eventList = res.data // 赋值后端返回数据
        console.log('获取所有赛事成功：', res.data)
      }catch (err){
        console.log('获取事件数据失败' , err);
        alert('加载数据失败，请检查是不是后端没启动');
      }
    },

    // 2. 模糊搜索赛事（对接/SearchEventIndistinct）
    async handleSearch(){
      if(!this.keyword.trim()){
        this.getAllEvents() // 搜索框为空则加载全部
        return
      }
      try{
        const res = await axios.get("http://localhost:8081/Events/SearchEventIndistinct", {
          params: { name: this.keyword } // 传递搜索名称参数
        })
        this.eventList = res.data
      }catch(err){
        console.log('搜索赛事失败：', err)
        alert('搜索失败，请检查后端接口')
      }
    },

    // 打开新增弹窗
    openAddModal(){
      this.isEdit = false // 标记为新增模式
      // 重置表单，避免残留数据
      this.form = { eventID: '', eventName: '', eventTime: '', eventPlace: '' }
      // 显示弹窗
      new bootstrap.Modal(document.getElementById('eventModal')).show()
    },

    // 打开编辑弹窗（回显当前赛事数据）
    openEditModal(item){
      this.isEdit = true // 标记为编辑模式
      // 深拷贝当前赛事数据到表单，避免原数据被修改
      this.form = { ...item }
      // 显示弹窗
      new bootstrap.Modal(document.getElementById('eventModal')).show()
    },

    async submitForm(){
      try{
        if(this.isEdit){
          // 编辑模式：调用更新接口
          await axios.post("http://localhost:8081/Events/UpdateEvent", this.form)
          alert('赛事编辑成功！')
        }else{
          // 新增模式：调用新增接口
          await axios.post("http://localhost:8081/Events/AddEvent", this.form)
          alert('赛事新增成功！')
        }
        // 关闭弹窗
        bootstrap.Modal.getInstance(document.getElementById('eventModal')).hide()
        // 刷新赛事列表，实时显示最新数据
        this.getAllEvents()
      }catch(err){
        console.log('提交赛事失败：', err)
        alert(this.isEdit ? '编辑失败' : '新增失败' + '，请检查数据格式')
      }
    },

    // 4. 删除赛事（对接/DeleteEvent）
    async handleDelete(eventId){
      // 二次确认，防止误删
      if(!confirm('确定要删除该赛事吗？删除后无法恢复！')) return
      try{
        await axios.post("http://localhost:8081/Events/DeleteEvent", { eventId })
        alert('赛事删除成功！')
        // 刷新列表
        this.getAllEvents()
      }catch(err){
        console.log('删除赛事失败：', err)
        alert('删除失败，请检查后端接口')
      }
    }
  }
}
</script>

<style scoped>
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

/*  =========  新增样式：解决按钮过高  =========  */
/* 1. 重置导航栏的默认内边距，消除上下多余空白 */
.navbar {
  padding-top: 0;
  padding-bottom: 0;
}

/* 2. 让导航栏内的元素垂直居中 */
.navbar .container-fluid {
  align-items: center;
}

/* 3. 精准控制按钮高度，让按钮变矮 */
.navbar .btn {
  height: 38px;      /* 设定一个固定的矮高度 */
  line-height: 1;    /* 文字垂直居中 */
  padding: 0 12px;   /* 左右留白，不要太挤 */
  font-size: 14px;   /* 稍微缩小字体，更协调 */
}

/* 4. 控制搜索框高度，使其和按钮一样高 */
.navbar .form-control {
  height: 38px;
}
</style>