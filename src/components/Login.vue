<template>
<div class="login">
  <el-form class="form" :rules="rule" :model="form">
    <el-form-item label="账号" prop="account">
      <el-input v-model="form.account" placeholder="请输入账号" icon = "el-icon-caret-right" ></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="form.password" placeholder="请输入密码" icon = "el-icon-caret-right"></el-input>
    </el-form-item>
  </el-form>
  <el-row>
    <el-button class="button" @click="login()">登录</el-button>
    <!-- <el-button class="button"> -->
  </el-row>
</div>
</template>

<script>
import Component from 'vue-class-component'
import Vue from 'vue'
import shared from '../shared'
import { Login as L } from '../services/login'
@Component()
export default class Login extends Vue {
  form = {
    account: '',
    password: ''
  }
  rule = {
    account: [
      { required: true, message: '账号不能为空', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '密码不能为空', trigger: 'blur' }
    ]
  }
  async mounted () {
    if (shared.isLogin) {
      this.$router.push(`${shared.role}/home`)
    } else {
      this.$router.push('/login')
    }
  }
  async login () {
    try {
      if (this.form.account !== '' && this.form.password !== '') {
        await L.login(this, this.form.account, this.form.password)
        await shared.init()
        this.$router.push(`${shared.role}/home`)
      } else {
        this.$alert('用户名和账号不能为空')
      }
    } catch (error) {
      this.$alert(error.message)
    }
  }
}
</script>

<style scoped>
  .login {
    margin-top: 10px;
  }
  .form {
    margin-top: 20px;
    margin-left: 35%;
    width: 30%;
  }
  .button {
    margin-top: 1%;
  }
</style>
