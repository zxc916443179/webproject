<template>
  <header>
    <el-row class="header">
      <el-col :span="19">
        <img src="../../assets/images/header/header.png" alt="基层单位维修管理平台" style="width = 100%"/>
      </el-col>
      <el-col :span="5" v-if="isLogin">
        <el-row>
          <el-col style="margin-left: 13%;margin-top: 5%;">
            <i>欢迎回来</i>
            <el-button type="text" @click="open()">{{ account }}</el-button>
          </el-col>
          <el-col style="margin-top: 3%;margin-left: 9%;">
            <el-button type="danger" @click="logout()">注销</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="infoVisible" title="个人信息">
      <span>
        <el-row>
          <el-col :span="13">
          <el-form ref="info" :model="infoData">
            <el-form-item label="用户名">
              <el-input v-model="infoData.account" style="width: 50%;margin-right: -11%;" :disabled="true"></el-input>
            </el-form-item>
          </el-form>
          </el-col>
          <el-col :span="10">
            <el-form ref="info" :model="infoData">
              <el-form-item label="真实姓名">
                <el-input v-model="infoData.realName" style="width: 50%;"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="13">
          <el-form ref="info" :model="infoData">
            <el-form-item label="密码">
              <el-input v-model="infoData.password" style="width: 50%;margin-right: -15%;" :disabled="true" type="password"></el-input>
            </el-form-item>
          </el-form>
          </el-col>
          <el-col :span="10">
            <el-form ref="info" :model="infoData">
              <el-form-item label="电话号码">
                <el-input v-model="infoData.tel" style="width: 50%;"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="13">
          <el-form ref="info" :model="infoData">
            <el-form-item label="性别">
              <el-radio v-model="infoData.gender" label="男">男</el-radio>
              <el-radio v-model="infoData.gender" label="女">女</el-radio>
            </el-form-item>
          </el-form>
          </el-col>
          <el-col :span="10">
            <el-form ref="info" :model="infoData">
              <el-form-item label="年龄">
                <el-input v-model="infoData.age" style="width: 50%;margin-left: 10.2%"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="13">
          <el-form ref="info" :model="infoData">
            <el-form-item label="email">
              <el-input v-model="infoData.email" style="width: 50%;margin-right: -13.4%;"></el-input>
            </el-form-item>
          </el-form>
          </el-col>
          <el-col :span="10">
            <el-form ref="info" :model="infoData">
              <el-form-item label="角色">
                <el-input v-model="infoData.role" style="width: 50%;margin-left: 11%;" :disabled="true"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-form ref="info" :model="infoData">
            <el-form-item label="备注">
              <el-input type="textarea" :rows="2" v-model="infoData.fix"></el-input>
            </el-form-item>
          </el-form>
        </el-row>
      </span>
      <span slot="footer">
        <el-button @click="infoVisible = false" type="danger">取消</el-button>
        <el-button type="primary" @click="onCommit()">保存</el-button>
        <el-button type="warning" @click="openPass()">修改密码</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="passVisible" title="修改密码">
      <span>
        <el-form ref="pass" :model="passData">
          <el-form-item label="原密码">
            <el-input type="password" v-model="passData.old" placeholder="请输入原密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input type="password" v-model="passData.new" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码确认">
            <el-input type="password" v-model="passData.news" placeholder="请再次输入新密码"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer">
        <el-button @click="passVisible = false" type="danger">取消</el-button>
        <el-button type="primary" @click="onPassCommit()">提交</el-button>
      </span>
    </el-dialog>
  </header>
</template>

<script>
import Component from 'vue-class-component'
import Vue from 'vue'
import shared from '@/shared'
import { Login, User } from '@/services/login'
@Component({
  computed: {
    isLogin () {
      return shared.isLogin
    },
    account () {
      return shared.account
    }
  }
})
export default class HeaderBar extends Vue {
  infoVisible = false
  passVisible = false
  passData = {
    old: '', new: '', news: ''
  }
  infoData = {
    realName: '', role: '', fix: '', gender: '', tel: '', email: '', age: '', account: '', password: '', id: 0
  }
  async logout () {
    try {
      await Login.logout(this, shared.account)
      this.$message({
        message: '注销成功',
        type: 'success'
      })
      shared.isLogin = false
      shared.account = ''
      shared.isLogin = ''
      this.$router.push('/login')
    } catch (error) {
      this.$alert(error)
    }
  }
  async open () {
    this.infoVisible = true
    this.infoData.realName = shared.realName
    this.infoData.role = shared.role
    this.infoData.fix = shared.fix
    this.infoData.gender = shared.gender
    this.infoData.tel = shared.tel
    this.infoData.email = shared.email
    this.infoData.age = shared.age
    this.infoData.account = shared.account
    this.infoData.id = shared.id
  }
  async onCommit () {
    try {
      await User.updateInfo(this, this.infoData.realName, this.infoData.fix, this.infoData.gender, this.infoData.tel, this.infoData.email,
      this.infoData.age, this.infoData.id)
      await shared.init(this)
      this.$message({
        message: '修改成功',
        type: 'success'
      })
      this.infoVisible = false
    } catch (error) {
      this.$alert(error)
    }
  }
  async onPassCommit () {
    if (this.passData.new !== this.passData.news) {
      this.$message({
        message: '两次密码输入不同',
        type: 'warning'
      })
    } else if (this.passData.new === '') {
      this.$message({
        message: '请输入新密码',
        type: 'warning'
      })
    } else {
      try {
        await User.updatePass(this, shared.id, this.passData.news)
        this.$message({
          message: '修改成功', type: 'success'
        })
      } catch (e) {
        this.$alert(e)
      } finally {
        this.passVisible = false
      }
    }
  }
  async openPass () {
    this.infoVisible = false
    this.passVisible = true
  }
  mounted () {
    if (shared.isLogin === false) {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
  header {
    margin: 0;
  }
  el-form-item {
    width: 30px;
  }
</style>
