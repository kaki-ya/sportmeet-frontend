<template>
  <ContentBase>
    <div class="row justify-content-md-center">
      <div class="col-3">
        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="username" class="form-label">用户名</label>
            <input v-model="username" type="text" class="form-control" id="username">
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">密码</label>
            <input v-model="password" type="password" class="form-control" id="password">
          </div>
          <div class="mb-3">
            <label for="role" class="form-label">角色</label>
            <select v-model="role" class="form-select">
              <option disabled value="">请选择角色</option>
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>
          </div>
          <div class="error-message">{{ errorMessage }}</div>
          <button type="submit" class="btn btn-primary">登录</button>
        </form>
      </div>
    </div>
  </ContentBase>
</template>

<script>
import ContentBase from '../components/ContentBase';
import { ref } from 'vue'
import axios from 'axios';
import { useRouter } from 'vue-router';

// 关键配置：后端端口是 8081
axios.defaults.baseURL = "http://localhost:8081";

export default{
  name: "LoginView",
  components: { ContentBase },
  setup() {
    const router = useRouter();
    const username = ref('')
    const password = ref('')
    const role = ref('')
    const errorMessage = ref('')

    // ======================
    // 修复后的登录方法（完全匹配你的后端！）
    // ======================
    const login = async () => {
      if (!username.value || !password.value || !role.value) {
        errorMessage.value = "请填写完整信息";
        return;
      }

      try {
        // 重点：用 params 传递 @RequestParam 格式！
        const res = await axios.post("/User/login", null, {
          params: {
            username: username.value,
            passwd: password.value,
            role: role.value,
          }
        });

        // 登录成功
        if (res.data === "登录成功") {
          // alert("登录成功！");

          // 保存登录信息
          localStorage.setItem("userInfo", JSON.stringify({
            username: username.value,
            role: role.value
          }));
          router.push('/').then(() => {
            window.location.reload();
          });
        } else {
          errorMessage.value = res.data;
        }

      } catch (err) {
        console.error(err);
        errorMessage.value = "登录失败：服务器异常";
      }
    };

    return {
      username,
      password,
      role,
      errorMessage,
      login
    }
  }
}
</script>

<style scoped>
button{ width: 100%; }
.error-message{ color: red; }
</style>