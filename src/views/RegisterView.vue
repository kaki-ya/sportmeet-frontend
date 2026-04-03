<template>
  <ContentBase>
    <div class="row justify-content-md-center">
      <div class="col-3">
        <form @submit.prevent="register">
          <div class="mb-3">
            <label for="username" class="form-label">用户名</label>
            <input v-model="username" type="text" class="form-control" id="username">
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">密码</label>
            <input v-model="password" type="password" class="form-control" id="password">
          </div>

          <div class="mb-3">
            <label for="password_confirm" class="form-label">确认密码</label>
            <input v-model="password_confirm" type="password" class="form-control" id="password_confirm">
          </div>

          <div class="mb-3">
            <label for="role" class="form-label">角色</label>
            <select v-model="role" class="form-select" id="role">
              <option value="" disabled>请选择角色</option>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>

          <div class="error-message mb-2">{{ errorMessage }}</div>

          <button type="submit" class="btn btn-primary">注册</button>
        </form>
      </div>
    </div>
  </ContentBase>
</template>

<script>
import ContentBase from '../components/ContentBase'
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

axios.defaults.baseURL = "http://localhost:8081";

export default {
  name: 'RegisterView',
  components: {ContentBase},
  setup() {
    const router = useRouter()

    const username = ref('')
    const password = ref('')
    const password_confirm = ref('')
    const role = ref('')
    const errorMessage = ref('')

    const register = async () => {
      if (!username.value || !password.value || !password_confirm.value || !role.value) {
        errorMessage.value = "请填写所有字段"
        return
      }
      if (password.value !== password_confirm.value) {
        errorMessage.value = "两次密码不一致"
        return
      }

      try {
        // 1. 调用注册接口
        const res = await axios.post("/User/register", {
          username: username.value,
          passwd: password.value,
          role: role.value
        })

        // 2. 拿到后端返回的 userId（自增ID）
        const userId = res.data

        // 3. ✅ 弹窗显示注册成功 + 用户ID
        alert(`注册成功！你的用户ID是：${userId}`)

        // 4. 跳转到登录页
        router.push('/login')

      } catch (err) {
        console.error(err)
        errorMessage.value = "注册失败：用户名已存在或服务器异常"
      }
    }

    return {
      username,
      password,
      password_confirm,
      role,
      errorMessage,
      register
    }
  }
}
</script>

<style scoped>
button {
  width: 100%;
}

.error-message {
  color: red;
}
</style>